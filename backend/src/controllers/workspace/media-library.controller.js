const mediaLibraryService = require('../../services/workspace/media-library.service');
const asyncHandler = require('../../utils/async-handler');

class MediaLibraryController {
  /**
   * GET /api/media
   */
  getMediaFiles = asyncHandler(async (req, res) => {
    const { brandId } = req.query;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    const result = await mediaLibraryService.getMediaFiles(req.query, brandId);

    res.status(200).json({
      message: 'Media files retrieved successfully',
      ...result
    });
  });

  /**
   * POST /api/media/upload
   */
  uploadMedia = asyncHandler(async (req, res) => {
    const { brandId } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const userId = req.user.id;
    const media = await mediaLibraryService.uploadFile(req.file, brandId, userId);

    res.status(201).json({
      message: 'File uploaded successfully',
      data: media
    });
  });

  /**
   * DELETE /api/media/:id
   */
  deleteMedia = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { brandId } = req.body; // Usually sent in body for DELETE or query
    
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    await mediaLibraryService.deleteMedia(id, brandId);

    res.status(200).json({
      message: 'Media file deleted successfully'
    });
  });
}

module.exports = new MediaLibraryController();
