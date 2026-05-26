const postRepository = require('../../repositories/workspace/post.repository');
const redisClient = require('../../config/redis');
const postService = require('./post.service');
const { POST_STATUS } = require('../../utils/constants');

class PostSchedulerService {
  constructor() {
    this.intervalId = null;
    this.isProcessing = false;
  }

  /**
   * Start the background scheduler running every 15 seconds
   */
  start() {
    if (this.intervalId) {
      console.warn('[PostScheduler] Service is already running.');
      return;
    }

    console.log('[PostScheduler] ⚙️ Service started successfully. Polling every 15s.');
    
    // Run immediately on start, then repeat every 15 seconds
    this.checkAndPublishScheduledPosts().catch(err => {
      console.error('[PostScheduler] Error running initial scheduled posts check:', err.message);
    });

    this.intervalId = setInterval(async () => {
      if (this.isProcessing) {
        return;
      }

      this.isProcessing = true;
      try {
        await this.checkAndPublishScheduledPosts();
      } catch (err) {
        console.error('[PostScheduler] Error executing scheduled posts check tick:', err.message);
      } finally {
        this.isProcessing = false;
      }
    }, 15000); 
  }

  /**
   * Stop the background scheduler
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('[PostScheduler] Service stopped.');
    }
  }

  /**
   * Scan database for pending scheduled posts and publish them
   */
  async checkAndPublishScheduledPosts() {
    const now = new Date();
    
    // 1. Find all SCHEDULED posts due for publishing
    const posts = await postRepository.findMany({
      status: POST_STATUS.SCHEDULED,
      scheduledAt: {
        lte: now
      }
    }, {
      orderBy: {
        scheduledAt: 'asc'
      }
    });

    if (posts.length === 0) {
      return;
    }

    // Filter to process only the oldest due post per Auto-List queue
    // This prevents a single autolist from clogging the batch processing
    const finalPostsToPublish = [];
    const processedAutoLists = new Set();

    for (const post of posts) {
      if (post.autoListId) {
        if (!processedAutoLists.has(post.autoListId)) {
          processedAutoLists.add(post.autoListId);
          finalPostsToPublish.push(post);
        }
      } else {
        // One-off scheduled posts are processed normally
        finalPostsToPublish.push(post);
      }
    }

    if (finalPostsToPublish.length === 0) {
      return;
    }

    console.log(`[PostScheduler] 🚀 Found ${finalPostsToPublish.length} jobs due. (Total queue: ${posts.length})`);

    // 2. Concurrency limiting: process in batches of 5
    const batchSize = 5;
    for (let i = 0; i < finalPostsToPublish.length; i += batchSize) {
      const batch = finalPostsToPublish.slice(i, i + batchSize);
      await Promise.all(batch.map(post => this.processPost(post)));
    }
  }

  /**
   * Process a single post using distributed lock
   * @param {Object} post 
   */
  async processPost(post) {
    const lockKey = `post:lock:${post.id}`;
    let acquired = false;
    
    try {
      // Set distributed lock with 5-minute expiry
      const lockResult = await redisClient.set(lockKey, 'true', { NX: true, EX: 300 });

      if (lockResult !== 'OK' && lockResult !== true) {
        console.log(`[PostScheduler] 🔒 Post ${post.id} is locked. Skipping.`);
        return;
      }
      acquired = true;

      console.log(`[PostScheduler] 📝 Processing: "${post.title}" (ID: ${post.id})...`);

      // Call the existing publishing function
      await postService.publishToPlatforms(post.id);

      console.log(`[PostScheduler] ✅ Published successfully: ${post.id}`);
    } catch (err) {
      console.error(`[PostScheduler] ❌ Failed to process ${post.id}:`, err.message);
      
      // Update status in case it didn't get updated inside publishToPlatforms
      try {
        await postRepository.update(post.id, {
          status: POST_STATUS.FAILED,
          failureReason: err.message
        });
      } catch (dbErr) {
        console.error(`[PostScheduler] DB Error updating fail status:`, dbErr.message);
      }
    } finally {
      // Release lock ONLY if we successfully acquired it
      if (acquired) {
        try {
          await redisClient.del(lockKey);
        } catch (lockErr) {
          console.error(`[PostScheduler] Lock release error:`, lockErr.message);
        }
      }
    }
  }
}

module.exports = new PostSchedulerService();
