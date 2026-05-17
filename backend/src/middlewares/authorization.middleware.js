const { USER_ROLES } = require('../utils/constants');

/**
 * Middleware factory to check user role
 * @param {...string} allowedRoles - roles that have access
 * @returns {Function} express middleware
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // User must be authenticated first (verifyAuth middleware should be applied before)
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const roleData = req.user.role;
    const userRole = (typeof roleData === 'string' ? roleData : roleData?.name)?.toUpperCase();

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied. Only ${allowedRoles.join(', ')} roles are allowed.`
      });
    }

    next();
  };
};

/**
 * Only ADMIN access
 */
const authorizeAdmin = authorize(USER_ROLES.ADMIN);

/**
 * Only MANAGER access
 */
const authorizeManager = authorize(USER_ROLES.MANAGER);

/**
 * Only USER access
 */
const authorizeUser = authorize(USER_ROLES.USER);

/**
 * All authenticated roles can access
 */
const authorizeAny = authorize(
  USER_ROLES.ADMIN, 
  USER_ROLES.MANAGER, 
  USER_ROLES.STAFF, 
  USER_ROLES.USER
);

module.exports = {
  authorize,
  authorizeAdmin,
  authorizeManager,
  authorizeUser,
  authorizeAny
};
