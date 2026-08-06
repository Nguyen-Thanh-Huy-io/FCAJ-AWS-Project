require('dotenv').config();
const logger = require('../utils/logger');
const prisma = require('../config/prisma');

logger.info('Starting Heavy Worker...');

// 🎯 KHI NÀO VIẾT XONG WORKER THÌ UNCOMMENT DÒNG NÀY:
// const mediaWorker = require('../queues/media-processing.worker');

logger.info('Waiting for heavy tasks...');

// 💡 GIẢI PHÁP: Giữ Node.js Event Loop luôn sống trong khi chờ code Worker hoàn thiện
// Dòng này giúp Container luôn giữ trạng thái RUNNING trên ECS Fargate
const keepAlive = setInterval(() => {}, 1000 * 60 * 60);

// ── Graceful Shutdown ───────────────────────────────────────────────────────
async function shutdown(signal) {
  logger.info(`Received ${signal}. Shutting down Heavy Worker gracefully...`);

  // Xóa bộ đếm keepAlive khi dừng Container
  clearInterval(keepAlive);

  try {
    // Nếu có worker thật thì đóng kết nối worker ở đây:
    // if (mediaWorker && typeof mediaWorker.close === 'function') {
    //   await mediaWorker.close();
    // }

    // Close DB Connection
    await prisma.$disconnect();
    logger.info('Database connection closed.');
  } catch (err) {
    logger.error('Error during Heavy Worker shutdown', err);
  }

  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ── Uncaught Exception / Rejection Handlers ────────────────────────────────
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception in Heavy Worker', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error(
    'Unhandled Promise Rejection in Heavy Worker',
    reason instanceof Error ? { message: reason.message, stack: reason.stack } : reason
  );
  process.exit(1);
});