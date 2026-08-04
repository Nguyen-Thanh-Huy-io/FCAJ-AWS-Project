/**
 * Seed Subscriptions - Idempotent
 *
 * Subscription không có unique constraint ngoài id.
 * Dùng id cố định để upsert an toàn khi chạy lại nhiều lần.
 */
module.exports = async function (prisma, context) {
  console.log('Seeding Subscriptions...');
  const { agencyPlan, proPlan } = context.plans;

  const subsData = [
    { id: 'sub_agency_1', planId: agencyPlan.id },
    { id: 'sub_agency_2', planId: agencyPlan.id },
    { id: 'sub_agency_3', planId: agencyPlan.id },
    { id: 'sub_pro_test', planId: proPlan.id }
  ];

  const results = {};
  for (const { id, planId } of subsData) {
    results[id] = await prisma.subscription.upsert({
      where: { id },
      update: { planId, status: 'ACTIVE' },
      create: {
        id, planId, status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
  }

  context.subscriptions = {
    agencySub1: results['sub_agency_1'],
    agencySub2: results['sub_agency_2'],
    agencySub3: results['sub_agency_3'],
    proSub: results['sub_pro_test']
  };
};
