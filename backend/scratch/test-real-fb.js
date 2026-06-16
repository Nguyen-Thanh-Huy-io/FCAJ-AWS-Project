const socialAccountRepository = require('../src/repositories/social/social-account.repository');
const facebookGateway = require('../src/services/social/facebook/facebook.gateway');

async function main() {
  const accounts = await socialAccountRepository.findByBrandAndPlatform('665783e4-f300-4fdd-892f-96e60176358e', 'FACEBOOK');
  if (accounts.length === 0) {
    console.error('No Facebook account found for brand 665783e4-f300-4fdd-892f-96e60176358e');
    process.exit(1);
  }

  const account = accounts[0];
  const pageId = account.platformAccountId;
  const pageAccessToken = account.accessToken;

  console.log(`Found account: ${account.displayName} (Page ID: ${pageId})`);
  console.log(`Decrypted Token starts with: ${pageAccessToken.substring(0, 10)}...`);

  const since = '2026-05-01';
  const until = '2026-06-13';

  console.log(`Querying Facebook Insights from ${since} to ${until}...`);
  try {
    const insights = await facebookGateway.getPageInsights(pageId, pageAccessToken, since, until);
    console.log('Insights fetched successfully. Count:', insights.length);
    console.log('Insights preview:', JSON.stringify(insights, null, 2));

    const feed = await facebookGateway.getPageFeed(pageId, pageAccessToken, 5);
    console.log('Feed fetched successfully. Count:', feed.length);
    console.log('Feed preview:', JSON.stringify(feed, null, 2));
  } catch (error) {
    console.error('Error fetching Facebook data:', error);
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
