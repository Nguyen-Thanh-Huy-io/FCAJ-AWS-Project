const subscriptionGate = require('../services/subscription/subscription-gate.facade');

/**
 * Middleware to check subscription permission for a specific feature
 * @param {string} productId - Product slug to check (from PRODUCT_IDS constants)
 */
function requireFeature(productId) {
  return async (req, res, next) => {
    // Retrieve brand ID from header, query, or body
    const brandId = req.headers['x-brand-id'] || req.query.brandId || req.body?.brandId;
    if (!brandId) {
      return res.status(400).json({ 
        message: 'Missing brand configuration header (x-brand-id)',
        code: 'MISSING_BRAND_ID'
      });
    }

    const hasAccess = await subscriptionGate.checkFeatureAccess(brandId, productId);
    if (!hasAccess) {
      return res.status(403).json({
        message: 'Feature not included in your current subscription plan. Please upgrade.',
        code: 'PLAN_UPGRADE_REQUIRED',
        productId
      });
    }
    next();
  };
}

module.exports = { requireFeature };
