const productRepository = require('../repositories/product.repository');

class ProductService {
  async getProductMatrix() {
    return await productRepository.getMatrixData();
  }
}

module.exports = new ProductService();
