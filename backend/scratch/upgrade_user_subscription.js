const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Upgrading subscription for user vothanhnha26@gmail.com...');

  // 1. Find the user
  const user = await prisma.user.findUnique({
    where: { email: 'vothanhnha26@gmail.com' }
  });

  if (!user) {
    console.error('User not found!');
    return;
  }
  console.log('Found user:', user.name, user.id);

  // 2. Find all brands owned by the user
  const brands = await prisma.brand.findMany({
    where: { ownerId: user.id },
    include: { subscription: { include: { plan: { include: { planLimit: true } } } } }
  });

  console.log(`Found ${brands.length} brands owned by the user.`);

  for (const brand of brands) {
    console.log(`Processing brand: ${brand.name} (${brand.id})`);
    
    // If they have a subscription, update its plan limit and status
    if (brand.subscription) {
      const planLimitId = brand.subscription.plan.planLimitId;
      await prisma.planLimit.update({
        where: { id: planLimitId },
        data: {
          allowCustomRoles: true,
          allowApprovalWorkflow: true,
          maxBrands: 99,
          maxSocialProfiles: 99,
          maxTeamSeats: 99
        }
      });
      
      await prisma.subscription.update({
        where: { id: brand.subscriptionId },
        data: {
          status: 'ACTIVE'
        }
      });
      console.log(`Updated subscription plan limit & active status for brand: ${brand.name}`);
    }
  }

  // Also, update ALL plan limits in the database to be safe
  await prisma.planLimit.updateMany({
    data: {
      allowCustomRoles: true,
      allowApprovalWorkflow: true
    }
  });

  console.log('Subscription upgrade successfully completed.');
}

main()
  .catch(err => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
