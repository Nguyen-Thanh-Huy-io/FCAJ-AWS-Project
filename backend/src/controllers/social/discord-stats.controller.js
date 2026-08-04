const discordStatsService = require('../../services/social/discord/discord-stats.service');
const asyncHandler = require('../../utils/async-handler');
const { verifyAuth } = require('../../middlewares/auth.middleware');

class DiscordStatsController {
  /**
   * GET /social/discord/stats
   * Lấy thống kê tổng hợp + growth data cho brand
   */
  getStats = asyncHandler(async (req, res) => {
    const { brandId, guildId, days = 30 } = req.query;
    if (!brandId) {
      return res.status(400).json({ message: 'brandId is required' });
    }

    const overview = await discordStatsService.getBrandDiscordStats(brandId);

    // Nếu có guildId cụ thể, lấy growth data
    let growth = [];
    if (guildId) {
      growth = await discordStatsService.getGuildGrowth(brandId, guildId, parseInt(days));
    } else if (overview.servers.length > 0 && overview.servers[0].guildId) {
      // Mặc định lấy guild đầu tiên
      growth = await discordStatsService.getGuildGrowth(brandId, overview.servers[0].guildId, parseInt(days));
    }

    res.json({ ...overview, growth });
  });

  /**
   * POST /social/discord/snapshot
   * Trigger snapshot thủ công cho 1 guild
   */
  triggerSnapshot = asyncHandler(async (req, res) => {
    const { brandId, guildId } = req.body;
    if (!brandId || !guildId) {
      return res.status(400).json({ message: 'brandId and guildId are required' });
    }
    const result = await discordStatsService.snapshotGuild(brandId, guildId);
    res.json({ success: true, ...result });
  });
}

module.exports = new DiscordStatsController();
