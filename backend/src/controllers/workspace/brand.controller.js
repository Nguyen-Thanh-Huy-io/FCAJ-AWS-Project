const brandService = require('../../services/workspace/brand.service');
const asyncHandler = require('../../utils/async-handler');

class BrandController {
  getBrands = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const brands = await brandService.getUserBrands(userId);
    res.status(200).json({
      message: 'Brands retrieved successfully',
      data: brands
    });
  });
}

module.exports = new BrandController();
