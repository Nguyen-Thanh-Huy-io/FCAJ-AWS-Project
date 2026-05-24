const brandService = require('../../services/workspace/brand.service');

class BrandController {
  async getBrands(req, res) {
    try {
      const userId = req.user.id;
      const brands = await brandService.getUserBrands(userId);
      res.status(200).json({
        message: 'Brands retrieved successfully',
        data: brands
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new BrandController();
