module.exports = async function (prisma, context) {
  console.log('Seeding PlatformLimits...');
  const platformLimits = [
    { platform: 'YOUTUBE', subType: 'VIDEO', maxCaptionLength: 5000, maxFileSizeMb: 1024, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov', minVideoDuration: null, maxVideoDuration: null, aspectRatios: '16:9' },
    { platform: 'YOUTUBE', subType: 'SHORTS', maxCaptionLength: 100, maxFileSizeMb: 100, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov', minVideoDuration: 1, maxVideoDuration: 60, aspectRatios: '9:16' },
    { platform: 'FACEBOOK', subType: 'POST', maxCaptionLength: 63206, maxFileSizeMb: 100, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: null, maxVideoDuration: null, aspectRatios: null },
    { platform: 'FACEBOOK', subType: 'REEL', maxCaptionLength: 2000, maxFileSizeMb: 100, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov', minVideoDuration: 3, maxVideoDuration: 90, aspectRatios: '9:16' },
    { platform: 'FACEBOOK', subType: 'STORY', maxCaptionLength: 2200, maxFileSizeMb: 50, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: 1, maxVideoDuration: 15, aspectRatios: '9:16' },
    { platform: 'TIKTOK', subType: 'VIDEO', maxCaptionLength: 2200, maxFileSizeMb: 100, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov,webm', minVideoDuration: 3, maxVideoDuration: 600, aspectRatios: '9:16' },
    { platform: 'INSTAGRAM', subType: 'POST', maxCaptionLength: 2200, maxFileSizeMb: 100, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: 3, maxVideoDuration: 60, aspectRatios: '1:1,4:5' },
    { platform: 'INSTAGRAM', subType: 'REEL', maxCaptionLength: 2200, maxFileSizeMb: 100, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov', minVideoDuration: 3, maxVideoDuration: 90, aspectRatios: '9:16' },
    { platform: 'INSTAGRAM', subType: 'STORY', maxCaptionLength: 2200, maxFileSizeMb: 50, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: 1, maxVideoDuration: 15, aspectRatios: '9:16' },
    { platform: 'LINKEDIN', subType: 'POST', maxCaptionLength: 3000, maxFileSizeMb: 100, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: 3, maxVideoDuration: 600, aspectRatios: null },
    { platform: 'DISCORD', subType: 'POST', maxCaptionLength: 2000, maxFileSizeMb: 25, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: null, maxVideoDuration: null, aspectRatios: null },
    { platform: 'TELEGRAM', subType: 'POST', maxCaptionLength: 1024, maxFileSizeMb: 50, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: null, maxVideoDuration: null, aspectRatios: null }
  ];

  for (const limit of platformLimits) {
    await prisma.platformLimit.upsert({
      where: { platform_subType: { platform: limit.platform, subType: limit.subType } },
      update: limit, create: limit
    });
  }
};
