const youtubeService = require('./youtube');
const { PLATFORMS } = require('../../utils/constants');

class SocialPlatformFactory {
  constructor() {
    this.services = {
      [PLATFORMS.YOUTUBE]: youtubeService,
      // Khi tích hợp các nền tảng mới sau này, chỉ cần khai báo tại đây:
      // [PLATFORMS.FACEBOOK]: facebookService,
      // [PLATFORMS.TIKTOK]: tiktokService,
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
