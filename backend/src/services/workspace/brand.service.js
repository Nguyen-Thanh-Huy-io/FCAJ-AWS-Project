const brandRepository = require('../../repositories/workspace/brand.repository');

class BrandService {
  async getUserBrands(userId) {
    return await brandRepository.findManyByUserId(userId);
  }

  async createDefaultBrand(userId) {
    return await brandRepository.create({
      name: 'Empty brand',
      ownerId: userId
    });
  }
}

module.exports = new BrandService();
