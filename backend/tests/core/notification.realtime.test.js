describe('NotificationRealtimeService pub/sub', () => {
  let notificationRealtime;
  let redisClient;

  beforeEach(() => {
    jest.resetModules();

    const handlers = {};
    redisClient = {
      subscribe: jest.fn().mockResolvedValue(),
      publish: jest.fn().mockResolvedValue(1),
      on: jest.fn((event, handler) => {
        handlers[event] = handler;
        return redisClient;
      }),
      handlers
    };

    jest.doMock('../../src/config/redis', () => redisClient);
    jest.doMock('../../src/utils/logger', () => ({
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn()
    }));

    notificationRealtime = require('../../src/services/core/notification.realtime');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.dontMock('../../src/config/redis');
    jest.dontMock('../../src/utils/logger');
  });

  it('subscribes to a user channel and delivers incoming pubsub messages to connected clients', async () => {
    const res = {
      destroyed: false,
      writableEnded: false,
      write: jest.fn()
    };

    const unsubscribe = notificationRealtime.subscribe('42', res);
    await Promise.resolve();

    expect(redisClient.subscribe).toHaveBeenCalledWith('notifications:user:42');

    notificationRealtime.publishToUser('42', 'notification.created', { id: 7 });

    expect(redisClient.publish).toHaveBeenCalledWith(
      'notifications:user:42',
      expect.stringContaining('"event":"notification.created"')
    );

    redisClient.handlers.message('notifications:user:42', JSON.stringify({
      userId: '42',
      event: 'notification.created',
      payload: { id: 7 }
    }));

    expect(res.write).toHaveBeenCalledWith('event: notification.created\n');
    expect(res.write).toHaveBeenCalledWith('data: {"id":7}\n\n');

    unsubscribe();
  });
});
