const multer = require('multer');
const { storage } = require('../config/cloudinary');

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
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

module.exports = upload;
