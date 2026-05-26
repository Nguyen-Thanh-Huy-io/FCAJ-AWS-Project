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
}

module.exports = new BrandService();
