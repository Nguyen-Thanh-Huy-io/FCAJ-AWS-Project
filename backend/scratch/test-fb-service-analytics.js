const socialAccountRepository = require('../src/repositories/social/social-account.repository');
const facebookAnalytics = require('../src/services/social/facebook/facebook-analytics.service');

async function main() {
  const accounts = await socialAccountRepository.findByBrandAndPlatform('665783e4-f300-4fdd-892f-96e60176358e', 'FACEBOOK');
  if (accounts.length === 0) {
    console.error('No Facebook account found');
    process.exit(1);
  }

  const account = accounts[0];
  const pageId = account.platformAccountId;
  const pageAccessToken = account.accessToken;
  const followersCount = account.facebookPage?.followersCount || 0;

  console.log(`Testing getAnalyticsReport for page: ${account.displayName}`);
  const startDate = '2026-05-14';
  const endDate = '2026-06-13';

  try {
    const report = await facebookAnalytics.getAnalyticsReport(pageId, pageAccessToken, startDate, endDate, followersCount);
    console.log('Report generated successfully!');
    console.log('Summary:', JSON.stringify(report.summary, null, 2));
    console.log('Interactions:', JSON.stringify(report.interactions, null, 2));
    console.log('First growth item:', JSON.stringify(report.growth[0], null, 2));
    console.log('Total growth items:', report.growth.length);
  } catch (error) {
    console.error('Error generating report:', error);
  }

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
