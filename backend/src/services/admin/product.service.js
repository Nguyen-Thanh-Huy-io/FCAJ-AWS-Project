const productRepository = require('../../repositories/admin/product.repository');

class ProductService {
  async getProductMatrix() {
    return await productRepository.getMatrixData();
  }
}

module.exports = new ProductService();
