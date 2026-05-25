const facebookService = require('./src/services/social/facebook');

async function main() {
  console.log('--- Triggering Sync for Facebook Account ---');
  const accountId = '806a2a82-5a45-4b0d-8683-97d8fe1113f7';
  
  try {
    const result = await facebookService.syncChannelMetrics(accountId);
    console.log('Sync succeeded! Result:', result);
  } catch (error) {
    console.error('Sync failed with error:');
    console.error(error);
  }
  
  process.exit(0);
}

main();
