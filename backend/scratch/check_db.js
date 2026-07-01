const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const brandId = '0d516a80-0844-4091-80c0-0db8cafbc767';
  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
    include: {
      socialAccounts: true
    }
  });
  if (!brand) {
    console.log("Brand not found");
    process.exit(0);
  }
  console.log("Brand Name:", brand.name);
  console.log("Social Accounts connected:");
  brand.socialAccounts.forEach(acc => {
    console.log(`- Platform: ${acc.platform}, Username: ${acc.username}, isConnected: ${acc.isConnected}`);
  });
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
