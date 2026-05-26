const productService = require('../../services/admin/product.service');
const asyncHandler = require('../../utils/async-handler');

class ProductController {
  getProductMatrix = asyncHandler(async (req, res) => {
    const data = await productService.getProductMatrix();
    res.status(200).json({
      message: 'Product matrix retrieved successfully',
      data
    });
  });
}

module.exports = new ProductController();
