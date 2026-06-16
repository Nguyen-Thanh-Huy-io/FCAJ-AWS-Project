const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const accounts = await prisma.socialAccount.findMany({
    include: {
      brand: true
    }
  });

  console.log(`Found ${accounts.length} social accounts:`);
  accounts.forEach(acc => {
    console.log(`- ID: ${acc.id}`);
    console.log(`  Platform: ${acc.platform}`);
    console.log(`  Account ID: ${acc.platformAccountId}`);
    console.log(`  Username: ${acc.username}`);
    console.log(`  Display Name: ${acc.displayName}`);
    console.log(`  Brand ID: ${acc.brandId} (Brand Name: ${acc.brand?.name})`);
    console.log(`  Is Connected: ${acc.isConnected}`);
    console.log('---');
  });

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
