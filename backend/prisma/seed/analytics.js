/**
 * Seed Analytics & Ads - Idempotent
 *
 * AdAccount có @@unique([brandId, platform, platformAccountId])
 * Analytics không có unique, ta tự định nghĩa ID cố định (deterministic) để upsert.
 */
module.exports = async function (prisma, context) {
  console.log('Seeding Analytics & Ads...');
  const { brand1 } = context.brands;

  const adAcc = await prisma.adAccount.upsert({
    where: {
      brandId_platform_platformAccountId: {
        brandId: brand1.id, platform: 'META_ADS', platformAccountId: 'act_vothanhnha_ad'
      }
    },
    update: {
      accountName: 'Meta Ads - Võ Thành Nhã Pro', currency: 'VND', timezone: 'Asia/Ho_Chi_Minh',
      accessToken: 'mock_ad_token', isActive: true
    },
    create: {
      brandId: brand1.id, platform: 'META_ADS', platformAccountId: 'act_vothanhnha_ad',
      accountName: 'Meta Ads - Võ Thành Nhã Pro', currency: 'VND', timezone: 'Asia/Ho_Chi_Minh',
      accessToken: 'mock_ad_token', isActive: true
    }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const spend = 150000 + Math.round(Math.sin(i) * 50000 + Math.random() * 20000);
    const clicks = Math.round(spend / 1500);
    const conversions = Math.round(clicks * 0.05);

    // Dùng deterministic ID cho Analytics để không bị tạo lặp
    const analyticsId = `analytics_ad_${brand1.id}_day_${i}`;

    await prisma.analytics.upsert({
      where: { id: analyticsId },
      update: {
        dateFrom: d, dateTo: d, fetchedAt: new Date(),
        adAnalytics: {
          update: {
            totalSpend: spend, impressions: clicks * 50, clicks: clicks, ctr: 2.0, cpc: 1500,
            cpm: 75000, conversions: conversions, conversionValue: conversions * 50000,
            cpa: conversions > 0 ? spend / conversions : 0, roas: conversions > 0 ? (conversions * 50000) / spend : 0,
            reach: clicks * 40, frequency: 1.1
          }
        }
      },
      create: {
        id: analyticsId, brandId: brand1.id, adAccountId: adAcc.id,
        dateFrom: d, dateTo: d, granularity: 'DAY', fetchedAt: new Date(), analyticsType: 'AD',
        adAnalytics: {
          create: {
            campaignId: 'camp_brand1_lead', campaignName: 'Lead Generation - VietNam',
            totalSpend: spend, impressions: clicks * 50, clicks: clicks, ctr: 2.0, cpc: 1500,
            cpm: 75000, conversions: conversions, conversionValue: conversions * 50000,
            cpa: conversions > 0 ? spend / conversions : 0, roas: conversions > 0 ? (conversions * 50000) / spend : 0,
            reach: clicks * 40, frequency: 1.1
          }
        }
      }
    });
  }
};
