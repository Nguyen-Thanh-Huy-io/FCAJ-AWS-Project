/**
 * Seed PlanLimits - Idempotent
 *
 * PlanLimit không có unique constraint ngoài id, nên ta dùng id cố định
 * để có thể upsert an toàn khi chạy lại nhiều lần.
 */
module.exports = async function (prisma, context) {
  console.log('Seeding PlanLimits...');

  const limitsData = [
    {
      id: 'plan_limit_free',
      maxBrands: 1, maxSocialProfiles: 2, maxPostsPerMonth: 10,
      maxLivePlatforms: 1, maxStreamQuality: 'SD', maxTeamSeats: 1,
      allowCustomRoles: false, allowApprovalWorkflow: false
    },
    {
      id: 'plan_limit_starter',
      maxBrands: 3, maxSocialProfiles: 5, maxPostsPerMonth: 50,
      maxLivePlatforms: 2, maxStreamQuality: 'HD_720P', maxTeamSeats: 3,
      allowCustomRoles: true, allowApprovalWorkflow: false
    },
    {
      id: 'plan_limit_pro',
      maxBrands: 10, maxSocialProfiles: 20, maxPostsPerMonth: 300,
      maxLivePlatforms: 5, maxStreamQuality: 'FHD_1080P', maxTeamSeats: 10,
      allowCustomRoles: true, allowApprovalWorkflow: true
    },
    {
      id: 'plan_limit_agency',
      maxBrands: 50, maxSocialProfiles: 100, maxPostsPerMonth: 2000,
      maxLivePlatforms: 10, maxStreamQuality: 'UHD_4K', maxTeamSeats: 50,
      allowCustomRoles: true, allowApprovalWorkflow: true
    }
  ];

  const results = {};
  for (const { id, ...data } of limitsData) {
    results[id] = await prisma.planLimit.upsert({
      where: { id },
      update: data,
      create: { id, ...data }
    });
  }

  context.planLimits = {
    freeLimit: results['plan_limit_free'],
    starterLimit: results['plan_limit_starter'],
    proLimit: results['plan_limit_pro'],
    agencyLimit: results['plan_limit_agency']
  };
};
