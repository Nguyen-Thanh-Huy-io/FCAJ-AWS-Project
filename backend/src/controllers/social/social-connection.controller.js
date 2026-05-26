const socialService = require('../../services/social/social.service');
const { PLATFORMS } = require('../../utils/constants');
const asyncHandler = require('../../utils/async-handler');

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
}

module.exports = new SocialConnectionController();
