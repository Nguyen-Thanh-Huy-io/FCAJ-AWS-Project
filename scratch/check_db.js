const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const brandId = '0d516a80-0844-4091-80c0-0db8cafbc767';
  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
    include: {
      subscription: {
        include: {
          plan: {
            include: {
              products: true
            }
          }
        }
      }
    }
  });
  if (!brand) {
    console.log("Brand not found");
    process.exit(0);
  }
  console.log("Brand Name:", brand.name);
  console.log("Subscription status:", brand.subscription?.status);
  console.log("Plan Name:", brand.subscription?.plan?.name);
  console.log("Plan Products:", brand.subscription?.plan?.products);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
