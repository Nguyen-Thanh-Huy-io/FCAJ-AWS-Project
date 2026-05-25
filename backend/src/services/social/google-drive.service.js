const { google } = require('googleapis');
const googleOAuthService = require('./google-oauth.service');
const socialAccountRepository = require('../../repositories/social/social-account.repository');
const { PLATFORMS } = require('../../utils/constants');
const fs = require('fs');
const path = require('path');

class GoogleDriveService {
  /**
   * Helper to retrieve authenticated Drive client for a brand
   */
  async getDriveClient(brandId) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.YOUTUBE);
    if (!socialAccount || socialAccount.length === 0) {
      const error = new Error('Google account not connected for this brand');
      error.code = 'NOT_CONNECTED';
      throw error;
    }
    const account = socialAccount[0];

    const auth = googleOAuthService.createClient();
    auth.setCredentials({
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
      expiry_date: account.tokenExpiresAt ? account.tokenExpiresAt.getTime() : undefined
    });

    return google.drive({ version: 'v3', auth });
  }

  /**
   * List video files on the user's Google Drive
   * @param {string} brandId
   * @returns {Promise<Array>} List of file objects
   */
  async listVideos(brandId) {
    const drive = await this.getDriveClient(brandId);
    
    const response = await drive.files.list({
      q: "(mimeType contains 'video/' or mimeType contains 'image/' or mimeType = 'application/pdf') and trashed = false",
      fields: 'nextPageToken, files(id, name, mimeType, size, thumbnailLink, createdTime)',
      pageSize: 50,
      orderBy: 'createdTime desc'
    });

    return response.data.files || [];
  }

  /**
   * Download a Google Drive file to the local uploads directory
   * @param {string} brandId
   * @param {string} fileId
   * @param {string} fileName
   * @returns {Promise<string>} Relative local path to downloaded file
   */
  async downloadFile(brandId, fileId, fileName) {
    const drive = await this.getDriveClient(brandId);

    const uploadDir = path.resolve(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Sanitize file name to avoid path traversal or naming issues
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const cleanFileName = `drive-${fileId}-${safeName}`;
    const localFilePath = path.join(uploadDir, cleanFileName);

    // If file already exists, return its path to avoid re-downloading
    if (fs.existsSync(localFilePath)) {
      return `/uploads/${cleanFileName}`;
    }

    const dest = fs.createWriteStream(localFilePath);

    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    return new Promise((resolve, reject) => {
      response.data
        .on('end', () => {
          resolve(`/uploads/${cleanFileName}`);
        })
        .on('error', (err) => {
          fs.unlink(localFilePath, () => {}); // clean up partial file
          reject(new Error(`Failed to stream file from Google Drive: ${err.message}`));
        })
        .pipe(dest);
    });
  }
}

module.exports = new GoogleDriveService();
