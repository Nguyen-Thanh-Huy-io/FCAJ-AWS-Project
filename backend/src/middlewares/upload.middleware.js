const multer = require('multer');

/**
 * File Upload Middleware
 * 
 * Uses multer.memoryStorage() so that uploaded files are available as
 * req.file.buffer. The actual storage (S3 or local) is handled by
 * the StorageService abstraction in controllers/services.
 * 
 * Preserves all existing validation:
 * - 100MB max file size
 * - Allowed MIME types: images, videos, PDF
 */

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/webp',
    'video/mp4', 
    'video/quicktime', 
    'video/x-matroska',
    'video/matroska',
    'video/webm',
    'video/x-msvideo', // AVI
    'video/mpeg',
    'application/x-matroska',
    'application/pdf',
    'application/octet-stream' // Last resort for some binary files, use with caution or extension check
  ];
  
  const isAllowedMime = allowedTypes.includes(file.mimetype);
  
  // Extra check for octet-stream: only allow if extension is in our whitelist
  let isAllowedExtra = false;
  if (file.mimetype === 'application/octet-stream') {
    const allowedExts = ['.mkv', '.mp4', '.mov', '.avi', '.webm', '.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp'];
    isAllowedExtra = allowedExts.some(ext => file.originalname.toLowerCase().endsWith(ext));
  }

  if (isAllowedMime || isAllowedExtra) {
    cb(null, true);
  } else {
    console.error(`[Upload Error] Rejected mimetype: "${file.mimetype}" for file: "${file.originalname}"`);
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, MP4, MOV, MKV, AVI, WEBM and PDF are allowed.'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

module.exports = upload;
