const { google } = require('googleapis');
const googleOAuthService = require('./google-oauth.service');
const socialAccountRepository = require('../../repositories/social/social-account.repository');
const { PLATFORMS, API_VERSIONS } = require('../../utils/constants');
const fs = require('fs');
const path = require('path');

class GoogleDriveService {
  async getDriveClient(brandId) {
    const socialAccount = await socialAccountRepository.findByBrandAndPlatform(brandId, PLATFORMS.YOUTUBE);
    if (!socialAccount || socialAccount.length === 0) {
      const error = new Error('Google account not connected');
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

    return google.drive({ version: API_VERSIONS.YOUTUBE, auth });
  }

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

  async downloadFile(brandId, fileId, fileName) {
    const drive = await this.getDriveClient(brandId);
    const { localFilePath, uploadUrlPath } = this._resolveStoragePaths(fileId, fileName);

    if (fs.existsSync(localFilePath)) {
      return uploadUrlPath;
    }

    const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
    return this._streamToFile(response.data, localFilePath, uploadUrlPath);
  }

  // ============= Private Helper Methods =============

  _resolveStoragePaths(fileId, fileName) {
    const uploadDir = path.resolve(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const cleanFileName = `drive-${fileId}-${safeName}`;
    
    return {
      localFilePath: path.join(uploadDir, cleanFileName),
      uploadUrlPath: `/uploads/${cleanFileName}`
    };
  }

  async _streamToFile(inputStream, localPath, urlPath) {
    const dest = fs.createWriteStream(localPath);
    return new Promise((resolve, reject) => {
      inputStream
        .on('end', () => resolve(urlPath))
        .on('error', (err) => {
          fs.unlink(localPath, () => {}); 
          reject(new Error(`Stream failed: ${err.message}`));
        })
        .pipe(dest);
    });
  }
}

module.exports = new GoogleDriveService();
