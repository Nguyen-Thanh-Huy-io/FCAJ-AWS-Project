const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const accounts = await prisma.socialAccount.findMany({
    include: {
      brand: true
    }
  });
  console.log('ALL SOCIAL ACCOUNTS IN DB:', accounts.map(a => ({
    id: a.id,
    platform: a.platform,
    username: a.username,
    brandId: a.brandId,
    brandName: a.brand?.name
  })));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
