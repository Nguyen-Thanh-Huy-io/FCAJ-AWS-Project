const prisma = require('../config/prisma');

class SocialAccountRepository {
  async upsertYouTubeAccount(brandId, channelData, tokens) {
    const { channelId, username, displayName, profilePictureUrl, statistics, snippet, analytics } = channelData;
    
    const account = await prisma.socialAccount.upsert({
      where: {
        brandId_platform_platformAccountId: {
          brandId,
          platform: 'YOUTUBE',
          platformAccountId: channelId
        }
      },
      update: {
        username,
        displayName,
        profilePictureUrl,
        accessToken: tokens.access_token,
        refreshToken: tokens.refreshToken || tokens.refresh_token || undefined,
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        scopes: tokens.scope,
        isConnected: true,
        updatedAt: new Date(),
        youtubeChannel: {
          update: {
            subscribersCount: parseInt(statistics.subscriberCount) || 0,
            totalVideosCount: parseInt(statistics.videoCount) || 0,
            totalViewsCount: parseInt(statistics.viewCount) || 0,
            customUrl: snippet.customUrl,
            country: snippet.country,
            defaultLanguage: snippet.defaultLanguage,
          }
        }
      },
      create: {
        brandId,
        platform: 'YOUTUBE',
        platformAccountId: channelId,
        username,
        displayName,
        profilePictureUrl,
        accessToken: tokens.access_token,
        refreshToken: tokens.refreshToken || tokens.refresh_token,
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        scopes: tokens.scope || '',
        connectedAt: new Date(),
        youtubeChannel: {
          create: {
            channelId,
            customUrl: snippet.customUrl,
            subscribersCount: parseInt(statistics.subscriberCount) || 0,
            totalVideosCount: parseInt(statistics.videoCount) || 0,
            totalViewsCount: parseInt(statistics.viewCount) || 0,
            country: snippet.country,
            defaultLanguage: snippet.defaultLanguage,
          }
        }
      },
      include: {
        youtubeChannel: true
      }
    });

    // Save analytics if available
    if (analytics) {
      await this.saveYouTubeAnalytics(brandId, account.id, analytics);
    }

    return this.findById(account.id);
  }

  async saveYouTubeAnalytics(brandId, socialAccountId, analyticsData) {
    const now = new Date();
    const analyticsEntry = await prisma.analytics.create({
      data: {
        brandId,
        socialAccountId,
        dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        dateTo: now,
        granularity: 'DAILY',
        fetchedAt: now,
        analyticsType: 'YOUTUBE_DETAILED'
      }
    });

    await prisma.socialAnalytics.create({
      data: {
        analyticsId: analyticsEntry.id,
        followersTotal: 0, // Handled by youtubeChannel table
        followersGain: 0,
        followersLost: 0,
        impressions: 0,
        reach: 0,
        engagements: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        clicks: 0,
        engagementRate: 0,
        audienceDemographicsJson: JSON.stringify({
          demographics: analyticsData.demographics,
          trafficSource: analyticsData.trafficSource,
          geographic: analyticsData.geographic,
          growth: analyticsData.growth
        })
      }
    });
  }

  async findById(id) {
    return prisma.socialAccount.findUnique({
      where: { id },
      include: {
        youtubeChannel: true,
        analytics: {
          orderBy: { fetchedAt: 'desc' },
          take: 1,
          include: {
            socialAnalytics: true
          }
        }
      }
    });
  }

  async updateTokens(id, tokens) {
    return prisma.socialAccount.update({
      where: { id },
      data: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || undefined,
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        updatedAt: new Date()
      }
    });
  }

  async findByBrandAndPlatform(brandId, platform) {
    return prisma.socialAccount.findMany({
      where: { brandId, platform },
      include: {
        youtubeChannel: true,
        instagramAccount: true,
        facebookPage: true,
        tikTokAccount: true,
        linkedInAccount: true,
        analytics: {
          orderBy: { fetchedAt: 'desc' },
          take: 1,
          include: {
            socialAnalytics: true
          }
        }
      }
    });
  }
}

module.exports = new SocialAccountRepository();
