const productService = require('../services/product.service');

class ProductController {
  async getProductMatrix(req, res) {
    try {
      const data = await productService.getProductMatrix();
      res.status(200).json({
        message: 'Product matrix retrieved successfully',
        data
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProductController();
