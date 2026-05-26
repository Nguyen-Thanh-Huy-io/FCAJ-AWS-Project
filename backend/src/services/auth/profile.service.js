const userRepository = require('../../repositories/auth/user.repository');
const brandService = require('../../services/workspace/brand.service');
const { ERROR_MESSAGES } = require('../../utils/constants');

class ProfileService {
  /**
   * Get user profile with auto-healing brand logic
   */
  async getUserProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND || 'User not found');
      error.status = 404;
      throw error;
    }

    // Business Logic: Self-healing for brands
    const brands = await brandService.getUserBrands(userId);
    if (brands.length === 0) {
      try {
        console.log(`Auto-creating brand for user ${userId}`);
        await brandService.createDefaultBrand(userId);
      } catch (err) {
        console.error(`Brand auto-creation failed: ${err.message}`);
      }
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      fullName: user.name,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      address: user.address,
      industry: user.industry,
      bio: user.bio,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    };
  }

  /**
   * Edit user profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Data to update { name, avatarUrl, phone, address, industry, bio }
   * @returns {Promise<Object>} - Updated user object
   */
  async editProfile(userId, profileData) {
    // Check if user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error(ERROR_MESSAGES.USER_NOT_FOUND || 'User not found');
      error.status = 404;
      throw error;
    }

    // Check if account is banned
    if (!user.isActive) {
      const error = new Error(ERROR_MESSAGES.ACCOUNT_BANNED);
      error.status = 403;
      throw error;
    }

    // Prepare update data
    const updateData = {};
    if (profileData.fullName !== undefined) {
      updateData.name = profileData.fullName.trim();
    }
    if (profileData.name !== undefined) {
      updateData.name = profileData.name.trim();
    }
    if (profileData.avatarUrl !== undefined) {
      updateData.avatarUrl = profileData.avatarUrl;
    }
    if (profileData.phone !== undefined) {
      updateData.phone = profileData.phone.trim() || null;
    }
    if (profileData.address !== undefined) {
      updateData.address = profileData.address.trim() || null;
    }
    if (profileData.industry !== undefined) {
      updateData.industry = profileData.industry.trim() || null;
    }
    if (profileData.bio !== undefined) {
      updateData.bio = profileData.bio.trim() || null;
    }

    // If nothing to update
    if (Object.keys(updateData).length === 0) {
      const error = new Error('No data to update');
      error.status = 400;
      throw error;
    }

    // Update user profile
    const updatedUser = await userRepository.updateProfile(userId, updateData);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      fullName: updatedUser.name,
      avatarUrl: updatedUser.avatarUrl,
      phone: updatedUser.phone,
      address: updatedUser.address,
      industry: updatedUser.industry,
      bio: updatedUser.bio,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      isEmailVerified: updatedUser.isEmailVerified,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
  }
}

module.exports = new ProfileService();
