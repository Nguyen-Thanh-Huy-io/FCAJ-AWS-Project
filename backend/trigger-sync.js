const facebookService = require('./src/services/social/facebook');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Triggering Sync for Facebook Account ---');
  const accounts = await prisma.socialAccount.findMany({
    where: { platform: 'FACEBOOK' }
  });
  
  for (const account of accounts) {
    try {
      console.log(`Syncing for Facebook account: ${account.displayName} (${account.id})`);
      const result = await facebookService.syncChannelMetrics(account.id);
      console.log('Sync succeeded! Result:', result);
    } catch (error) {
      console.error(`Sync failed for ${account.id} with error:`, error);
    }
  }
  
  process.exit(0);
}

main();
