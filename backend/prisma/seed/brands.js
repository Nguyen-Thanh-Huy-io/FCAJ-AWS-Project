/**
 * Seed Brands - Idempotent
 *
 * Brand có subscriptionId @unique, nên upsert bằng subscriptionId.
 * Ngoài ra, testBrand có id cố định nên upsert bằng id.
 */
module.exports = async function (prisma, context) {
  console.log('Seeding Brands...');
  const { customerUser, testUser } = context.users;
  const { agencySub1, agencySub2, agencySub3, proSub } = context.subscriptions;

  // Helper: upsert brand bằng id cố định
  async function upsertBrand({ id, name, ownerId, subscriptionId }) {
    return prisma.brand.upsert({
      where: { id },
      update: { name, timezone: 'Asia/Ho_Chi_Minh', defaultLanguage: 'vi', ownerId, isActive: true },
      create: { id, name, timezone: 'Asia/Ho_Chi_Minh', defaultLanguage: 'vi', ownerId, subscriptionId, isActive: true }
    });
  }

  const brand1 = await upsertBrand({
    id: 'brand_publicast_global',
    name: 'PubliCast Global', ownerId: customerUser.id, subscriptionId: agencySub1.id
  });

  const brand2 = await upsertBrand({
    id: 'brand_aesthetics_tech',
    name: 'Aesthetics Tech', ownerId: customerUser.id, subscriptionId: agencySub2.id
  });

  const brand3 = await upsertBrand({
    id: 'brand_vo_thanh_nha',
    name: 'Võ Thanh Nhã Brand', ownerId: customerUser.id, subscriptionId: agencySub3.id
  });

  const testBrand = await upsertBrand({
    id: 'af40cc3e-321c-4647-9ac1-dd37967e350c',
    name: 'Trong Phuc Brand', ownerId: testUser.id, subscriptionId: proSub.id
  });

  context.brands = { brand1, brand2, brand3, testBrand };
};
