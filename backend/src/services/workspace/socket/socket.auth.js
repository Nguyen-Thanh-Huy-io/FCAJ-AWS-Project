const jwtUtils = require('../../../utils/jwt.utils');
const prisma = require('../../../config/prisma');

/**
 * Socket Authentication Middleware
 * Decodes JWT Token from query parameters to authenticate connection
 */
async function socketAuthMiddleware(socket, next) {
  try {
    let token = socket.handshake.auth?.token || socket.handshake.query?.token;

    // Fallback: Read from cookies in handshake headers (standard HttpOnly cookie auth)
    if (!token || token === 'dummy-token-cookie-auth') {
      const cookieHeader = socket.handshake.headers?.cookie;
      if (cookieHeader) {
        const cookies = require('cookie').parseCookie(cookieHeader);
        token = cookies.accessToken;
      }
    }

    if (!token || token === 'dummy-token-cookie-auth') {
      return next(new Error('Authentication error: Token missing'));
    }

    // Verify JWT using centralized jwtUtils
    const decoded = jwtUtils.verifyAccessToken(token);
    if (!decoded || !decoded.id) {
      return next(new Error('Authentication error: Invalid Token'));
    }

    // Check user in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      return next(new Error('Authentication error: User inactive or not found'));
    }

    // Attach user to socket instance
    socket.user = user;
    next();
  } catch (err) {
    return next(new Error(`Authentication error: ${err.message}`));
  }
}

module.exports = socketAuthMiddleware;
