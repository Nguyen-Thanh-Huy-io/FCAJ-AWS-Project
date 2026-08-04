/**
 * Orchestrator - Điều phối toàn bộ seed theo đúng thứ tự phụ thuộc.
 *
 * Nhóm 1: System Data (luôn chạy, idempotent)
 *   - plan-limits, products, plans, permissions, platform-limits
 *
 * Nhóm 2: Demo Data (chỉ chạy khi SEED_DEMO=true, idempotent)
 *   - users, subscriptions, brands, teams, auto-lists, reports,
 *     smart-links, social-accounts, analytics, posts, livestreams,
 *     notifications, demo-data
 */
module.exports = async function (prisma, options = {}) {
  const { seedDemo = false } = options;

  const context = {
    planLimits: {},
    plans: {},
    users: {},
    subscriptions: {},
    brands: {},
    roles: {},
    teams: {},
    autoLists: {}
  };

  // ─── Nhóm 1: System Data (idempotent, luôn chạy) ───
  console.log('═══ Seeding System Data (idempotent) ═══');
  await require('./plan-limits')(prisma, context);
  await require('./products')(prisma, context);
  await require('./plans')(prisma, context);
  await require('./permissions')(prisma, context);
  await require('./platform-limits')(prisma, context);

  // ─── Nhóm 2: Demo Data (chỉ chạy khi SEED_DEMO=true) ───
  if (seedDemo) {
    console.log('═══ SEED_DEMO=true → Seeding Demo Data (idempotent) ═══');
    await require('./users')(prisma, context);
    await require('./subscriptions')(prisma, context);
    await require('./brands')(prisma, context);
    await require('./teams')(prisma, context);
    await require('./auto-lists')(prisma, context);
    await require('./reports')(prisma, context);
    await require('./smart-links')(prisma, context);
    await require('./social-accounts')(prisma, context);
    await require('./analytics')(prisma, context);
    await require('./posts')(prisma, context);
    await require('./livestreams')(prisma, context);
    await require('./notifications')(prisma, context);
    await require('./demo-data')(prisma, context);
  } else {
    console.log('SEED_DEMO is not set → Skipping demo data.');
  }

  console.log('Seeding completed successfully.');
};
