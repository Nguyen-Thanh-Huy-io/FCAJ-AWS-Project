/**
 * Seed Products - Idempotent
 *
 * Product dùng semantic slug làm id (e.g. 'youtube_analytics'),
 * nên upsert bằng id để an toàn khi chạy lại.
 */
module.exports = async function (prisma, context) {
  console.log('Seeding Products...');

  const productsData = [
    { id: 'youtube_analytics', name: 'YouTube Analytics', category: 'Platforms' },
    { id: 'facebook_management', name: 'Facebook Management', category: 'Platforms' },
    { id: 'tiktok_creative', name: 'TikTok Creative Suite', category: 'Platforms' },
    { id: 'instagram_insights', name: 'Instagram Insights', category: 'Platforms' },
    { id: 'ai_content_engine', name: 'AI Content Engine', category: 'AI Tools' },
    { id: 'ai_best_time', name: 'AI Best Time Suggest', category: 'AI Tools' },
    { id: 'ads_manager', name: 'Ads Manager Pro', category: 'Management' },
    { id: 'unified_inbox', name: 'Unified Inbox', category: 'Management' },
    { id: 'custom_links', name: 'Custom Branded Links', category: 'Tools' }
  ];

  for (const { id, ...data } of productsData) {
    await prisma.product.upsert({
      where: { id },
      update: data,
      create: { id, ...data }
    });
  }
};
