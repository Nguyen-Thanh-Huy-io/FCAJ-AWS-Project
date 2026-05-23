import apiService from './api';

class BrandService {
  async getBrands() {
    const response = await apiService.get('/brands');
    return response.data;
  }
}

const brandService = new BrandService();
export default brandService;
