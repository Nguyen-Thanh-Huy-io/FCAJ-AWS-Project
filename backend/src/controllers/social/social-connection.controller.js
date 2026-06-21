const socialService = require('../../services/social/social.service');
const { PLATFORMS } = require('../../utils/constants');
const asyncHandler = require('../../utils/async-handler');
const brandRepository = require('../../repositories/workspace/brand.repository');
const connectionConflictGuard = require('../../services/social/connection-conflict.guard');

class SocialConnectionController {
  disconnectGoogleAccount = asyncHandler(async (req, res) => {
    const { brandId } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    await socialService.disconnectAccount(brandId, PLATFORMS.YOUTUBE);
    res.json({ success: true, message: 'Google account disconnected successfully' });
  });

  disconnectFacebookAccount = asyncHandler(async (req, res) => {
    const { brandId } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    await socialService.disconnectAccount(brandId, PLATFORMS.FACEBOOK);
    res.json({ success: true, message: 'Facebook page disconnected successfully' });
  });

  disconnectTikTokAccount = asyncHandler(async (req, res) => {
    const { brandId } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    await socialService.disconnectAccount(brandId, PLATFORMS.TIKTOK);
    res.json({ success: true, message: 'TikTok account disconnected successfully' });
  });

  disconnectInstagramAccount = asyncHandler(async (req, res) => {
    const { brandId } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });

    await socialService.disconnectAccount(brandId, PLATFORMS.INSTAGRAM);
    res.json({ success: true, message: 'Instagram account disconnected successfully' });
  });

  reassignSocialAccount = asyncHandler(async (req, res) => {
    const { platform, platformAccountId, targetBrandId } = req.body;
    if (!platform || !platformAccountId || !targetBrandId) {
      return res.status(400).json({ message: 'platform, platformAccountId, and targetBrandId are required' });
    }

    const userId = req.user.id;
    const targetBrand = await brandRepository.findById(targetBrandId);
    if (!targetBrand) {
      return res.status(404).json({ message: 'Target brand not found' });
    }

    // Verify ownership of the target brand
    if (targetBrand.ownerId !== userId) {
      return res.status(403).json({ message: 'Only the brand owner can reassign channels' });
    }

    try {
      await connectionConflictGuard.reassignAccount(platform, platformAccountId, targetBrandId);
      res.json({ success: true, message: 'Social account reassigned successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
}

module.exports = new SocialConnectionController();
