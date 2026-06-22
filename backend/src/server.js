require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');
const prisma = require('./config/prisma');

const PORT = parseInt(process.env.PORT, 10) || 3000;

const server = app.listen(PORT, async () => {
  logger.info('Server started', { port: PORT, env: process.env.NODE_ENV || 'development' });

  // Seed default system permissions
  const { seedSystemPermissions } = require('./config/seeder');
  await seedSystemPermissions();

  // Initialize BullMQ publish worker
  require('./queues/publish.worker');

  // Start Discord daily member snapshot (runs every 24h)
  const discordStatsService = require('./services/social/discord/discord-stats.service');
  // Run once at startup (with small delay to let DB settle)
  setTimeout(() => discordStatsService.snapshotAllGuilds().catch(() => {}), 30_000);
  // Then every 24 hours
  setInterval(() => discordStatsService.snapshotAllGuilds().catch(() => {}), 24 * 60 * 60 * 1000);
  logger.info('Discord daily snapshot scheduler started (every 24h)');
});

// ── Graceful Shutdown ───────────────────────────────────────────────────────
async function shutdown(signal) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);

  server.close(async () => {
    logger.info('HTTP server closed.');

    try {
      await prisma.$disconnect();
      logger.info('Database connection closed.');
    } catch (err) {
      logger.error('Error closing database connection', err);
    }

    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ── Uncaught Exception / Rejection Handlers ────────────────────────────────
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception — shutting down', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection — shutting down', reason instanceof Error ? { message: reason.message, stack: reason.stack } : reason);
  process.exit(1);
});

