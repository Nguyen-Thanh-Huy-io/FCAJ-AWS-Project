const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../../config/s3');
const StorageService = require('./storage.service');

/**
 * S3StorageService — Amazon S3 implementation of StorageService.
 * 
 * Uploads files to S3 using PutObjectCommand (AWS SDK v3).
 * Returns CloudFront URL if CLOUDFRONT_DOMAIN is configured,
 * otherwise returns the standard S3 public URL.
 * 
 * Compatible with ECS IAM Task Role (no static credentials needed).
 */
class S3StorageService extends StorageService {
  constructor() {
    super();
    this.bucket = process.env.AWS_S3_BUCKET_NAME;
    this.region = process.env.AWS_REGION || 'ap-southeast-2';
    this.cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN || null;
  }

  /**
   * Upload a file buffer to S3.
   * @param {Buffer} buffer - File content
   * @param {string} key - S3 object key (e.g. 'media/brand123/images/1234-abcd.jpg')
   * @param {string} mimeType - MIME type for Content-Type header
   * @returns {Promise<{ url: string, key: string }>}
   */
  async upload(buffer, key, mimeType) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);

    return {
      url: this.getUrl(key),
      key,
    };
  }

  /**
   * Delete a file from S3.
   * @param {string} key - S3 object key to delete
   */
  async delete(key) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await s3Client.send(command);
  }

  /**
   * Get the public URL for a file stored in S3.
   * Uses CloudFront domain if configured, otherwise standard S3 URL.
   * @param {string} key - S3 object key
   * @returns {string} Public URL
   */
  getUrl(key) {
    if (this.cloudfrontDomain) {
      return `https://${this.cloudfrontDomain}/${key}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  /**
   * Get the file content as a Buffer from S3.
   * Useful when backend needs to read the file directly (e.g. TikTok FILE_UPLOAD).
   * @param {string} key - S3 object key
   * @returns {Promise<Buffer>}
   */
  async getBuffer(key) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await s3Client.send(command);
    const byteArray = await response.Body.transformToByteArray();
    return Buffer.from(byteArray);
  }
}

module.exports = S3StorageService;
