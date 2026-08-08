const { Queue, Worker, QueueEvents } = require('bullmq');

const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
};

// If we are in production or REDIS_TLS is set, we need to pass a tls object to ioredis
// so it connects via TLS to ElastiCache.
if (process.env.NODE_ENV === 'production' || process.env.REDIS_TLS === 'true') {
  redisConfig.tls = {
    rejectUnauthorized: false
  };
}

const defaultConnection = {
  connection: redisConfig
};

module.exports = {
  redisConfig,
  defaultConnection
};
