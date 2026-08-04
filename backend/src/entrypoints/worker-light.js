require('dotenv').config();
const logger = require('../utils/logger');
const prisma = require('../config/prisma');

logger.info('Starting Light Worker...');

// 1. Initialize BullMQ publish worker
const publishWorker = require('../queues/publish.worker');
logger.info('Initialized publish.worker');

logger.info('Light Worker started successfully and waiting for jobs...');

// ── Graceful Shutdown ───────────────────────────────────────────────────────
async function shutdown(signal) {
  logger.info(`Received ${signal}. Shutting down Light Worker gracefully...`);

  try {
    // Close BullMQ Worker
    const workerInstance = publishWorker.worker || publishWorker;
    if (workerInstance && typeof workerInstance.close === 'function') {
      await workerInstance.close();
      logger.info('BullMQ publish.worker closed gracefully.');
    }

    // Close DB Connection
    await prisma.$disconnect();
    logger.info('Database connection closed.');
  } catch (err) {
    logger.error('Error during Light Worker shutdown', err);
  }

  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ── Uncaught Exception / Rejection Handlers ────────────────────────────────
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception in Light Worker', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error(
    'Unhandled Promise Rejection in Light Worker',
    reason instanceof Error ? { message: reason.message, stack: reason.stack } : reason
  );
  process.exit(1);
});