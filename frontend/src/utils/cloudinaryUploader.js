/**
 * Cloudinary Resumable Uploader
 * Handles large file uploads by splitting them into chunks.
 * Supports resuming after network failure or page reload.
 */
class CloudinaryResumableUploader {
  constructor(cloudName, apiKey, folder, onProgress) {
    this.cloudName = cloudName;
    this.apiKey = apiKey;
    this.folder = folder;
    this.onProgress = onProgress;
    this.chunkSize = 6 * 1024 * 1024; // 6MB per chunk (Cloudinary min is 5MB)
    this.url = `https://api.cloudinary.com/v1_1/${this.cloudName}/auto/upload`;
  }

  /**
   * Upload a file in chunks
   */
  async upload(file, signature, timestamp) {
    const totalSize = file.size;
    const fileKey = `cld-resumable-${file.name}-${file.size}`;
    
    // Check for existing upload session in localStorage
    let startByte = 0;
    let uniqueId = localStorage.getItem(`${fileKey}-id`);
    
    if (!uniqueId) {
      uniqueId = `idx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(`${fileKey}-id`, uniqueId);
      localStorage.setItem(`${fileKey}-start`, "0");
    } else {
      startByte = parseInt(localStorage.getItem(`${fileKey}-start`) || "0");
      console.log(`Resuming upload for ${file.name} from byte ${startByte}`);
    }

    let lastResponse = null;

    while (startByte < totalSize) {
      const endByte = Math.min(startByte + this.chunkSize, totalSize);
      const chunk = file.slice(startByte, endByte);
      const contentRange = `bytes ${startByte}-${endByte - 1}/${totalSize}`;

      try {
        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp);
        formData.append('api_key', this.apiKey);
        formData.append('folder', this.folder);

        const response = await fetch(this.url, {
          method: 'POST',
          headers: {
            'X-Unique-Upload-Id': uniqueId,
            'Content-Range': contentRange
          },
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Chunk upload failed');
        }

        lastResponse = await response.json();
        
        // Update progress
        startByte = endByte;
        localStorage.setItem(`${fileKey}-start`, startByte.toString());
        
        const percent = Math.round((startByte / totalSize) * 100);
        if (this.onProgress) this.onProgress(percent, lastResponse);

      } catch (error) {
        console.error('Error uploading chunk:', error);
        throw error;
      }
    }

    // Success! Clear storage
    localStorage.removeItem(`${fileKey}-id`);
    localStorage.removeItem(`${fileKey}-start`);
    
    return lastResponse;
  }
}

export default CloudinaryResumableUploader;
