const { Worker } = require('bullmq');
const { defaultConnection } = require('../config/bullmq');
const { PUBLISH_QUEUE_NAME } = require('./publish.queue');
const postService = require('../services/workspace/post.service');
const postRepository = require('../repositories/workspace/post.repository');
const { POST_STATUS } = require('../utils/constants');

/**
 * Worker Engine
 * Listens to the social-publish-queue and executes post publication
 */
const publishWorker = new Worker(PUBLISH_QUEUE_NAME, async (job) => {
  const { postId } = job.data;
  
  console.log(`[BullMQ Worker] 📝 Processing job ${job.id} for Post: ${postId}`);
  
  try {
    // 1. Double check post status in DB (Safety check)
    const post = await postRepository.findById(postId);
    if (!post || (post.status !== POST_STATUS.SCHEDULED && post.status !== POST_STATUS.DRAFT)) {
      console.log(`[BullMQ Worker] ⏩ Post ${postId} is not in a valid state for publishing. Skipping.`);
      return;
    }

    // 2. Execute the publish pipeline
    await postService.publishToPlatforms(postId);
    
    console.log(`[BullMQ Worker] ✅ Successfully processed Post: ${postId}`);
  } catch (err) {
    console.error(`[BullMQ Worker] ❌ Error processing job ${job.id}:`, err.message);
    throw err; // Allow BullMQ to handle retries based on queue config
  }
}, {
  ...defaultConnection,
  concurrency: 5, // Process up to 5 posts simultaneously
});

// Event Listeners for logging/monitoring
publishWorker.on('completed', (job) => {
  console.log(`[BullMQ Worker] Job ${job.id} completed!`);
});

publishWorker.on('failed', (job, err) => {
  console.error(`[BullMQ Worker] Job ${job.id} failed with error: ${err.message}`);
});

module.exports = publishWorker;
