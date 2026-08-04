/**
 * StorageService — Abstract base class (Interface pattern for JavaScript).
 * 
 * All storage implementations MUST extend this class and implement
 * all three methods. Follows SOLID Interface Segregation Principle.
 * 
 * @abstract
 */
class StorageService {
  /**
   * Upload a file buffer to storage.
   * @param {Buffer} buffer - File content buffer
   * @param {string} key - Storage key/path (e.g. 'media/brand123/images/photo.jpg')
   * @param {string} mimeType - MIME type (e.g. 'image/jpeg')
   * @returns {Promise<{ url: string, key: string }>} - Public URL and storage key
   */
  async upload(buffer, key, mimeType) {
    throw new Error('StorageService.upload() must be implemented by subclass');
  }

  /**
   * Delete a file from storage.
   * @param {string} key - Storage key/path of the file to delete
   * @returns {Promise<void>}
   */
  async delete(key) {
    throw new Error('StorageService.delete() must be implemented by subclass');
  }

  /**
   * Get the public URL for a stored file.
   * @param {string} key - Storage key/path
   * @returns {string} - Public URL
   */
  /**
   * Get the public URL for a stored file.
   * @param {string} key - Storage key/path
   * @returns {string} - Public URL
   */
  getUrl(key) {
    throw new Error('StorageService.getUrl() must be implemented by subclass');
  }

  /**
   * Get the file content as a Buffer.
   * @param {string} key - Storage key/path
   * @returns {Promise<Buffer>} - File buffer
   */
  async getBuffer(key) {
    throw new Error('StorageService.getBuffer() must be implemented by subclass');
  }
}

module.exports = StorageService;
