const socialAccountRepository = require('../src/repositories/social/social-account.repository');
const facebookGateway = require('../src/services/social/facebook/facebook.gateway');

async function main() {
  const accounts = await socialAccountRepository.findByBrandAndPlatform('665783e4-f300-4fdd-892f-96e60176358e', 'FACEBOOK');
  if (accounts.length === 0) {
    console.error('No Facebook account found');
    process.exit(1);
  }

  const account = accounts[0];
  const pageId = account.platformAccountId;
  const pageAccessToken = account.accessToken;

  console.log(`Page: ${account.displayName}`);
  
  const since = '2026-05-14';
  const until = '2026-06-13';

  try {
    const insights = await facebookGateway.getPageInsights(pageId, pageAccessToken, since, until);
    console.log('\n--- INSIGHTS RAW DATA ---');
    insights.forEach(item => {
      console.log(`\nMetric Name: ${item.name} (${item.title})`);
      let total = 0;
      item.values.forEach(v => {
        if (v.value > 0) {
          console.log(`  Date (adjusted): ${new Date(new Date(v.end_time).getTime() - 24*60*60*1000).toISOString().split('T')[0]} -> Value: ${v.value}`);
          total += v.value;
        }
      });
      console.log(`Total for ${item.name}: ${total}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
