const discordService = require('../../services/social/discord/discord.service');
const asyncHandler = require('../../utils/async-handler');

class DiscordController {
  connectDiscord = asyncHandler(async (req, res) => {
    const { brandId, webhookUrl } = req.body;
    if (!brandId) return res.status(400).json({ message: 'brandId is required' });
    if (!webhookUrl) return res.status(400).json({ message: 'webhookUrl is required' });

    try {
      const account = await discordService.connectChannel(brandId, webhookUrl);
      res.json({
        success: true,
        message: 'Discord webhook connected successfully',
        account: {
          id: account.id,
          displayName: account.displayName,
          username: account.username,
          profilePictureUrl: account.profilePictureUrl
        }
      });
    } catch (error) {
      res.status(400).json({ message: error.message || 'Failed to connect Discord webhook' });
    }
  });
}

module.exports = new DiscordController();
