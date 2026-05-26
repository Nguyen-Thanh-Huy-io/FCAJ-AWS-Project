const authService = require('../../services/auth/auth.service');
const loginRateLimiter = require('../../middlewares/login-rate-limit.middleware');
const { ERROR_MESSAGES, USER_ROLES } = require('../../utils/constants');
const asyncHandler = require('../../utils/async-handler');

class AuthController {
  /**
   * Get Google Login URL
   * GET /api/auth/google
   */
  googleLogin = asyncHandler(async (req, res) => {
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    const url = await authService.getGoogleAuthUrl(redirectUri);
    res.json({ url });
  });

  /**
   * Google OAuth Callback
   * GET /api/auth/google/callback
   */
  googleCallback = asyncHandler(async (req, res) => {
    const { code } = req.query;
    const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const result = await authService.handleGoogleCallback(code, redirectUri);

    // Set HttpOnly cookies for tokens
    const accessTokenMaxAge = 15 * 60 * 1000;
    const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: accessTokenMaxAge,
      path: '/'
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshTokenMaxAge,
      path: '/'
    });

    // Redirect to dashboard with success
    res.redirect(`${frontendUrl}/dashboard?success=google_login`);
  });

  register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    res.status(201).json({
      message: ERROR_MESSAGES.REGISTRATION_SUCCESS,
      userId: user.id
    });
  });

  verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const result = await authService.verifyOTP(email, otp);

    // Set HttpOnly cookies for tokens (Auto-login)
    if (result.accessToken && result.refreshToken) {
      const accessTokenMaxAge = 15 * 60 * 1000;
      const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: accessTokenMaxAge,
        path: '/'
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: refreshTokenMaxAge,
        path: '/'
      });
    }

    res.status(200).json({
      message: result.message,
      user: result.user
    });
  });

  resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.resendOTP(email);
    res.status(200).json(result);
  });

  /**
   * Request forgot password OTP.
   * POST /api/auth/forgot-password
   */
  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email.toLowerCase());
    res.status(200).json(result);
  });

  /**
   * Verify OTP and set a new password.
   * POST /api/auth/reset-password
   */
  resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const result = await authService.resetPassword(email.toLowerCase(), otp, newPassword);
    res.status(200).json(result);
  });

  /**
   * Login user
   * POST /api/auth/login
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Attempt login
    const result = await authService.login(email.toLowerCase(), password);

    // Reset rate limit on successful login
    if (req.rateLimit) {
      await loginRateLimiter.resetAttempts(req.rateLimit.email, req.rateLimit.ip);
    }

    // Set HttpOnly cookies for tokens
    const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes
    const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: accessTokenMaxAge,
      path: '/'
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshTokenMaxAge,
      path: '/'
    });

    res.status(200).json({
      message: ERROR_MESSAGES.LOGIN_SUCCESS,
      role: result.role,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      redirectUrl: result.role === USER_ROLES.ADMIN ? '/admin/profile' : '/user/profile',
      user: result.user
    });
  });

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Extract user ID from refresh token
    const jwtUtils = require('../../utils/jwt.utils');
    const decoded = jwtUtils.verifyRefreshToken(refreshToken);
    const userId = decoded.id;

    const result = await authService.refreshTokens(refreshToken, userId);

    // Set new tokens in cookies
    const accessTokenMaxAge = 15 * 60 * 1000;
    const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: accessTokenMaxAge,
      path: '/'
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshTokenMaxAge,
      path: '/'
    });

    res.status(200).json({ message: 'Token refreshed successfully' });
  });

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout = asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    await authService.logout(userId);

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({ message: 'Logout successful' });
  });
}

module.exports = new AuthController();
