const S3StorageService = require('./s3-storage.service');
const LocalStorageService = require('./local-storage.service');

/**
 * Storage Service Factory
 * 
 * Returns the appropriate StorageService implementation based on
 * the UPLOAD_STORAGE environment variable.
 * 
 * - UPLOAD_STORAGE=local  → LocalStorageService (dev/testing)
 * - Otherwise             → S3StorageService (production/staging)
 * 
 * Follows SOLID Open/Closed Principle: add new storage backends
 * by creating a new class and updating this factory, without
 * modifying existing implementations.
 */
function createStorageService() {
  if (process.env.UPLOAD_STORAGE === 'local') {
    console.log('[Storage] Using LocalStorageService (UPLOAD_STORAGE=local)');
    return new LocalStorageService();
  }

  console.log('[Storage] Using S3StorageService');
  return new S3StorageService();
}

// Export a singleton instance
module.exports = createStorageService();
