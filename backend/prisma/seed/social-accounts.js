/**
 * Seed SocialAccounts - Idempotent
 *
 * SocialAccount có @@unique([brandId, platform, platformAccountId])
 * FacebookPage, YouTubeChannel không có unique key ngoài id, dùng findFirst.
 */
module.exports = async function (prisma, context) {
  console.log('Seeding SocialAccounts...');
  const { brand1, testBrand } = context.brands;

  // 1. Facebook Brand 1
  const socialFB = await prisma.socialAccount.upsert({
    where: {
      brandId_platform_platformAccountId: {
        brandId: brand1.id, platform: 'FACEBOOK', platformAccountId: 'fb_page_123'
      }
    },
    update: {
      username: 'publicast.global', displayName: 'PubliCast Global Fanpage',
      accessToken: 'fb_mock_token', scopes: 'pages_read_engagement,pages_manage_posts', isConnected: true
    },
    create: {
      brandId: brand1.id, platform: 'FACEBOOK', platformAccountId: 'fb_page_123',
      username: 'publicast.global', displayName: 'PubliCast Global Fanpage',
      accessToken: 'fb_mock_token', scopes: 'pages_read_engagement,pages_manage_posts',
      isConnected: true, connectedAt: new Date()
    }
  });

  const fbPage = await prisma.facebookPage.findFirst({ where: { socialAccountId: socialFB.id } });
  if (!fbPage) {
    await prisma.facebookPage.create({ data: { socialAccountId: socialFB.id, pageId: 'fb_page_123', category: 'Software Company', likesCount: 5200, followersCount: 5600, about: 'Trang thông tin chính thức của PubliCast Global' } });
  } else {
    await prisma.facebookPage.update({ where: { id: fbPage.id }, data: { likesCount: 5200, followersCount: 5600 } });
  }

  // 2. YouTube Brand 1
  const socialYT = await prisma.socialAccount.upsert({
    where: {
      brandId_platform_platformAccountId: {
        brandId: brand1.id, platform: 'YOUTUBE', platformAccountId: 'yt_channel_456'
      }
    },
    update: {
      username: '@publicast_global', displayName: 'PubliCast Global YT',
      accessToken: 'yt_mock_token', scopes: 'youtube.readonly,youtube.upload', isConnected: true
    },
    create: {
      brandId: brand1.id, platform: 'YOUTUBE', platformAccountId: 'yt_channel_456',
      username: '@publicast_global', displayName: 'PubliCast Global YT',
      accessToken: 'yt_mock_token', scopes: 'youtube.readonly,youtube.upload',
      isConnected: true, connectedAt: new Date()
    }
  });

  const ytChannel = await prisma.youTubeChannel.findFirst({ where: { socialAccountId: socialYT.id } });
  if (!ytChannel) {
    await prisma.youTubeChannel.create({ data: { socialAccountId: socialYT.id, channelId: 'yt_channel_456', subscribersCount: 12000, totalVideosCount: 84, totalViewsCount: 450000 } });
  } else {
    await prisma.youTubeChannel.update({ where: { id: ytChannel.id }, data: { subscribersCount: 12000, totalVideosCount: 84, totalViewsCount: 450000 } });
  }

  // 3. Facebook Test Brand
  const testSocialFB = await prisma.socialAccount.upsert({
    where: {
      brandId_platform_platformAccountId: {
        brandId: testBrand.id, platform: 'FACEBOOK', platformAccountId: 'fb_page_test'
      }
    },
    update: {
      username: 'trongphuc.test', displayName: 'Trong Phuc Tech Fanpage',
      accessToken: 'fb_mock_token_test', scopes: 'pages_read_engagement,pages_manage_posts', isConnected: true
    },
    create: {
      brandId: testBrand.id, platform: 'FACEBOOK', platformAccountId: 'fb_page_test',
      username: 'trongphuc.test', displayName: 'Trong Phuc Tech Fanpage',
      accessToken: 'fb_mock_token_test', scopes: 'pages_read_engagement,pages_manage_posts',
      isConnected: true, connectedAt: new Date()
    }
  });

  const testFbPage = await prisma.facebookPage.findFirst({ where: { socialAccountId: testSocialFB.id } });
  if (!testFbPage) {
    await prisma.facebookPage.create({ data: { socialAccountId: testSocialFB.id, pageId: 'fb_page_test', likesCount: 1500, followersCount: 1650, about: 'Trang kiểm thử công nghệ của Nguyễn Trọng Phúc' } });
  } else {
    await prisma.facebookPage.update({ where: { id: testFbPage.id }, data: { likesCount: 1500, followersCount: 1650 } });
  }
};
