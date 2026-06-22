const smartLinkRepository = require('../../repositories/workspace/smart-link.repository');
const backgroundValidatorFactory = require('./smart-link/background-validators/background-validator.factory');
const linkProcessorFactory = require('./smart-link/link-processors/link-processor.factory');

class SmartLinkService {
  async getSmartLinkByBrand(brandId) {
    if (!brandId) {
      const error = new Error('Brand ID is required');
      error.statusCode = 400;
      throw error;
    }
    return await smartLinkRepository.findByBrandId(brandId);
  }

  async getPublicSmartLinkBySlug(slug) {
    if (!slug) {
      const error = new Error('Slug is required');
      error.statusCode = 400;
      throw error;
    }
    const smartLink = await smartLinkRepository.findBySlug(slug);
    if (!smartLink || !smartLink.isPublished) {
      const error = new Error('SmartLink not found or is not published');
      error.statusCode = 404;
      throw error;
    }
    return smartLink;
  }

  async updateSmartLink(id, brandId, data) {
    if (!id || !brandId) {
      const error = new Error('ID and Brand ID are required');
      error.statusCode = 400;
      throw error;
    }

    // Check ownership
    const existing = await smartLinkRepository.findById(id);
    if (!existing) {
      const error = new Error('SmartLink not found');
      error.statusCode = 404;
      throw error;
    }
    if (existing.brandId !== brandId) {
      const error = new Error('Unauthorized brand access');
      error.statusCode = 403;
      throw error;
    }

    // 1. Validate background using Strategy Pattern
    if (data.backgroundType && data.backgroundValue) {
      const validator = backgroundValidatorFactory.getValidator(data.backgroundType);
      const isValid = validator.validate(data.backgroundValue);
      if (!isValid) {
        const error = new Error(`Invalid background value: "${data.backgroundValue}" for type ${data.backgroundType}`);
        error.statusCode = 400;
        throw error;
      }
    }

    // 2. Process links using Link Processor Strategy Pattern
    if (data.links && Array.isArray(data.links)) {
      data.links = data.links.map(link => {
        const processor = linkProcessorFactory.getProcessor(link.url);
        return processor.process(link);
      });
    }

    return await smartLinkRepository.update(id, data);
  }

  async createSmartLink(brandId, data) {
    if (!brandId) {
      const error = new Error('Brand ID is required');
      error.statusCode = 400;
      throw error;
    }

    // Validate slug uniqueness
    if (data.slug) {
      const existingSlug = await smartLinkRepository.findBySlug(data.slug);
      if (existingSlug) {
        const error = new Error('Slug is already in use');
        error.statusCode = 400;
        throw error;
      }
    }

    // 1. Validate background using Strategy Pattern
    if (data.backgroundType && data.backgroundValue) {
      const validator = backgroundValidatorFactory.getValidator(data.backgroundType);
      const isValid = validator.validate(data.backgroundValue);
      if (!isValid) {
        const error = new Error(`Invalid background value: "${data.backgroundValue}" for type ${data.backgroundType}`);
        error.statusCode = 400;
        throw error;
      }
    }

    // 2. Process links using Link Processor Strategy Pattern
    if (data.links && Array.isArray(data.links)) {
      data.links = data.links.map(link => {
        const processor = linkProcessorFactory.getProcessor(link.url);
        return processor.process(link);
      });
    }

    return await smartLinkRepository.create({
      ...data,
      brandId
    });
  }
}

module.exports = new SmartLinkService();
