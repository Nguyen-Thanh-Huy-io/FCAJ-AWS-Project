const userRepository = require('../../repositories/auth/user.repository');
const profileService = require('../../services/auth/profile.service');
const brandService = require('../../services/workspace/brand.service');

class ProfileController {
  /**
   * Get user profile
   * For /user/profile endpoint
   */
  async getUserProfile(req, res) {
    try {
      const user = await userRepository.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if user has any brands. If not, create one.
      const brands = await brandService.getUserBrands(user.id);
      console.log(`User ${user.id} has ${brands.length} brands.`);
      if (brands.length === 0) {
        console.log(`Creating default 'Empty brand' for user ${user.id}...`);
        try {
          const newBrand = await brandService.createDefaultBrand(user.id);
          console.log(`Successfully created default brand: ${newBrand.id}`);
        } catch (brandError) {
          console.error(`Failed to auto-create brand for user ${user.id}:`, brandError.message);
          // Don't fail the whole profile request, but log it
        }
      }

      res.status(200).json({
        message: 'User profile retrieved successfully',
        data: {
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
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Get admin profile
   * For /admin/profile endpoint
   */
  async getAdminProfile(req, res) {
    try {
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
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Edit user profile
   * For /profile/edit endpoint
   */
  async editProfile(req, res) {
    try {
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
    } catch (error) {
      const statusCode = error.status || 500;
      res.status(statusCode).json({ message: error.message });
    }
  }

  /**
   * Upload avatar
   * For /upload/avatar endpoint
   */
  async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const avatarUrl = `/uploads/${req.file.filename}`;

      // Update user avatarUrl
      const updatedUser = await profileService.editProfile(req.user.id, { avatarUrl });

      res.status(200).json({
        message: 'Avatar uploaded successfully',
        data: { avatarUrl }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProfileController();
