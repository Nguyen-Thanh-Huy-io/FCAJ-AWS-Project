/**
 * Seed Plans - Idempotent
 *
 * Plan có @@unique([name, billingCycle]) nên upsert bằng composite key.
 * Prisma yêu cầu sử dụng tên compound key: name_billingCycle
 */
module.exports = async function (prisma, context) {
  console.log('Seeding Plans...');
  const { freeLimit, starterLimit, proLimit, agencyLimit } = context.planLimits;

  const freePlan = await prisma.plan.upsert({
    where: { name_billingCycle: { name: 'FREE', billingCycle: 'MONTHLY' } },
    update: {
      priceAmount: 0, currency: 'USD', description: 'Free Plan for beginners',
      planLimitId: freeLimit.id, isActive: true,
      products: { set: [{ id: 'youtube_analytics' }, { id: 'facebook_management' }] }
    },
    create: {
      name: 'FREE', priceAmount: 0, currency: 'USD', billingCycle: 'MONTHLY',
      description: 'Free Plan for beginners', planLimitId: freeLimit.id, isActive: true,
      products: { connect: [{ id: 'youtube_analytics' }, { id: 'facebook_management' }] }
    }
  });

  const starterPlan = await prisma.plan.upsert({
    where: { name_billingCycle: { name: 'STARTER', billingCycle: 'MONTHLY' } },
    update: {
      priceAmount: 19.00, currency: 'USD', description: 'Starter Plan for growing creators',
      planLimitId: starterLimit.id, isActive: true,
      products: { set: [{ id: 'youtube_analytics' }, { id: 'facebook_management' }, { id: 'instagram_insights' }] }
    },
    create: {
      name: 'STARTER', priceAmount: 19.00, currency: 'USD', billingCycle: 'MONTHLY',
      description: 'Starter Plan for growing creators', planLimitId: starterLimit.id, isActive: true,
      products: { connect: [{ id: 'youtube_analytics' }, { id: 'facebook_management' }, { id: 'instagram_insights' }] }
    }
  });

  const proPlan = await prisma.plan.upsert({
    where: { name_billingCycle: { name: 'PRO', billingCycle: 'MONTHLY' } },
    update: {
      priceAmount: 49.00, currency: 'USD', description: 'Professional Plan for marketers',
      planLimitId: proLimit.id, isActive: true,
      products: { set: [{ id: 'youtube_analytics' }, { id: 'facebook_management' }, { id: 'tiktok_creative' }, { id: 'instagram_insights' }, { id: 'ai_content_engine' }, { id: 'ai_best_time' }, { id: 'unified_inbox' }, { id: 'custom_links' }] }
    },
    create: {
      name: 'PRO', priceAmount: 49.00, currency: 'USD', billingCycle: 'MONTHLY',
      description: 'Professional Plan for marketers', planLimitId: proLimit.id, isActive: true,
      products: { connect: [{ id: 'youtube_analytics' }, { id: 'facebook_management' }, { id: 'tiktok_creative' }, { id: 'instagram_insights' }, { id: 'ai_content_engine' }, { id: 'ai_best_time' }, { id: 'unified_inbox' }, { id: 'custom_links' }] }
    }
  });

  const agencyPlan = await prisma.plan.upsert({
    where: { name_billingCycle: { name: 'AGENCY', billingCycle: 'MONTHLY' } },
    update: {
      priceAmount: 199.00, currency: 'USD', description: 'Agency Plan for large teams',
      planLimitId: agencyLimit.id, isActive: true,
      products: { set: [{ id: 'youtube_analytics' }, { id: 'facebook_management' }, { id: 'tiktok_creative' }, { id: 'instagram_insights' }, { id: 'ai_content_engine' }, { id: 'ai_best_time' }, { id: 'ads_manager' }, { id: 'unified_inbox' }, { id: 'custom_links' }] }
    },
    create: {
      name: 'AGENCY', priceAmount: 199.00, currency: 'USD', billingCycle: 'MONTHLY',
      description: 'Agency Plan for large teams', planLimitId: agencyLimit.id, isActive: true,
      products: { connect: [{ id: 'youtube_analytics' }, { id: 'facebook_management' }, { id: 'tiktok_creative' }, { id: 'instagram_insights' }, { id: 'ai_content_engine' }, { id: 'ai_best_time' }, { id: 'ads_manager' }, { id: 'unified_inbox' }, { id: 'custom_links' }] }
    }
  });

  context.plans = { freePlan, starterPlan, proPlan, agencyPlan };
};
