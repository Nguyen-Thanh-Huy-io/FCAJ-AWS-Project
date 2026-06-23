const facebookGateway = require('./facebook.gateway');
const socialAccountRepository = require('../../../repositories/social/social-account.repository');
const { PLATFORMS, DEFAULT_CONFIG, ANALYTICS, SOCIAL_TECHNICAL } = require('../../../utils/constants');

class FacebookAnalyticsService {
  _getMockChannelInfo(pageId) {
    return {
      pageId: pageId || 'fb-page-mock',
      username: 'publicast_fb_mock',
      displayName: 'Mock PubliCast Facebook Page',
      profilePictureUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
      category: 'Software Company',
      likesCount: 12500,
      followersCount: 13200,
      about: 'Mock Facebook Page for PubliCast Team Testing',
      website: 'https://publicast.com'
    };
  }

  _getMockAnalyticsReport(startDate, endDate, currentFollowersCount) {
    const { start, end } = this._resolveDates(startDate, endDate);
    const dailyMap = this._initializeDailyMap(start, end);
    
    let currentVal = currentFollowersCount || 13200;
    const dates = Object.keys(dailyMap).sort();
    
    dates.forEach((dateStr, idx) => {
      const dayData = dailyMap[dateStr];
      const acquired = 10 + Math.floor(Math.random() * 40);
      const lost = Math.floor(Math.random() * 8);
      dayData.acquired = acquired;
      dayData.lost = lost;
      dayData.views = 200 + Math.floor(Math.random() * 800) + idx * 5;
      dayData.pageVisits = Math.round(dayData.views * 0.4);
      dayData.totalClicks = 20 + Math.floor(Math.random() * 100);
      dayData.reactions = 15 + Math.floor(Math.random() * 60);
      dayData.comments = 5 + Math.floor(Math.random() * 20);
      dayData.shares = 2 + Math.floor(Math.random() * 10);
      dayData.totalContent = Math.random() > 0.7 ? 1 : 0;
    });

    const feedStats = {
      totalPostsInPeriod: Object.values(dailyMap).reduce((sum, d) => sum + d.totalContent, 0),
      totalReactions: Object.values(dailyMap).reduce((sum, d) => sum + d.reactions, 0),
      totalComments: Object.values(dailyMap).reduce((sum, d) => sum + d.comments, 0),
      totalShares: Object.values(dailyMap).reduce((sum, d) => sum + d.shares, 0),
      albumCount: 2,
      imageCount: 5
    };

    const sortedDates = Object.keys(dailyMap).sort().map(d => dailyMap[d]);
    return this._calculateTotalsAndFormatResponse(sortedDates, currentVal, feedStats);
  }

  async getChannelInfo(auth, startDate, endDate, socialAccountId = null) {
    if (auth.pageAccessToken && auth.pageAccessToken.startsWith('mock-')) {
      const pageData = this._getMockChannelInfo(auth.pageId);
      const analyticsData = this._getMockAnalyticsReport(startDate, endDate, pageData.followersCount);
      return {
        ...pageData,
        analytics: analyticsData
      };
    }

    try {
      const pageData = await facebookGateway.getPageDetails(auth.pageId, auth.pageAccessToken);
      const followersToUse = pageData.followersCount > 0 ? pageData.followersCount : pageData.likesCount;
      const analyticsData = await this.getAnalyticsReport(auth.pageId, auth.pageAccessToken, startDate, endDate, followersToUse, socialAccountId);
      
      return {
        ...pageData,
        analytics: analyticsData
      };
    } catch (error) {
      console.error(`[Facebook Analytics] Real API call failed:`, error);
      throw new Error(`Facebook API Error: ${error.message}`);
    }
  }

  async getAnalyticsReport(pageId, pageAccessToken, startDate, endDate, currentFollowersCount, socialAccountId = null) {
    if (pageAccessToken && pageAccessToken.startsWith('mock-')) {
      return this._getMockAnalyticsReport(startDate, endDate, currentFollowersCount);
    }

    try {
      const { start, end } = this._resolveDates(startDate, endDate);
      const dailyMap = this._initializeDailyMap(start, end);

      // --- SMART SYNC LOGIC ---
      let missingRanges = [{ start, end }];

      if (socialAccountId) {
        const existingAnalytics = await socialAccountRepository.findAnalyticsInRange(socialAccountId, start, end);
        
        // existingAnalytics is ordered by fetchedAt DESC (newest first)
        existingAnalytics.forEach(record => {
          if (record.socialAnalytics?.audienceDemographicsJson) {
            try {
              const data = JSON.parse(record.socialAnalytics.audienceDemographicsJson);
              const growth = data.growth || [];
              growth.forEach(day => {
                // Only fill from DB if this date hasn't been filled by a newer record
                if (dailyMap[day.date] && !dailyMap[day.date]._fromDb) {
                  Object.assign(dailyMap[day.date], day);
                  // Mark as from DB if it contains real-looking data
                  // We use a small threshold to avoid marking 'empty' DB records as authoritative
                  if (day.views > 0 || day.pageVisits > 0 || day.acquired > 0 || day.totalClicks > 0) {
                    dailyMap[day.date]._fromDb = true;
                  }
                }
              });
            } catch (e) {
              console.error('[Facebook Analytics] Failed to parse DB JSON:', e);
            }
          }
        });

        // Calculate missing contiguous ranges
        missingRanges = this._calculateMissingRanges(dailyMap, start, end);
      }

      console.log(`[Facebook Analytics] Smart Sync: Requesting ${missingRanges.length} missing ranges from API for ${pageId}`);

      let hasInsightsData = false;
      for (const range of missingRanges) {
        const insights = await facebookGateway.getPageInsights(pageId, pageAccessToken, range.start, range.end);
        if (this._processInsights(insights, dailyMap)) {
          hasInsightsData = true;
        }
      }

      // Always fetch feed for the full period to ensure post counts are accurate
      const feedResult = await facebookGateway.getPageFeed(pageId, pageAccessToken, null, 100);
      const feedStats = this._processFeed(feedResult.data || [], dailyMap);

      if (!hasInsightsData && !Object.values(dailyMap).some(d => d._fromDb)) {
        if (pageAccessToken.startsWith('mock-')) {
          this._generateMockFallback(dailyMap);
        }
      }

      const sortedDates = Object.keys(dailyMap).sort().map(d => {
        const { _fromDb, ...cleanData } = dailyMap[d];
        return cleanData;
      });
      
      // Remove trailing days with no data (due to FB API delay)
      const finalData = [...sortedDates];
      while (finalData.length > 0) {
        const lastDay = finalData[finalData.length - 1];
        if (lastDay.views === 0 && lastDay.pageVisits === 0 && lastDay.acquired === 0 && lastDay.totalClicks === 0) {
          finalData.pop();
        } else {
          break;
        }
      }

      return this._calculateTotalsAndFormatResponse(finalData.length > 0 ? finalData : sortedDates, currentFollowersCount, feedStats);
    } catch (error) {
      console.error('Error fetching Facebook Page Analytics:', error);
      throw error;
    }
  }

  _calculateMissingRanges(dailyMap, start, end) {
    const sortedDates = Object.keys(dailyMap).sort();
    const ranges = [];
    let currentRange = null;

    sortedDates.forEach(dateStr => {
      if (!dailyMap[dateStr]._fromDb) {
        if (!currentRange) {
          currentRange = { start: dateStr, end: dateStr };
        } else {
          currentRange.end = dateStr;
        }
      } else {
        if (currentRange) {
          ranges.push(currentRange);
          currentRange = null;
        }
      }
    });

    if (currentRange) {
      ranges.push(currentRange);
    }

    return ranges;
  }

  _resolveDates(startDate, endDate) {
    const now = new Date();
    const defaultStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const defaultEnd = now.toISOString().split('T')[0];
    
    let start = startDate || defaultStart;
    let end = endDate || defaultEnd;

    const startMs = new Date(start).getTime();
    const endMs = new Date(end).getTime();
    const diffDays = (endMs - startMs) / (24 * 60 * 60 * 1000);

    if (diffDays > 90) {
      const adjustedStart = new Date(endMs - 90 * 24 * 60 * 60 * 1000);
      start = adjustedStart.toISOString().split('T')[0];
    }

    return { start, end };
  }

  _initializeDailyMap(start, end) {
    const dailyMap = {};
    const startMs = new Date(start + 'T00:00:00Z').getTime();
    const endMs = new Date(end + 'T00:00:00Z').getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    for (let time = startMs; time <= endMs; time += oneDayMs) {
      const dateStr = new Date(time).toISOString().split('T')[0];
      dailyMap[dateStr] = {
        date: dateStr,
        name: new Date(time).toLocaleDateString(DEFAULT_CONFIG.LOCALE, { month: 'short', day: 'numeric', timeZone: 'UTC' }),
        followers: 0,
        views: 0,
        pageVisits: 0,
        totalContent: 0,
        acquired: 0,
        lost: 0,
        totalClicks: 0,
        engagements: 0,
        reactions: 0,
        comments: 0,
        shares: 0
      };
    }
    return dailyMap;
  }

  _processInsights(insights, dailyMap) {
    let hasInsightsData = false;
    for (const item of insights) {
      const name = item.name;
      if (item.values) {
        for (const val of item.values) {
          const d = new Date(val.end_time);
          d.setTime(d.getTime() - 24 * 60 * 60 * 1000);
          const dateStr = d.toISOString().split('T')[0];
          
          if (dailyMap[dateStr]) {
            if (val.value > 0) hasInsightsData = true;
            if (name === ANALYTICS.METRICS.FACEBOOK.VIEWS) {
              dailyMap[dateStr].pageVisits = val.value || 0;
            } else if (name === ANALYTICS.METRICS.FACEBOOK.IMPRESSIONS) {
              dailyMap[dateStr].views = val.value || 0;
            } else if (name === ANALYTICS.METRICS.FACEBOOK.FOLLOWS || name === 'page_fan_adds_unique') {
              dailyMap[dateStr].acquired = (dailyMap[dateStr].acquired || 0) + (val.value || 0);
            } else if (name === 'page_daily_unfollows_unique' || name === 'page_fan_removes_unique') {
              dailyMap[dateStr].lost = (dailyMap[dateStr].lost || 0) + (val.value || 0);
            } else if (name === ANALYTICS.METRICS.FACEBOOK.ACTIONS) {
              dailyMap[dateStr].totalClicks = val.value || 0;
            } else if (name === ANALYTICS.METRICS.FACEBOOK.ENGAGEMENTS) {
              dailyMap[dateStr].engagements = val.value || 0;
              if (!dailyMap[dateStr].totalClicks) dailyMap[dateStr].totalClicks = val.value || 0;
            }
          }
        }
      }
    }
    return hasInsightsData;
  }

  _processFeed(feed, dailyMap) {
    const stats = {
      totalPostsInPeriod: 0,
      totalReactions: 0,
      totalComments: 0,
      totalShares: 0,
      albumCount: 0,
      imageCount: 0
    };

    for (const post of feed) {
      const postDateStr = new Date(post.created_time).toISOString().split('T')[0];
      if (dailyMap[postDateStr]) {
        dailyMap[postDateStr].totalContent += 1;
        stats.totalPostsInPeriod++;

        const commentCount = post.comments?.summary?.total_count || post.comments?.data?.length || 0;
        const reactionCount = post.reactions?.summary?.total_count || post.reactions?.data?.length || 0;
        const shareCount = post.shares?.count || 0;

        dailyMap[postDateStr].reactions += reactionCount;
        dailyMap[postDateStr].comments += commentCount;
        dailyMap[postDateStr].shares += shareCount;

        stats.totalReactions += reactionCount;
        stats.totalComments += commentCount;
        stats.totalShares += shareCount;

        const attachments = post.attachments?.data || [];
        const type = attachments[0]?.type || SOCIAL_TECHNICAL.FB_ATTACHMENT.STATUS;
        if (type === SOCIAL_TECHNICAL.FB_ATTACHMENT.ALBUM) stats.albumCount++;
        else stats.imageCount++;
      }
    }
    return stats;
  }

  _generateMockFallback(dailyMap) {
    Object.keys(dailyMap).forEach(dateStr => {
      const dayData = dailyMap[dateStr];
      const actions = dayData.reactions + dayData.comments + dayData.shares;
      if (actions > 0) {
        dayData.views = Math.round(actions * 15 + 20);
        dayData.pageVisits = Math.round(dayData.views * 0.6);
        dayData.totalClicks = Math.round(actions * 0.3 + 2);
        dayData.acquired = Math.round(actions * 0.1);
      } else {
        let hash = 0;
        for (let i = 0; i < dateStr.length; i++) {
          hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
        }
        const pseudoRandom = Math.abs(hash) % 12;
        dayData.views = pseudoRandom + 5;
        dayData.pageVisits = Math.round(dayData.views * 0.5);
        dayData.totalClicks = Math.round(pseudoRandom * 0.2);
        dayData.acquired = pseudoRandom > 9 ? 1 : 0;
      }
    });
  }

  _calculateTotalsAndFormatResponse(sortedDates, currentFollowersCount, feedStats) {
    let tempFollowers = currentFollowersCount;
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      sortedDates[i].followers = tempFollowers;
      tempFollowers = Math.max(0, tempFollowers - (sortedDates[i].acquired || 0) + (sortedDates[i].lost || 0));
    }

    const totalViews = sortedDates.reduce((sum, d) => sum + d.views, 0);
    const totalPageVisits = sortedDates.reduce((sum, d) => sum + d.pageVisits, 0);
    const totalClicks = sortedDates.reduce((sum, d) => sum + d.totalClicks, 0);
    const totalAcquired = sortedDates.reduce((sum, d) => sum + d.acquired, 0);
    const totalLost = sortedDates.reduce((sum, d) => sum + d.lost, 0);

    const daysCount = sortedDates.length || 1;
    const averageDailyNewFollowers = Math.round((totalAcquired - totalLost) / daysCount);
    const dailyPageViews = parseFloat((totalPageVisits / daysCount).toFixed(2));
    const dailyPosts = parseFloat((feedStats.totalPostsInPeriod / daysCount).toFixed(2));
    const postsPerWeek = parseFloat((dailyPosts * 7).toFixed(2));

    const dailyReactions = parseFloat((feedStats.totalReactions / daysCount).toFixed(2));
    const reactionsPerPost = feedStats.totalPostsInPeriod ? parseFloat((feedStats.totalReactions / feedStats.totalPostsInPeriod).toFixed(2)) : 0;
    const dailyComments = parseFloat((feedStats.totalComments / daysCount).toFixed(2));
    const commentsPerPost = feedStats.totalPostsInPeriod ? parseFloat((feedStats.totalComments / feedStats.totalPostsInPeriod).toFixed(2)) : 0;
    const sharesPerDay = parseFloat((feedStats.totalShares / daysCount).toFixed(2));
    const sharesPerPost = feedStats.totalPostsInPeriod ? parseFloat((feedStats.totalShares / feedStats.totalPostsInPeriod).toFixed(2)) : 0;

    const totalTypes = feedStats.albumCount + feedStats.imageCount || 1;
    const typesBreakdown = {
      album: Math.round((feedStats.albumCount / totalTypes) * 100),
      image: Math.round((feedStats.imageCount / totalTypes) * 100)
    };

    return {
      startDate: sortedDates[0]?.date,
      endDate: sortedDates[sortedDates.length - 1]?.date,
      summary: {
        followers: currentFollowersCount,
        views: totalViews,
        pageVisits: totalPageVisits,
        totalContent: feedStats.totalPostsInPeriod,
        averageDailyNewFollowers,
        dailyPageViews,
        dailyPosts,
        postsPerWeek
      },
      growth: sortedDates.map(d => ({
        date: d.date,
        name: d.name,
        followers: d.followers,
        views: d.views,
        pageVisits: d.pageVisits,
        totalContent: d.totalContent,
        reactions: d.reactions,
        comments: d.comments,
        shares: d.shares
      })),
      balance: sortedDates.map(d => ({
        date: d.date,
        name: d.name,
        acquired: d.acquired,
        lost: d.lost,
        totalContent: d.totalContent
      })),
      clicks: sortedDates.map(d => ({
        date: d.date,
        name: d.name,
        totalClicks: d.totalClicks,
        pageVisits: d.pageVisits,
        totalContent: d.totalContent
      })),
      postsPeriod: sortedDates.map(d => ({
        date: d.date,
        name: d.name,
        views: d.views,
        reactions: d.reactions
      })),
      interactions: {
        reactions: feedStats.totalReactions,
        comments: feedStats.totalComments,
        shares: feedStats.totalShares,
        clicks: totalClicks,
        posts: feedStats.totalPostsInPeriod,
        dailyReactions,
        reactionsPerPost,
        dailyComments,
        commentsPerPost,
        sharesPerDay,
        sharesPerPost,
        typesBreakdown,
        viewsBreakdown: {
          organic: 70, 
          promoted: 30
        }
      }
    };
  }

  async connectChannel(brandId, code, redirectUri) {
    const tokens = await facebookGateway.exchangeCodeForToken(code, redirectUri);
    
    // Diagnostics
    const permissions = await facebookGateway.getUserPermissions(tokens.access_token).catch(() => []);
    const pages = await facebookGateway.getUserPages(tokens.access_token);

    console.log('[Facebook Connect Diagnostics]', {
      permissions,
      pagesCount: pages.length,
      pages: pages.map(p => ({ id: p.id, name: p.name }))
    });

    if (pages.length === 0) {
      const scopes = permissions.map(p => `${p.permission}:${p.status}`).join(', ');
      throw new Error(`Không tìm thấy Trang Facebook. Quyền đã cấp: [${scopes || 'none'}]. Hãy đảm bảo tài khoản FB của bạn có quyền Quản trị (Admin) trên Trang.`);
    }

    const selectedPage = pages[0];
    const pageAccessToken = selectedPage.access_token;
    const pageId = selectedPage.id;

    const pageInfo = await this.getChannelInfo({ pageId, pageAccessToken });
    
    const { ConnectionConflictGuard, ConnectionConflictError } = require('../connection-conflict.guard');
    const conflictResult = await ConnectionConflictGuard.validateConflict(brandId, PLATFORMS.FACEBOOK, pageId);
    
    if (conflictResult.conflict) {
      throw new ConnectionConflictError(
        conflictResult.type,
        selectedPage.name,
        pageId,
        PLATFORMS.FACEBOOK,
        conflictResult.existingAccount.brand.name
      );
    }
    
    return socialAccountRepository.upsertFacebookAccount(brandId, {
      pageId,
      username: selectedPage.name,
      displayName: selectedPage.name,
      profilePictureUrl: pageInfo.profilePictureUrl,
      category: pageInfo.category,
      likesCount: pageInfo.likesCount,
      followersCount: pageInfo.followersCount,
      about: pageInfo.about,
      website: pageInfo.website,
      analytics: pageInfo.analytics
    }, {
      access_token: pageAccessToken,
      refresh_token: tokens.access_token
    });
  }

  async syncChannelMetrics(socialAccountId, startDate, endDate, force = false) {
    const account = await socialAccountRepository.findById(socialAccountId);
    if (!account || account.platform !== PLATFORMS.FACEBOOK) {
      throw new Error('Social account not found or is not a Facebook account');
    }

    const pageId = account.platformAccountId;
    const pageAccessToken = account.accessToken;

    const pageInfo = await this.getChannelInfo({ pageId, pageAccessToken }, startDate, endDate, socialAccountId);

    return socialAccountRepository.upsertFacebookAccount(account.brandId, {
      pageId,
      username: account.username,
      displayName: account.displayName,
      profilePictureUrl: pageInfo.profilePictureUrl,
      category: pageInfo.category,
      likesCount: pageInfo.likesCount,
      followersCount: pageInfo.followersCount,
      about: pageInfo.about,
      website: pageInfo.website,
      analytics: pageInfo.analytics
    }, {
      access_token: pageAccessToken,
      refresh_token: account.refreshToken
    });
  }
}

module.exports = new FacebookAnalyticsService();
