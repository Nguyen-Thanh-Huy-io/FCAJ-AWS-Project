const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // Tắt kiểm tra khóa ngoại để truncate toàn bộ các bảng sạch sẽ
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');

  const tables = [
    'audit_logs', 'custom_role_permissions', 'custom_roles', 'teams',
    'ad_analytics', 'social_analytics', 'analytics', 'ad_accounts',
    'discord_guild_snapshots', 'tracked_videos', 'youtube_channels',
    'instagram_accounts', 'facebook_pages', 'tiktok_accounts',
    'linkedin_accounts', 'telegram_accounts', 'discord_accounts',
    'social_accounts', 'pending_payments', 'subscription_addons',
    'addons', 'invoices', 'ticket_messages', 'support_tickets',
    'inbox_items', 'unified_inboxes', 'facebook_story_metrics',
    'facebook_post_metrics', 'facebook_overview_metrics',
    'competitor_analysis', 'link_item_daily_metrics',
    'smart_link_daily_metrics', 'link_items', 'smart_links',
    'hashtag_sets', 'hashtag_trackers', 'ai_assistants',
    'media_library', 'media_folders', 'approval_workflows',
    'workflow_reviewers', 'posts', 'livestreams',
    'content_calendars', 'best_time_slots', 'auto_lists',
    'brands', 'subscriptions', 'user_settings', 'user_accounts',
    'users', 'plans', 'products', 'plan_limits',
    'system_permissions', 'platform_limits', 'system_notifications',
    'notification_read_receipts'
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE \`${table}\`;`);
    } catch (e) {
      console.warn(`Truncate Table \`${table}\` failed, trying deleteMany. Error: ${e.message}`);
    }
  }

  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
  console.log('Database cleared.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
