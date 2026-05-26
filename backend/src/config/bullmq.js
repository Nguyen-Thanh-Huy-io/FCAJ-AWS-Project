const { Queue, Worker, QueueEvents } = require('bullmq');

const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};

const defaultConnection = {
  connection: redisConfig
};

module.exports = {
  redisConfig,
  defaultConnection
};
