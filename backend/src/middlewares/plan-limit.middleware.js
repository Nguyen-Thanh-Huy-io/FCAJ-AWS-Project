const subscriptionRepository = require('../repositories/billing/subscription.repository');
const logger = require('../utils/logger');

/**
 * checkLimit middleware factory
 * ISP: Each route receives only the specific limit check it needs.
 * Usage: router.post('/brands', verifyAuth, checkLimit('maxBrands'), controller.create)
 *
 * @param {string} limitField - Key in PlanLimit (e.g. 'maxBrands', 'maxPostsPerMonth')
 */
const checkLimit = (limitField) => async (req, res, next) => {
  try {
    const brandId = req.query.brandId || req.body.brandId || req.params.brandId;
    const userId  = req.user?.id;

    // Fetch the active plan and its limits for this brand
    const subscription = await subscriptionRepository.findActivePlanByBrandId(brandId);
    if (!subscription) {
      return res.status(403).json({ message: 'Không tìm thấy gói đăng ký.' });
    }

    const limits = subscription.plan?.planLimit;
    if (!limits) {
      logger.warn('[checkLimit] PlanLimit not found', { brandId, limitField });
      return next(); // Fail open - don't block if config is missing
    }

    const limitValue = limits[limitField];

    // Boolean limits (e.g. allowCustomRoles, allowApprovalWorkflow)
    if (typeof limitValue === 'boolean') {
      if (!limitValue) {
        return res.status(403).json({
          code: 'LIMIT_REACHED',
          message: `Tính năng này không có trong gói ${subscription.plan.name}.`,
          upgradeRequired: true,
          currentPlan: subscription.plan.name
        });
      }
      return next();
    }

    // Numeric limits - need to count current usage
    const currentCount = await _countUsage(limitField, brandId, userId);

    if (currentCount >= limitValue) {
      logger.info('[checkLimit] Limit reached', { brandId, limitField, current: currentCount, max: limitValue });
      return res.status(403).json({
        code: 'LIMIT_REACHED',
        message: `Bạn đã đạt giới hạn (${currentCount}/${limitValue}) của gói ${subscription.plan.name}. Vui lòng nâng cấp!`,
        upgradeRequired: true,
        currentPlan:  subscription.plan.name,
        currentUsage: currentCount,
        maxAllowed:   limitValue,
        upgradeUrl:   '/pricing'
      });
    }

    next();
  } catch (err) {
    logger.error('[checkLimit] Error checking plan limit', { error: err.message, limitField });
    next(); // Fail open - don't block the user on internal errors
  }
};

/**
 * Internal helper: maps limitField to the correct DB count query
 */
async function _countUsage(limitField, brandId, userId) {
  switch (limitField) {
    case 'maxBrands':
      return subscriptionRepository.countBrands(userId);
    case 'maxSocialProfiles':
      return subscriptionRepository.countSocialProfiles(brandId);
    case 'maxPostsPerMonth':
      return subscriptionRepository.countPostsThisMonth(brandId);
    case 'maxTeamSeats':
      return subscriptionRepository.countTeamSeats(brandId);
    case 'maxLivePlatforms':
      return 0; // Placeholder - implement when Livestream backend is built
    default:
      logger.warn('[checkLimit] Unknown limitField', { limitField });
      return 0;
  }
}

module.exports = { checkLimit };
