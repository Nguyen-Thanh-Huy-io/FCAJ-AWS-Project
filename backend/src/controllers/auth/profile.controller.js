const userRepository = require('../../repositories/auth/user.repository');
const profileService = require('../../services/auth/profile.service');
const brandService = require('../../services/workspace/brand.service');
const storageService = require('../../services/storage');
const asyncHandler = require('../../utils/async-handler');
const path = require('path');
const crypto = require('crypto');

class ProfileController {
  /**
   * Get user profile
   * For /user/profile endpoint
   */
  getUserProfile = asyncHandler(async (req, res) => {
    const data = await profileService.getUserProfile(req.user.id);

    res.status(200).json({
      message: 'User profile retrieved successfully',
      data
    });
  });

  /**
   * Get admin profile
   * For /admin/profile endpoint
   */
  getAdminProfile = asyncHandler(async (req, res) => {
    const admin = await userRepository.findById(req.user.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({
      message: 'Admin profile retrieved successfully',
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        fullName: admin.name,
        avatarUrl: admin.avatarUrl,
        phone: admin.phone,
        address: admin.address,
        industry: admin.industry,
        bio: admin.bio,
        role: admin.role,
        isActive: admin.isActive,
        isEmailVerified: admin.isEmailVerified,
        createdAt: admin.createdAt
      }
    });
  });

  /**
   * Edit user profile
   * For /profile/edit endpoint
   */
  editProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { fullName, avatarUrl, phone, address, industry, bio } = req.body;

    // Call service to edit profile
    const updatedUser = await profileService.editProfile(userId, {
      fullName,
      avatarUrl,
      phone,
      address,
      industry,
      bio
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      data: updatedUser
    });
  });

  /**
   * Upload avatar
   * For /upload/avatar endpoint
   * Uploads avatar to storage (S3 or local) via StorageService.
   */
  uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const uniqueId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const key = `avatars/${userId}/${uniqueId}${ext}`;

    const { url: avatarUrl } = await storageService.upload(req.file.buffer, key, req.file.mimetype);

    // Update user avatarUrl
    const updatedUser = await profileService.editProfile(userId, { avatarUrl });

    res.status(200).json({
      message: 'Avatar uploaded successfully',
      data: { avatarUrl }
    });
  });

  /**
   * Unlink social provider account
   * DELETE /api/profile/accounts/:provider
   */
  unlinkAccount = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { provider } = req.params;

    const result = await profileService.unlinkAccount(userId, provider);
    res.status(200).json(result);
  });

  /**
   * Change password
   * PUT /api/profile/change-password
   */
  changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    }

    const result = await profileService.changePassword(userId, currentPassword, newPassword);
    res.status(200).json(result);
  });
}

module.exports = new ProfileController();
