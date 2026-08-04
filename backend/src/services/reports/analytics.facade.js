const prisma = require('../../config/prisma');

class AnalyticsFacade {
  /**
   * Aggregate analytics data for a brand within a date range and for specific platforms.
   * @param {string} brandId 
   * @param {Date} dateFrom 
   * @param {Date} dateTo 
   * @param {string[]} platforms - Array of platforms, e.g. ["Facebook", "YouTube"]
   */
  async getAggregatedData(brandId, dateFrom, dateTo, platforms) {
    // 1. Fetch Brand Info
    const brand = await prisma.brand.findUnique({
      where: { id: brandId }
    });

    // 2. Fetch connected SocialAccounts of the Brand
    const socialAccounts = await prisma.socialAccount.findMany({
      where: { 
        brandId,
        isConnected: true
      },
      include: {
        youtubeChannel: true,
        facebookPage: true,
        instagramAccount: true,
        tikTokAccount: true,
        linkedInAccount: true,
        telegramAccount: true,
        discordAccount: true
      }
    });

    // Map platforms to uppercase
    const selectedPlatformsUpper = platforms.map(p => p.toUpperCase());

    // Filter accounts by requested platforms
    const activeAccounts = socialAccounts.filter(acc => {
      let mappedPlatform = acc.platform;
      return selectedPlatformsUpper.includes(mappedPlatform);
    });

    // 3. Process channels details
    const channels = [];
    let totalFollowers = 0;
    
    for (const acc of activeAccounts) {
      let followers = 0;
      if (acc.platform === 'YOUTUBE' && acc.youtubeChannel) {
        followers = acc.youtubeChannel.subscribersCount;
      } else if (acc.platform === 'FACEBOOK' && acc.facebookPage) {
        followers = acc.facebookPage.followersCount;
      } else if (acc.platform === 'INSTAGRAM' && acc.instagramAccount) {
        followers = acc.instagramAccount.followersCount;
      } else if (acc.platform === 'TIKTOK' && acc.tikTokAccount) {
        followers = acc.tikTokAccount.followersCount;
      } else if (acc.platform === 'LINKEDIN' && acc.linkedInAccount) {
        followers = acc.linkedInAccount.followersCount;
      } else if (acc.platform === 'TELEGRAM' && acc.telegramAccount) {
        followers = acc.telegramAccount.memberCount;
      } else if (acc.platform === 'DISCORD' && acc.discordAccount) {
        followers = acc.discordAccount.memberCount;
      }

      // Count posts published in this channel
      const postsCount = await prisma.post.count({
        where: {
          brandId,
          status: 'PUBLISHED',
          targetPlatforms: {
            contains: acc.platform
          },
          publishedAt: {
            gte: dateFrom,
            lte: dateTo
          }
        }
      });

      // Get the latest analytics record from DB for this account within range
      const latestAnalytics = await prisma.analytics.findFirst({
        where: {
          socialAccountId: acc.id,
          dateFrom: {
            gte: dateFrom
          },
          dateTo: {
            lte: dateTo
          }
        },
        include: {
          socialAnalytics: true
        },
        orderBy: {
          fetchedAt: 'desc'
        }
      });

      let channelReach = 0;
      let channelImpressions = 0;
      let channelEngagements = 0;
      let channelLikes = 0;
      let channelComments = 0;
      let channelShares = 0;
      let channelClicks = 0;

      if (latestAnalytics && latestAnalytics.socialAnalytics) {
        const sa = latestAnalytics.socialAnalytics;
        channelReach = sa.reach || 0;
        channelImpressions = sa.impressions || 0;
        channelEngagements = sa.engagements || 0;
        channelLikes = sa.likes || 0;
        channelComments = sa.comments || 0;
        channelShares = sa.shares || 0;
        channelClicks = sa.clicks || 0;
        if (sa.followersTotal > 0) {
          followers = sa.followersTotal;
        }
      }

      totalFollowers += followers;

      // Calculate real engagement rate
      const engagementRate = latestAnalytics && latestAnalytics.socialAnalytics
        ? (latestAnalytics.socialAnalytics.engagementRate || (channelReach > 0 ? parseFloat(((channelEngagements / channelReach) * 100).toFixed(2)) : 0.0))
        : 0.0;

      let analyticsData = null;
      if (latestAnalytics && latestAnalytics.socialAnalytics && latestAnalytics.socialAnalytics.audienceDemographicsJson) {
        try {
          analyticsData = JSON.parse(latestAnalytics.socialAnalytics.audienceDemographicsJson);
        } catch (e) {
          console.error("Error parsing audienceDemographicsJson:", e);
        }
      }

      channels.push({
        platform: acc.platform,
        displayName: acc.displayName || acc.username,
        followers,
        postsCount,
        engagementRate: parseFloat(engagementRate.toFixed(2)),
        reach: channelReach,
        impressions: channelImpressions,
        engagements: channelEngagements,
        likes: channelLikes,
        comments: channelComments,
        shares: channelShares,
        clicks: channelClicks,
        analyticsData
      });
    }

    // 4. Query Published Posts to find top performing posts
    const dbPosts = await prisma.post.findMany({
      where: {
        brandId,
        status: 'PUBLISHED',
        publishedAt: {
          gte: dateFrom,
          lte: dateTo
        }
      },
      take: 10,
      orderBy: {
        publishedAt: 'desc'
      }
    });

    const topPosts = [];
    for (const post of dbPosts) {
      // Parse platforms
      let platform = 'FACEBOOK';
      try {
        if (post.targetPlatforms) {
          const parsed = JSON.parse(post.targetPlatforms);
          if (Array.isArray(parsed) && parsed.length > 0) platform = parsed[0];
          else if (typeof parsed === 'string') platform = parsed;
        }
      } catch (e) {
        if (typeof post.targetPlatforms === 'string') {
          platform = post.targetPlatforms;
        }
      }

      const platformUpper = platform.toUpperCase();
      let likes = 0;
      let comments = 0;
      let shares = 0;
      let reachOrViews = 0;

      let currentPlatformPostId = post.platformPostId;
      if (post.platformPostId && post.platformPostId.startsWith('{')) {
        try {
          const map = JSON.parse(post.platformPostId);
          currentPlatformPostId = map[platformUpper] || null;
        } catch (e) {
          // ignore
        }
      }

      if (platformUpper === 'FACEBOOK' && currentPlatformPostId) {
        const fbMetric = await prisma.facebookPostMetric.findFirst({
          where: {
            platformPostId: currentPlatformPostId,
            brandId
          }
        });
        if (fbMetric) {
          likes = fbMetric.likes || 0;
          comments = fbMetric.comments || 0;
          shares = fbMetric.shares || 0;
          reachOrViews = fbMetric.reach || 0;
        }
      } else if (platformUpper === 'YOUTUBE' && currentPlatformPostId) {
        const ytMetric = await prisma.trackedVideo.findFirst({
          where: {
            videoId: currentPlatformPostId,
            brandId
          }
        });
        if (ytMetric) {
          likes = ytMetric.lastLikes || 0;
          comments = ytMetric.lastComments || 0;
          reachOrViews = ytMetric.lastViews || 0;
        }
      }

      // Calculate post engagement rate
      const denominator = reachOrViews > 0 ? reachOrViews : (totalFollowers || 1000);
      const engagementRate = parseFloat((((likes + comments + shares) / denominator) * 100).toFixed(2));

      topPosts.push({
        id: post.id,
        title: post.title,
        caption: post.caption,
        platform: platformUpper,
        likes,
        comments,
        shares,
        engagementRate
      });
    }

    // Sort top posts by engagement rate
    topPosts.sort((a, b) => b.engagementRate - a.engagementRate);
    const finalTopPosts = topPosts.slice(0, 5);

    // 5. Aggregate overall metrics
    let totalReach = 0;
    let totalImpressions = 0;
    let totalEngagements = 0;

    channels.forEach(ch => {
      totalReach += ch.reach;
      totalImpressions += ch.impressions;
      totalEngagements += ch.engagements;
    });

    const overallEngagementRate = totalReach > 0 
      ? parseFloat(((totalEngagements / totalReach) * 100).toFixed(2)) 
      : 0.0;

    return {
      brand: {
        id: brandId,
        name: brand?.name || 'PubliCast Brand'
      },
      overview: {
        reach: totalReach,
        impressions: totalImpressions,
        engagements: totalEngagements,
        engagementRate: overallEngagementRate
      },
      channels,
      topPosts: finalTopPosts
    };
  }
}

const analyticsFacade = new AnalyticsFacade();
module.exports = analyticsFacade;
