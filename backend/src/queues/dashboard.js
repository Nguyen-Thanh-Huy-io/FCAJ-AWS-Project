const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');
const { publishQueue } = require('./publish.queue');

/**
 * Setup Bull Board Dashboard
 * Allows visual monitoring of BullMQ jobs
 */
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(publishQueue)
  ],
  serverAdapter: serverAdapter,
});

module.exports = serverAdapter;
