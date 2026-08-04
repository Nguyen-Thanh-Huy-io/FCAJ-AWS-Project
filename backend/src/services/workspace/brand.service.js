const brandRepository = require('../../repositories/workspace/brand.repository');
const { WORKSPACE_DEFAULTS } = require('../../utils/constants');

class BrandService {
  async getUserBrands(userId) {
    return await brandRepository.findManyByUserId(userId);
  }

  async createDefaultBrand(userId) {
    return await brandRepository.create({
      name: WORKSPACE_DEFAULTS.BRAND_NAME,
      ownerId: userId
    });
  }

  async createBrand(userId, brandData) {
    // Lấy tất cả thương hiệu mà user sở hữu kèm theo giới hạn gói dịch vụ
    const ownedBrands = await brandRepository.findOwnedBrandsWithSubscription(userId);
    
    // Tìm giới hạn maxBrands cao nhất từ các thương hiệu đang sở hữu
    const allowedLimit = ownedBrands.reduce((max, b) => {
      const brandMax = b.subscription?.plan?.planLimit?.maxBrands || 1;
      return Math.max(max, brandMax);
    }, 1);

    if (ownedBrands.length >= allowedLimit) {
      const error = new Error(`Brand limit reached. Your current plan allows you to create up to ${allowedLimit} brand(s).`);
      error.statusCode = 403;
      throw error;
    }

    return await brandRepository.create({
      name: brandData.name,
      timezone: brandData.timezone,
      defaultLanguage: brandData.defaultLanguage,
      ownerId: userId
    });
  }

  async updateBrand(brandId, userId, updateData) {
    const brand = await brandRepository.findById(brandId);
    if (!brand) {
      const error = new Error('Brand not found');
      error.statusCode = 404;
      throw error;
    }

    if (brand.ownerId !== userId) {
      const error = new Error('Only the brand owner can update settings');
      error.statusCode = 403;
      throw error;
    }

    return await brandRepository.update(brandId, updateData);
  }

  async deleteBrand(brandId, userId) {
    const brand = await brandRepository.findById(brandId);
    if (!brand) {
      const error = new Error('Brand not found');
      error.statusCode = 404;
      throw error;
    }

    if (brand.ownerId !== userId) {
      const error = new Error('Only the brand owner can delete this brand');
      error.statusCode = 403;
      throw error;
    }

    // Không cho phép xóa brand cuối cùng của user
    const activeBrandsCount = await brandRepository.countActiveBrandsByOwnerId(userId);
    if (activeBrandsCount <= 1) {
      const error = new Error('Cannot delete your only brand. You must keep at least one brand.');
      error.statusCode = 400;
      throw error;
    }

    return await brandRepository.delete(brandId);
  }
}

module.exports = new BrandService();
