const prisma = require('../../config/prisma');
const { PLATFORMS, ANALYTICS } = require('../../utils/constants');
const { encrypt, decrypt } = require('../../utils/encryption');

class SocialAccountRepository {
  _decryptAccount(account) {
    if (!account) return null;
    return {
      ...account,
      accessToken: decrypt(account.accessToken),
      refreshToken: decrypt(account.refreshToken)
    };
  }

  _decryptAccounts(accounts) {
    if (!accounts) return [];
    return accounts.map(acc => this._decryptAccount(acc));
  }
  async upsertFacebookAccount(brandId, pageData, tokens) {
    const { pageId, username, displayName, profilePictureUrl, category, likesCount, followersCount, about, website } = pageData;
    
    const finalUsername = username || displayName || 'facebook_page';

    const account = await prisma.socialAccount.upsert({
      where: {
        brandId_platform_platformAccountId: {
          brandId,
          platform: PLATFORMS.FACEBOOK,
          platformAccountId: pageId
        }
      },
      update: {
        username: finalUsername,
        displayName,
        profilePictureUrl,
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : undefined,
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        scopes: tokens.scope,
        isConnected: true,
        lastSyncAt: new Date(),
        updatedAt: new Date(),
        facebookPage: {
          upsert: {
            create: {
              pageId,
              category,
              likesCount: parseInt(likesCount) || 0,
              followersCount: parseInt(followersCount) || 0,
              about,
              website,
            },
            update: {
              likesCount: parseInt(likesCount) || 0,
              followersCount: parseInt(followersCount) || 0,
              category,
              about,
              website,
            }
          }
        }
      },
      create: {
        brandId,
        platform: PLATFORMS.FACEBOOK,
        platformAccountId: pageId,
        username: finalUsername,
        displayName,
        profilePictureUrl,
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : '',
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        scopes: tokens.scope || '',
        lastSyncAt: new Date(),
        connectedAt: new Date(),
        facebookPage: {
          create: {
            pageId,
            category,
            likesCount: parseInt(likesCount) || 0,
            followersCount: parseInt(followersCount) || 0,
            about,
            website,
          }
        }
      },
      include: {
        facebookPage: true
      }
    });

    if (pageData.analytics) {
      await this.saveFacebookAnalytics(brandId, account.id, pageData.analytics);
    }

    return this.findById(account.id);
  }

  async upsertTikTokAccount(brandId, accountData, tokens) {
    const { pageId, username, displayName, profilePictureUrl, followersCount = 0, followingCount = 0, likesCount = 0, videoCount = 0 } = accountData;

    const finalUsername = username || displayName || 'tiktok_user';

    const account = await prisma.socialAccount.upsert({
      where: {
        brandId_platform_platformAccountId: {
          brandId,
          platform: PLATFORMS.TIKTOK,
          platformAccountId: pageId
        }
      },
      update: {
        username: finalUsername,
        displayName,
        profilePictureUrl,
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : undefined,
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        scopes: tokens.scope,
        isConnected: true,
        lastSyncAt: new Date(),
        updatedAt: new Date(),
        tikTokAccount: {
          upsert: {
            create: {
              followersCount,
              followingCount,
              likesCount,
              videoCount
            },
            update: {
              followersCount,
              followingCount,
              likesCount,
              videoCount
            }
          }
        }
      },
      create: {
        brandId,
        platform: PLATFORMS.TIKTOK,
        platformAccountId: pageId,
        username: finalUsername,
        displayName,
        profilePictureUrl,
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : '',
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        scopes: tokens.scope || '',
        lastSyncAt: new Date(),
        connectedAt: new Date(),
        tikTokAccount: {
          create: {
            followersCount,
            followingCount,
            likesCount,
            videoCount
          }
        }
      },
      include: {
        tikTokAccount: true
      }
    });

    if (accountData.analytics) {
      await this.saveTikTokAnalytics(brandId, account.id, accountData.analytics);
    }

    return this.findById(account.id);
  }

  async saveTikTokAnalytics(brandId, socialAccountId, analyticsData) {
    const now = new Date();
    
    const followersTotal = analyticsData.summary?.followers || 0;
    const followersGain = analyticsData.balance?.reduce((sum, item) => sum + (item.acquired || 0), 0) || 0;
    const followersLost = analyticsData.balance?.reduce((sum, item) => sum + (item.lost || 0), 0) || 0;
    const impressions = analyticsData.summary?.views || 0;
    const reach = analyticsData.summary?.reach || 0;
    const likes = analyticsData.interactions?.likes || 0;
    const comments = analyticsData.interactions?.comments || 0;
    const shares = analyticsData.interactions?.shares || 0;
    const clicks = analyticsData.interactions?.clicks || 0;
    
    const engagements = likes + comments + shares;
    const engagementRate = reach ? parseFloat(((engagements / reach) * 100).toFixed(2)) : 0;

    const analyticsEntry = await prisma.analytics.create({
      data: {
        brandId,
        socialAccountId,
        dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        dateTo: now,
        granularity: ANALYTICS.GRANULARITY.DAILY,
        fetchedAt: now,
        analyticsType: ANALYTICS.TYPES.TIKTOK_DETAILED
      }
    });

    await prisma.socialAnalytics.create({
      data: {
        analyticsId: analyticsEntry.id,
        followersTotal,
        followersGain,
        followersLost,
        impressions,
        reach,
        engagements,
        likes,
        comments,
        shares,
        saves: 0,
        clicks,
        engagementRate,
        audienceDemographicsJson: JSON.stringify(analyticsData)
      }
    });
  }

  async saveFacebookAnalytics(brandId, socialAccountId, analyticsData) {
    const now = new Date();
    
    // Extract totals from analyticsData structure
    const followersTotal = analyticsData.summary?.followers || 0;
    const followersGain = analyticsData.balance?.reduce((sum, item) => sum + (item.acquired || 0), 0) || 0;
    const followersLost = analyticsData.balance?.reduce((sum, item) => sum + (item.lost || 0), 0) || 0;
    const impressions = analyticsData.summary?.views || 0;
    const reach = analyticsData.summary?.pageVisits || 0;
    const likes = analyticsData.interactions?.reactions || 0;
    const comments = analyticsData.interactions?.comments || 0;
    const shares = analyticsData.interactions?.shares || 0;
    const clicks = analyticsData.interactions?.clicks || 0;
    
    const engagements = likes + comments + shares;
    const engagementRate = reach ? parseFloat(((engagements / reach) * 100).toFixed(2)) : 0;

    const analyticsEntry = await prisma.analytics.create({
      data: {
        brandId,
        socialAccountId,
        dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        dateTo: now,
        granularity: ANALYTICS.GRANULARITY.DAILY,
        fetchedAt: now,
        analyticsType: ANALYTICS.TYPES.FACEBOOK_DETAILED
      }
    });

    await prisma.socialAnalytics.create({
      data: {
        analyticsId: analyticsEntry.id,
        followersTotal,
        followersGain,
        followersLost,
        impressions,
        reach,
        engagements,
        likes,
        comments,
        shares,
        saves: 0,
        clicks,
        engagementRate,
        audienceDemographicsJson: JSON.stringify(analyticsData)
      }
    });
  }

  async upsertYouTubeAccount(brandId, channelData, tokens) {
    const { channelId, username, displayName, profilePictureUrl, statistics, snippet, analytics } = channelData;
    
    const finalUsername = username || displayName || 'youtube_channel';

    const account = await prisma.socialAccount.upsert({
      where: {
        brandId_platform_platformAccountId: {
          brandId,
          platform: PLATFORMS.YOUTUBE,
          platformAccountId: channelId
        }
      },
      update: {
        username: finalUsername,
        displayName,
        profilePictureUrl,
        accessToken: encrypt(tokens.access_token),
        refreshToken: (tokens.refreshToken || tokens.refresh_token) ? encrypt(tokens.refreshToken || tokens.refresh_token) : undefined,
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        scopes: tokens.scope,
        isConnected: true,
        lastSyncAt: new Date(),
        updatedAt: new Date(),
        youtubeChannel: {
          update: {
            subscribersCount: parseInt(statistics.subscriberCount) || 0,
            totalVideosCount: parseInt(statistics.videoCount) || 0,
            totalViewsCount: parseInt(statistics.viewCount) || 0,
            customUrl: snippet.customUrl,
            uploadsPlaylistId: channelData.uploadsPlaylistId,
            country: snippet.country,
            defaultLanguage: snippet.defaultLanguage,
          }
        }
      },
      create: {
        brandId,
        platform: PLATFORMS.YOUTUBE,
        platformAccountId: channelId,
        username: finalUsername,
        displayName,
        profilePictureUrl,
        accessToken: encrypt(tokens.access_token),
        refreshToken: (tokens.refreshToken || tokens.refresh_token) ? encrypt(tokens.refreshToken || tokens.refresh_token) : '',
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        scopes: tokens.scope || '',
        lastSyncAt: new Date(),
        connectedAt: new Date(),
        youtubeChannel: {
          create: {
            channelId,
            customUrl: snippet.customUrl,
            uploadsPlaylistId: channelData.uploadsPlaylistId,
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
        granularity: ANALYTICS.GRANULARITY.DAILY,
        fetchedAt: now,
        analyticsType: ANALYTICS.TYPES.YOUTUBE_DETAILED
      }
    });

    await prisma.socialAnalytics.create({
      data: {
        analyticsId: analyticsEntry.id,
        followersTotal: 0,
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
    const account = await prisma.socialAccount.findUnique({
      where: { id },
      include: {
        youtubeChannel: true,
        facebookPage: true,
        tikTokAccount: true,
        analytics: {
          orderBy: { fetchedAt: 'desc' },
          take: 1,
          include: {
            socialAnalytics: true
          }
        }
      }
    });
    return this._decryptAccount(account);
  }

  async updateTokens(id, tokens) {
    const account = await prisma.socialAccount.update({
      where: { id },
      data: {
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : undefined,
        tokenExpiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        updatedAt: new Date()
      }
    });
    return this._decryptAccount(account);
  }

  async findByBrandAndPlatform(brandId, platform) {
    const where = { brandId };
    if (platform) where.platform = platform;

    const accounts = await prisma.socialAccount.findMany({
      where,
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
    return this._decryptAccounts(accounts);
  }

  async findByBrandAndPlatformFirst(brandId, platform) {
    const where = { brandId };
    if (platform) where.platform = platform;
    
    const account = await prisma.socialAccount.findFirst({
      where
    });
    return this._decryptAccount(account);
  }

  async deleteManyByBrandAndPlatform(brandId, platform) {
    return prisma.socialAccount.deleteMany({
      where: { brandId, platform }
    });
  }
}

module.exports = new SocialAccountRepository();
