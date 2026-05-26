const youtubeService = require('./youtube');
const facebookService = require('./facebook');
const tiktokService = require('./tiktok');
const { PLATFORMS } = require('../../utils/constants');

class SocialPlatformFactory {
  constructor() {
    this.services = {
      [PLATFORMS.YOUTUBE]: youtubeService,
      [PLATFORMS.FACEBOOK]: facebookService,
      [PLATFORMS.TIKTOK]: tiktokService,
      // Khi tích hợp các nền tảng mới sau này, chỉ cần khai báo tại đây:
    };
  }

  /**
   * Lấy service tương ứng với nền tảng mạng xã hội
   * @param {string} platform - Tên nền tảng (ví dụ: 'YOUTUBE')
   * @returns {BaseSocialService}
   */
  getService(platform) {
    if (!platform) {
      throw new Error('Platform is required');
    }
    const service = this.services[platform.toUpperCase()];
    if (!service) {
      throw new Error(`Platform '${platform}' is not supported yet`);
    }
    return service;
  }
}

module.exports = new SocialPlatformFactory();
