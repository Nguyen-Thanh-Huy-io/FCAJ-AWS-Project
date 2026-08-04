const prisma = require('../../../config/prisma');
const discordGateway = require('./discord.gateway');
const logger = require('../../../utils/logger');

class DiscordStatsService {
  /**
   * Chụp snapshot member count cho tất cả các guild Discord đang hoạt động
   * Được gọi từ cron job mỗi ngày
   */
  async snapshotAllGuilds() {
    logger.info('[DiscordStats] Starting daily snapshot for all Discord guilds...');

    // Lấy tất cả DiscordAccount có guildId (không phải webhook cũ)
    const discordAccounts = await prisma.discordAccount.findMany({
      where: {
        guildId: { not: null },
        socialAccount: { isConnected: true }
      },
      include: {
        socialAccount: { select: { brandId: true } }
      }
    });

    // Group theo guildId để tránh gọi API trùng lặp cho cùng 1 guild
    const guildMap = new Map();
    for (const acc of discordAccounts) {
      if (!acc.guildId) continue;
      if (!guildMap.has(acc.guildId)) {
        guildMap.set(acc.guildId, new Set());
      }
      guildMap.get(acc.guildId).add(acc.socialAccount.brandId);
    }

    let successCount = 0;
    let errorCount = 0;

    for (const [guildId, brandIds] of guildMap) {
      try {
        const guildInfo = await discordGateway.getGuildWithCounts(guildId);
        const memberCount = guildInfo.approximate_member_count || 0;
        const onlineCount = guildInfo.approximate_presence_count || 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        // Tạo snapshot cho mỗi brand sở hữu guild này
        for (const brandId of brandIds) {
          await prisma.discordGuildSnapshot.upsert({
            where: {
              guildId_brandId_snapshotAt: {
                guildId,
                brandId,
                snapshotAt: today
              }
            },
            update: { memberCount, onlineCount },
            create: { guildId, brandId, memberCount, onlineCount, snapshotAt: today }
          });
        }

        // Cập nhật số liệu hiện tại vào DiscordAccount
        await prisma.discordAccount.updateMany({
          where: { guildId },
          data: { memberCount, onlineCount, lastSyncAt: new Date() }
        });

        successCount++;
      } catch (err) {
        logger.error(`[DiscordStats] Failed to snapshot guild ${guildId}:`, err.message);
        errorCount++;
      }
    }

    logger.info(`[DiscordStats] Snapshot complete. Success: ${successCount}, Errors: ${errorCount}`);
    return { successCount, errorCount };
  }

  /**
   * Lấy thống kê tăng trưởng của 1 guild theo khoảng thời gian
   * @param {string} brandId
   * @param {string} guildId
   * @param {number} days - Số ngày muốn xem (mặc định 30)
   */
  async getGuildGrowth(brandId, guildId, days = 30) {
    const from = new Date();
    from.setDate(from.getDate() - days);
    from.setHours(0, 0, 0, 0);

    const where = {
      brandId,
      snapshotAt: { gte: from }
    };
    
    if (guildId && guildId !== 'all') {
      where.guildId = guildId;
    }

    const snapshots = await prisma.discordGuildSnapshot.findMany({
      where,
      orderBy: { snapshotAt: 'asc' }
    });

    if (!guildId || guildId === 'all') {
      // Aggregate by snapshotAt date
      const aggregated = {};
      for (const s of snapshots) {
        const dateStr = s.snapshotAt.toISOString().split('T')[0];
        if (!aggregated[dateStr]) {
          aggregated[dateStr] = { date: dateStr, memberCount: 0, onlineCount: 0 };
        }
        aggregated[dateStr].memberCount += s.memberCount || 0;
        aggregated[dateStr].onlineCount += s.onlineCount || 0;
      }
      return Object.values(aggregated).sort((a, b) => a.date.localeCompare(b.date));
    }

    return snapshots.map(s => ({
      date: s.snapshotAt.toISOString().split('T')[0],
      memberCount: s.memberCount,
      onlineCount: s.onlineCount
    }));
  }

  /**
   * Lấy thống kê tổng hợp của tất cả guild trong brand
   * @param {string} brandId
   */
  async getBrandDiscordStats(brandId) {
    // 1. Lấy tất cả SocialAccount (kết nối Discord) của brand
    const socialAccounts = await prisma.socialAccount.findMany({
      where: {
        brandId,
        platform: 'DISCORD',
        isConnected: true
      },
      include: {
        discordAccount: true,
        analytics: {
          orderBy: { fetchedAt: 'desc' },
          take: 1,
          include: {
            socialAnalytics: true
          }
        }
      }
    });

    // Lấy tất cả bài viết đã đăng thành công lên Discord của brand để tính toán số tin nhắn thật
    const publishedPosts = await prisma.post.findMany({
      where: {
        brandId,
        status: 'PUBLISHED',
        targetPlatforms: { contains: 'discord' },
        isDeleted: false
      },
      select: {
        id: true,
        metadata: true
      }
    });

    // Hàm phụ đếm bài viết được đăng cụ thể lên từng kênh Discord
    const getChannelPostsCount = (channelId) => {
      let count = 0;
      for (const post of publishedPosts) {
        let options = {};
        try {
          if (post.metadata) {
            options = JSON.parse(post.metadata);
          }
        } catch (e) {
          // ignore
        }
        const selectedChannels = options.selectedDiscordChannels || options.options?.selectedDiscordChannels;
        if (selectedChannels && Array.isArray(selectedChannels)) {
          if (selectedChannels.includes(channelId)) {
            count++;
          }
        } else {
          // Nếu không chọn cụ thể kênh nào, coi như đăng lên tất cả kênh đã kết nối của brand tại thời điểm đó
          count++;
        }
      }
      return count;
    };

    // 2. Nhóm theo guildId để tổng hợp unique servers & channels
    const serverMap = new Map();
    const channels = [];

    for (const sa of socialAccounts) {
      const discAcc = sa.discordAccount;
      if (!discAcc || !discAcc.guildId) continue;

      const latestAnalytics = sa.analytics?.[0]?.socialAnalytics || {};
      const postsCount = getChannelPostsCount(sa.id);
      
      channels.push({
        id: sa.id,
        channelName: discAcc.channelName,
        guildId: discAcc.guildId,
        guildName: discAcc.guildName,
        isPending: discAcc.isPending,
        clicks: latestAnalytics.clicks || 0,
        followersTotal: latestAnalytics.followersTotal || 0,
        impressions: postsCount,
      });

      if (!serverMap.has(discAcc.guildId)) {
        serverMap.set(discAcc.guildId, {
          guildId: discAcc.guildId,
          guildName: discAcc.guildName,
          memberCount: discAcc.memberCount || 0,
          onlineCount: discAcc.onlineCount || 0,
          lastSyncAt: discAcc.lastSyncAt,
          isPending: discAcc.isPending,
          channelsCount: 0
        });
      }
      serverMap.get(discAcc.guildId).channelsCount++;
    }

    const servers = Array.from(serverMap.values());

    // 3. Tổng hợp
    const totalMembers = servers.reduce((sum, s) => sum + (s.memberCount || 0), 0);
    const totalOnline = servers.reduce((sum, s) => sum + (s.onlineCount || 0), 0);
    const totalImpressions = publishedPosts.length;
    const totalClicks = channels.reduce((sum, c) => sum + c.clicks, 0);

    return {
      totalServers: servers.length,
      totalChannels: channels.length,
      totalMembers,
      totalOnline,
      totalImpressions,
      totalClicks,
      servers,
      channels
    };
  }

  /**
   * Snapshot ngay lập tức cho 1 guild cụ thể
   */
  async snapshotGuild(brandId, guildId) {
    try {
      const guildInfo = await discordGateway.getGuildWithCounts(guildId);
      const memberCount = guildInfo.approximate_member_count || 0;
      const onlineCount = guildInfo.approximate_presence_count || 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.discordGuildSnapshot.upsert({
        where: { guildId_brandId_snapshotAt: { guildId, brandId, snapshotAt: today } },
        update: { memberCount, onlineCount },
        create: { guildId, brandId, memberCount, onlineCount, snapshotAt: today }
      });

      await prisma.discordAccount.updateMany({
        where: { guildId },
        data: { memberCount, onlineCount, lastSyncAt: new Date() }
      });

      return { memberCount, onlineCount };
    } catch (err) {
      logger.error(`[DiscordStats] snapshotGuild error for ${guildId}:`, err.message);
      throw err;
    }
  }
}

module.exports = new DiscordStatsService();
