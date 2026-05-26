const socialPlatformFactory = require('./social-platform.factory');
const socialAccountRepository = require('../../repositories/social/social-account.repository');
const googleDriveService = require('./google-drive.service');
const { PLATFORMS } = require('../../utils/constants');

class SocialService {
  /**
   * Sync and aggregate metrics for all social accounts of a brand
   */
  async getAggregatedMetrics(brandId, startDate, endDate) {
    const accounts = await socialAccountRepository.findByBrandAndPlatform(brandId, null); // passing null to platform to get all platforms

    return await Promise.all(accounts.map(async (account) => {
      try {
        const service = socialPlatformFactory.getService(account.platform);
        return await service.syncChannelMetrics(account.id, startDate, endDate);
      } catch (error) {
        console.error(`Failed to sync metrics for ${account.platform} (${account.id}):`, error.message);
        return account; 
      }
    }));
  }

  /**
   * Get Google Drive context including connection status and account info
   */
  async getGoogleDriveContext(brandId) {
    try {
      const files = await googleDriveService.listVideos(brandId);
      const socialAccount = await socialAccountRepository.findByBrandAndPlatformFirst(brandId, PLATFORMS.YOUTUBE);

      return {
        connected: true,
        data: files,
        account: socialAccount ? {
          displayName: socialAccount.displayName,
          username: socialAccount.username,
          profilePictureUrl: socialAccount.profilePictureUrl
        } : null
      };
    } catch (error) {
      console.error('Google Drive context failed:', error.message);
      return { connected: false, data: [], error: error.message };
    }
  }

  /**
   * Download a file from Google Drive to local storage
   */
  async downloadDriveFile(brandId, fileId, fileName) {
    return await googleDriveService.downloadFile(brandId, fileId, fileName);
  }

  /**
   * Disconnect a social account from a brand
   */
  async disconnectAccount(brandId, platform) {
    return await socialAccountRepository.deleteManyByBrandAndPlatform(brandId, platform);
  }
}

module.exports = new SocialService();
