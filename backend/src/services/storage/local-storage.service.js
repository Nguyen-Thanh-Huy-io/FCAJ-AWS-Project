const fs = require('fs');
const path = require('path');
const StorageService = require('./storage.service');

/**
 * LocalStorageService — Local disk implementation of StorageService.
 * 
 * Stores files to the local filesystem under the project's 'uploads/' directory.
 * Used when UPLOAD_STORAGE=local (development/testing).
 */
class LocalStorageService extends StorageService {
  constructor() {
    super();
    this.baseDir = path.join(process.cwd(), 'uploads');
  }

  /**
   * Save a file buffer to local disk.
   * @param {Buffer} buffer - File content
   * @param {string} key - Relative path/key (e.g. 'media/brand123/images/photo.jpg')
   * @param {string} mimeType - MIME type (unused for local, kept for interface compatibility)
   * @returns {Promise<{ url: string, key: string }>}
   */
  async upload(buffer, key, mimeType) {
    const filePath = path.join(this.baseDir, key);
    const dirPath = path.dirname(filePath);

    // Ensure directory exists
    fs.mkdirSync(dirPath, { recursive: true });

    // Write file to disk
    fs.writeFileSync(filePath, buffer);

    return {
      url: this.getUrl(key),
      key,
    };
  }

  /**
   * Delete a file from local disk.
   * @param {string} key - Relative path/key of the file
   */
  async delete(key) {
    const filePath = path.join(this.baseDir, key);
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`[LocalStorage] Failed to delete ${filePath}:`, err.message);
      }
      // Silently ignore if file doesn't exist
    }
  }

  /**
   * Get the public URL for a locally stored file.
   * Returns a relative path that Express static middleware can serve.
   * @param {string} key - Relative path/key
   * @returns {string} URL path (e.g. '/uploads/media/brand123/images/photo.jpg')
   */
  getUrl(key) {
    return `/uploads/${key}`;
  }

  /**
   * Get the file content as a Buffer from local disk.
   * @param {string} key - Relative path/key
   * @returns {Promise<Buffer>}
   */
  async getBuffer(key) {
    const filePath = path.join(this.baseDir, key);
    return fs.promises.readFile(filePath);
  }
}

module.exports = LocalStorageService;
