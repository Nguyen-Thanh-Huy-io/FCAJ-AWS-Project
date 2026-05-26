const { eventEmitter, EVENTS } = require('../event-emitter');
const brandService = require('../../services/workspace/brand.service');
const emailService = require('../../services/core/email.service');

/**
 * Initialize User Event Subscribers
 */
const initUserSubscribers = () => {
  // Handle Default Brand Creation
  eventEmitter.on(EVENTS.USER.REGISTERED, async ({ user }) => {
    try {
      console.log(`[Event] Creating default brand for user ${user.id}`);
      await brandService.createDefaultBrand(user.id);
    } catch (err) {
      console.error(`[Event Error] Default brand creation failed for user ${user.id}:`, err.message);
    }
  });

  // Handle OTP Email Sending
  eventEmitter.on(EVENTS.USER.REGISTERED, async ({ user, otp }) => {
    try {
      console.log(`[Event] Sending welcome OTP email to ${user.email}`);
      await emailService.sendOTP(user.email, otp);
    } catch (err) {
      console.error(`[Event Error] Failed to send OTP email to ${user.email}:`, err.message);
    }
  });
};

module.exports = initUserSubscribers;
