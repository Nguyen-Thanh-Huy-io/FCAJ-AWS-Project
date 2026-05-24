const prisma = require('../../config/prisma');
const redisClient = require('../../config/redis');
const postService = require('./post.service');
const { POST_STATUS } = require('../../utils/constants');

class PostSchedulerService {
  constructor() {
    this.intervalId = null;
    this.isProcessing = false;
  }

  /**
   * Start the background scheduler running every 60 seconds
   */
  start() {
    if (this.intervalId) {
      console.warn('PostSchedulerService is already running.');
      return;
    }

    console.log('PostSchedulerService started successfully.');
    
    // Run immediately on start, then repeat every minute
    this.checkAndPublishScheduledPosts().catch(err => {
      console.error('Error running initial scheduled posts check:', err.message);
    });

    this.intervalId = setInterval(async () => {
      if (this.isProcessing) {
        console.log('PostSchedulerService is busy processing a previous batch. Skipping current tick.');
        return;
      }

      this.isProcessing = true;
      try {
        await this.checkAndPublishScheduledPosts();
      } catch (err) {
        console.error('Error executing scheduled posts check tick:', err.message);
      } finally {
        this.isProcessing = false;
      }
    }, 60000); // 1 minute
  }

  /**
   * Stop the background scheduler
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('PostSchedulerService stopped.');
    }
  }

  /**
   * Scan database for pending scheduled posts and publish them
   */
  async checkAndPublishScheduledPosts() {
    // 1. Find all SCHEDULED posts due for publishing
    const posts = await prisma.post.findMany({
      where: {
        status: POST_STATUS.SCHEDULED,
        scheduledAt: {
          lte: new Date()
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    });

    if (posts.length === 0) {
      return;
    }

    console.log(`Found ${posts.length} scheduled posts due to be published.`);

    // 2. Concurrency limiting: process in batches of 5
    const batchSize = 5;
    for (let i = 0; i < posts.length; i += batchSize) {
      const batch = posts.slice(i, i + batchSize);
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
      // Set distributed lock with 5-minute expiry to prevent multiple workers from starting this post
      const lockResult = await redisClient.set(lockKey, 'true', { NX: true, EX: 300 });

      if (lockResult !== 'OK' && lockResult !== true) {
        console.log(`Post ${post.id} is locked by another instance. Skipping.`);
        return;
      }
      acquired = true;

      console.log(`Processing scheduled post ${post.id} ("${post.title}")...`);

      // Call the existing publishing function
      await postService.publishToPlatforms(post.id);

      console.log(`Successfully published scheduled post ${post.id}`);
    } catch (err) {
      console.error(`Failed to process scheduled post ${post.id}:`, err.message);
      
      // Update status in case it didn't get updated inside publishToPlatforms
      try {
        await prisma.post.update({
          where: { id: post.id },
          data: {
            status: POST_STATUS.FAILED,
            failureReason: err.message
          }
        });
      } catch (dbErr) {
        console.error(`Failed to update error status for post ${post.id}:`, dbErr.message);
      }
    } finally {
      // Release lock ONLY if we successfully acquired it
      if (acquired) {
        try {
          await redisClient.del(lockKey);
        } catch (lockErr) {
          console.error(`Failed to release lock for post ${post.id}:`, lockErr.message);
        }
      }
    }
  }
}

module.exports = new PostSchedulerService();
