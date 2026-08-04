const fs = require('fs');
const path = require('path');

const seedDir = path.join(__dirname, 'prisma/seed');
if (!fs.existsSync(seedDir)) {
  fs.mkdirSync(seedDir, { recursive: true });
}

const resetDbJs = `const { PrismaClient } = require('@prisma/client');
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
      await prisma.$executeRawUnsafe(\`TRUNCATE TABLE \\\`\${table}\\\`;\`);
    } catch (e) {
      console.warn(\`Truncate Table \\\`\${table}\\\` failed, trying deleteMany. Error: \${e.message}\`);
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
`;
fs.writeFileSync(path.join(__dirname, 'prisma/reset-db.js'), resetDbJs);

const seedJs = `const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    await require("./seed")(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed.js'), seedJs);

const indexJs = `module.exports = async function (prisma) {
  const context = {
    planLimits: {},
    plans: {},
    users: {},
    subscriptions: {},
    brands: {},
    roles: {},
    teams: {},
    autoLists: {}
  };

  await require('./plan-limits')(prisma, context);
  await require('./products')(prisma, context);
  await require('./plans')(prisma, context);
  await require('./permissions')(prisma, context);
  await require('./users')(prisma, context);
  await require('./subscriptions')(prisma, context);
  await require('./brands')(prisma, context);
  await require('./teams')(prisma, context);
  await require('./auto-lists')(prisma, context);
  await require('./reports')(prisma, context);
  await require('./smart-links')(prisma, context);
  await require('./social-accounts')(prisma, context);
  await require('./analytics')(prisma, context);
  await require('./posts')(prisma, context);
  await require('./livestreams')(prisma, context);
  await require('./platform-limits')(prisma, context);
  await require('./notifications')(prisma, context);
  
  // demo-data can be used for extra mock data if needed
  await require('./demo-data')(prisma, context);

  console.log('Seeding completed successfully.');
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/index.js'), indexJs);

// Generate individual files

const planLimitsJs = `module.exports = async function (prisma, context) {
  console.log('Seeding PlanLimits...');
  const freeLimit = await prisma.planLimit.create({
    data: {
      maxBrands: 1, maxSocialProfiles: 2, maxPostsPerMonth: 10,
      maxLivePlatforms: 1, maxStreamQuality: 'SD', maxTeamSeats: 1,
      allowCustomRoles: false, allowApprovalWorkflow: false
    }
  });

  const starterLimit = await prisma.planLimit.create({
    data: {
      maxBrands: 3, maxSocialProfiles: 5, maxPostsPerMonth: 50,
      maxLivePlatforms: 2, maxStreamQuality: 'HD_720P', maxTeamSeats: 3,
      allowCustomRoles: true, allowApprovalWorkflow: false
    }
  });

  const proLimit = await prisma.planLimit.create({
    data: {
      maxBrands: 10, maxSocialProfiles: 20, maxPostsPerMonth: 300,
      maxLivePlatforms: 5, maxStreamQuality: 'FHD_1080P', maxTeamSeats: 10,
      allowCustomRoles: true, allowApprovalWorkflow: true
    }
  });

  const agencyLimit = await prisma.planLimit.create({
    data: {
      maxBrands: 50, maxSocialProfiles: 100, maxPostsPerMonth: 2000,
      maxLivePlatforms: 10, maxStreamQuality: 'UHD_4K', maxTeamSeats: 50,
      allowCustomRoles: true, allowApprovalWorkflow: true
    }
  });
  
  context.planLimits = { freeLimit, starterLimit, proLimit, agencyLimit };
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/plan-limits.js'), planLimitsJs);

const productsJs = `module.exports = async function (prisma, context) {
  console.log('Seeding Products...');
  await prisma.product.create({ data: { id: 'youtube_analytics', name: 'YouTube Analytics', category: 'Platforms' } });
  await prisma.product.create({ data: { id: 'facebook_management', name: 'Facebook Management', category: 'Platforms' } });
  await prisma.product.create({ data: { id: 'tiktok_creative', name: 'TikTok Creative Suite', category: 'Platforms' } });
  await prisma.product.create({ data: { id: 'instagram_insights', name: 'Instagram Insights', category: 'Platforms' } });
  await prisma.product.create({ data: { id: 'ai_content_engine', name: 'AI Content Engine', category: 'AI Tools' } });
  await prisma.product.create({ data: { id: 'ai_best_time', name: 'AI Best Time Suggest', category: 'AI Tools' } });
  await prisma.product.create({ data: { id: 'ads_manager', name: 'Ads Manager Pro', category: 'Management' } });
  await prisma.product.create({ data: { id: 'unified_inbox', name: 'Unified Inbox', category: 'Management' } });
  await prisma.product.create({ data: { id: 'custom_links', name: 'Custom Branded Links', category: 'Tools' } });
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/products.js'), productsJs);

const plansJs = `module.exports = async function (prisma, context) {
  console.log('Seeding Plans...');
  const { freeLimit, starterLimit, proLimit, agencyLimit } = context.planLimits;
  
  const freePlan = await prisma.plan.create({
    data: {
      name: 'FREE', priceAmount: 0, currency: 'USD', billingCycle: 'MONTHLY',
      description: 'Free Plan for beginners', planLimitId: freeLimit.id, isActive: true,
      products: { connect: [{ id: 'youtube_analytics' }, { id: 'facebook_management' }] }
    }
  });

  const starterPlan = await prisma.plan.create({
    data: {
      name: 'STARTER', priceAmount: 19.00, currency: 'USD', billingCycle: 'MONTHLY',
      description: 'Starter Plan for growing creators', planLimitId: starterLimit.id, isActive: true,
      products: { connect: [{ id: 'youtube_analytics' }, { id: 'facebook_management' }, { id: 'instagram_insights' }] }
    }
  });

  const proPlan = await prisma.plan.create({
    data: {
      name: 'PRO', priceAmount: 49.00, currency: 'USD', billingCycle: 'MONTHLY',
      description: 'Professional Plan for marketers', planLimitId: proLimit.id, isActive: true,
      products: { connect: [{ id: 'youtube_analytics' }, { id: 'facebook_management' }, { id: 'tiktok_creative' }, { id: 'instagram_insights' }, { id: 'ai_content_engine' }, { id: 'ai_best_time' }, { id: 'unified_inbox' }, { id: 'custom_links' }] }
    }
  });

  const agencyPlan = await prisma.plan.create({
    data: {
      name: 'AGENCY', priceAmount: 199.00, currency: 'USD', billingCycle: 'MONTHLY',
      description: 'Agency Plan for large teams', planLimitId: agencyLimit.id, isActive: true,
      products: { connect: [{ id: 'youtube_analytics' }, { id: 'facebook_management' }, { id: 'tiktok_creative' }, { id: 'instagram_insights' }, { id: 'ai_content_engine' }, { id: 'ai_best_time' }, { id: 'ads_manager' }, { id: 'unified_inbox' }, { id: 'custom_links' }] }
    }
  });
  
  context.plans = { freePlan, starterPlan, proPlan, agencyPlan };
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/plans.js'), plansJs);

const permissionsJs = `module.exports = async function (prisma, context) {
  console.log('Seeding SystemPermissions...');
  const permissionsData = [
    { key: 'CREATE_POSTS', label: 'Tạo bài viết', description: 'Cho phép tạo bài viết mới', category: 'posts' },
    { key: 'PUBLISH_POSTS', label: 'Đăng bài viết', description: 'Cho phép đăng trực tiếp bài viết lên mạng xã hội', category: 'posts' },
    { key: 'APPROVE_POSTS', label: 'Phê duyệt bài viết', description: 'Cho phép duyệt hoặc từ chối bài viết', category: 'posts' },
    { key: 'DELETE_POSTS', label: 'Xóa bài viết', description: 'Cho phép xóa bài viết', category: 'posts' },
    { key: 'MANAGE_ROLES', label: 'Quản lý vai trò', description: 'Cho phép tạo, sửa, xóa vai trò tùy chỉnh', category: 'management' },
    { key: 'INVITE_MEMBERS', label: 'Mời thành viên', description: 'Cho phép mời thành viên mới vào thương hiệu', category: 'management' }
  ];

  for (const perm of permissionsData) {
    await prisma.systemPermission.create({ data: perm });
  }
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/permissions.js'), permissionsJs);

const usersJs = `const bcrypt = require('bcryptjs');

module.exports = async function (prisma, context) {
  console.log('Seeding Users...');
  const customerPasswordHash = bcrypt.hashSync('nhacc123@', 10);
  const testUserPasswordHash = bcrypt.hashSync('123456aA@', 10);

  const customerUser = await prisma.user.create({
    data: {
      email: 'vothanhnha26@gmail.com', passwordHash: customerPasswordHash, name: 'Võ Thành Nhã',
      role: 'OWNER', isActive: true, isEmailVerified: true,
      settings: { create: { language: 'vi', timezone: 'Asia/Ho_Chi_Minh' } },
      accounts: { create: [{ provider: 'LOCAL', passwordHash: customerPasswordHash }] }
    }
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@publicast.com', passwordHash: customerPasswordHash, name: 'Hệ Thống Admin',
      role: 'ADMIN', isActive: true, isEmailVerified: true,
      settings: { create: { language: 'vi', timezone: 'Asia/Ho_Chi_Minh' } },
      accounts: { create: [{ provider: 'LOCAL', passwordHash: customerPasswordHash }] }
    }
  });

  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@publicast.com', passwordHash: customerPasswordHash, name: 'Nhân Viên Hỗ Trợ',
      role: 'STAFF', isActive: true, isEmailVerified: true,
      settings: { create: { language: 'vi', timezone: 'Asia/Ho_Chi_Minh' } },
      accounts: { create: [{ provider: 'LOCAL', passwordHash: customerPasswordHash }] }
    }
  });

  const testUser = await prisma.user.create({
    data: {
      id: 'e673a8b3-5edf-4366-b1e1-4400c06eb5dd', email: 'trongphuc91thcsduclap@gmail.com',
      passwordHash: testUserPasswordHash, name: 'Nguyễn Trọng Phúc', role: 'OWNER',
      isActive: true, isEmailVerified: true,
      settings: { create: { language: 'vi', timezone: 'Asia/Ho_Chi_Minh' } },
      accounts: { create: [{ provider: 'LOCAL', passwordHash: testUserPasswordHash }] }
    }
  });

  const specialistUser = await prisma.user.create({
    data: {
      email: 'specialist@publicast.com', passwordHash: customerPasswordHash, name: 'Nguyễn Văn Chuyên (Specialist)',
      role: 'USER', isActive: true, isEmailVerified: true,
      settings: { create: { language: 'vi', timezone: 'Asia/Ho_Chi_Minh' } }
    }
  });

  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@publicast.com', passwordHash: customerPasswordHash, name: 'Lê Thị Quản Lý (Manager)',
      role: 'MANAGER', isActive: true, isEmailVerified: true,
      settings: { create: { language: 'vi', timezone: 'Asia/Ho_Chi_Minh' } }
    }
  });
  
  context.users = { customerUser, adminUser, staffUser, testUser, specialistUser, managerUser };
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/users.js'), usersJs);

const subscriptionsJs = `module.exports = async function (prisma, context) {
  console.log('Seeding Subscriptions...');
  const { agencyPlan, proPlan } = context.plans;

  const agencySub1 = await prisma.subscription.create({
    data: { planId: agencyPlan.id, status: 'ACTIVE', currentPeriodStart: new Date(), currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
  });

  const agencySub2 = await prisma.subscription.create({
    data: { planId: agencyPlan.id, status: 'ACTIVE', currentPeriodStart: new Date(), currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
  });

  const agencySub3 = await prisma.subscription.create({
    data: { planId: agencyPlan.id, status: 'ACTIVE', currentPeriodStart: new Date(), currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
  });

  const proSub = await prisma.subscription.create({
    data: { planId: proPlan.id, status: 'ACTIVE', currentPeriodStart: new Date(), currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
  });
  
  context.subscriptions = { agencySub1, agencySub2, agencySub3, proSub };
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/subscriptions.js'), subscriptionsJs);

const brandsJs = `module.exports = async function (prisma, context) {
  console.log('Seeding Brands...');
  const { customerUser, testUser } = context.users;
  const { agencySub1, agencySub2, agencySub3, proSub } = context.subscriptions;

  const brand1 = await prisma.brand.create({
    data: { name: 'PubliCast Global', timezone: 'Asia/Ho_Chi_Minh', defaultLanguage: 'vi', ownerId: customerUser.id, subscriptionId: agencySub1.id, isActive: true }
  });

  const brand2 = await prisma.brand.create({
    data: { name: 'Aesthetics Tech', timezone: 'Asia/Ho_Chi_Minh', defaultLanguage: 'vi', ownerId: customerUser.id, subscriptionId: agencySub2.id, isActive: true }
  });

  const brand3 = await prisma.brand.create({
    data: { name: 'Võ Thanh Nhã Brand', timezone: 'Asia/Ho_Chi_Minh', defaultLanguage: 'vi', ownerId: customerUser.id, subscriptionId: agencySub3.id, isActive: true }
  });

  const testBrand = await prisma.brand.create({
    data: { id: 'af40cc3e-321c-4647-9ac1-dd37967e350c', name: 'Trong Phuc Brand', timezone: 'Asia/Ho_Chi_Minh', defaultLanguage: 'vi', ownerId: testUser.id, subscriptionId: proSub.id, isActive: true }
  });
  
  context.brands = { brand1, brand2, brand3, testBrand };
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/brands.js'), brandsJs);

const teamsJs = `module.exports = async function (prisma, context) {
  console.log('Seeding Teams and Roles...');
  const { customerUser, specialistUser, managerUser, testUser } = context.users;
  const { brand1, testBrand } = context.brands;

  const specialistRole = await prisma.customRole.create({
    data: {
      brandId: brand1.id, name: 'Social Media Specialist', description: 'Chuyên viên biên soạn và tối ưu bài viết mạng xã hội', colorHex: '#3B82F6',
      permissions: {
        create: [
          { permissionKey: 'CREATE_POSTS', isAllowed: true },
          { permissionKey: 'PUBLISH_POSTS', isAllowed: false },
          { permissionKey: 'APPROVE_POSTS', isAllowed: false },
          { permissionKey: 'DELETE_POSTS', isAllowed: true }
        ]
      }
    }
  });

  const managerRole = await prisma.customRole.create({
    data: {
      brandId: brand1.id, name: 'Content Manager', description: 'Quản lý duyệt bài viết', colorHex: '#8B5CF6',
      permissions: {
        create: [
          { permissionKey: 'CREATE_POSTS', isAllowed: true },
          { permissionKey: 'PUBLISH_POSTS', isAllowed: true },
          { permissionKey: 'APPROVE_POSTS', isAllowed: true },
          { permissionKey: 'DELETE_POSTS', isAllowed: true }
        ]
      }
    }
  });

  await prisma.team.create({
    data: { brandId: brand1.id, userId: customerUser.id, role: 'OWNER', invitedByUserId: customerUser.id, status: 'ACTIVE', acceptedAt: new Date() }
  });

  await prisma.team.create({
    data: { brandId: brand1.id, userId: specialistUser.id, role: 'USER', customRoleId: specialistRole.id, invitedByUserId: customerUser.id, status: 'ACTIVE', acceptedAt: new Date() }
  });

  await prisma.team.create({
    data: { brandId: brand1.id, userId: managerUser.id, role: 'MANAGER', customRoleId: managerRole.id, invitedByUserId: customerUser.id, status: 'ACTIVE', acceptedAt: new Date() }
  });

  // Test User team
  await prisma.team.create({
    data: { brandId: testBrand.id, userId: testUser.id, role: 'OWNER', invitedByUserId: testUser.id, status: 'ACTIVE', acceptedAt: new Date() }
  });
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/teams.js'), teamsJs);

const autoListsJs = `module.exports = async function (prisma, context) {
  console.log('Seeding AutoLists...');
  const { brand1, testBrand } = context.brands;

  await prisma.autoList.create({
    data: {
      brandId: brand1.id, name: 'Danh sách bài đăng tuyển dụng', sourceType: 'MANUAL', targetPlatforms: 'LINKEDIN,FACEBOOK', scheduleType: 'INTERVAL', intervalMinutes: 120, activeDays: 'MON,WED,FRI', isActive: true, loopEnabled: true
    }
  });

  await prisma.autoList.create({
    data: {
      brandId: brand1.id, name: 'RSS News Feed', sourceType: 'RSS_FEED', rssUrl: 'https://vnexpress.net/rss/tin-moi-nhat.rss', targetPlatforms: 'FACEBOOK,TELEGRAM', scheduleType: 'SPECIFIC_TIMES', specificTimes: '09:00,15:00,21:00', activeDays: 'MON,TUE,WED,THU,FRI,SAT,SUN', isActive: true
    }
  });

  const testAutoList = await prisma.autoList.create({
    data: {
      brandId: testBrand.id, name: 'Hàng đợi bài viết kỹ thuật công nghệ', sourceType: 'MANUAL', targetPlatforms: 'FACEBOOK,LINKEDIN', scheduleType: 'INTERVAL', intervalMinutes: 180, activeDays: 'MON,TUE,WED,THU,FRI', isActive: true, loopEnabled: false
    }
  });
  
  context.autoLists = { testAutoList };
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/auto-lists.js'), autoListsJs);

const reportsJs = `module.exports = async function (prisma, context) {
  console.log('Seeding Reports...');
  const { customerUser, testUser } = context.users;
  const { brand1, testBrand } = context.brands;

  await prisma.report.create({
    data: {
      brandId: brand1.id, createdByUserId: customerUser.id, title: 'Báo cáo hiệu quả Social Media Q2', description: 'Đánh giá chỉ số tương tác và phát triển thương hiệu trên các kênh Social.', dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), dateTo: new Date(), includedPlatforms: 'FACEBOOK,INSTAGRAM,YOUTUBE', includedSections: 'OVERVIEW,AUDIENCE,POSTS', format: 'PDF', isWhiteLabel: true, brandColorHex: '#4F46E5', createdAt: new Date()
    }
  });

  await prisma.report.create({
    data: {
      brandId: testBrand.id, createdByUserId: testUser.id, title: 'Báo cáo tuần - Trong Phuc Brand', description: 'Thống kê tương tác định kỳ mỗi tuần.', dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), dateTo: new Date(), includedPlatforms: 'FACEBOOK', includedSections: 'OVERVIEW,POSTS', format: 'PDF', createdAt: new Date()
    }
  });
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/reports.js'), reportsJs);

const smartLinksJs = `module.exports = async function (prisma, context) {
  console.log('Seeding SmartLinks...');
  const { brand1, testBrand } = context.brands;

  const smartLinkBrand1 = await prisma.smartLink.create({
    data: {
      brandId: brand1.id, slug: 'publicast-links', pageTitle: 'PubliCast Global - SmartLinks', bio: 'Nền tảng lên kế hoạch và tối ưu hóa nội dung đa kênh tiện lợi.', profileImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80', backgroundType: 'THEME', backgroundValue: 'midnight', buttonStyle: 'rounded', socialLinks: 'instagram=https://instagram.com;youtube=https://youtube.com', isPublished: true,
      links: {
        create: [
          { title: 'Trải nghiệm ứng dụng miễn phí', url: 'https://publicast.com/free-trial', emoji: '🚀', position: 0, isActive: true, clicks: 250 },
          { title: 'Tài liệu hướng dẫn sử dụng', url: 'https://docs.publicast.com', emoji: '📚', position: 1, isActive: true, clicks: 120 }
        ]
      }
    },
    include: { links: true }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const metricsDays = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - index));
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const factor = isWeekend ? 0.5 : 1.0;
    const visits = Math.max(10, Math.round((50 + Math.sin(index / 5) * 20 + Math.random() * 10) * factor));
    return { date, visits, unique: Math.max(5, Math.round(visits * 0.8)) };
  });

  await prisma.smartLinkDailyMetric.createMany({
    data: metricsDays.map(day => ({
      smartLinkId: smartLinkBrand1.id, date: day.date, pageViews: day.visits, uniqueVisitors: day.unique
    }))
  });

  await prisma.smartLink.create({
    data: {
      brandId: testBrand.id, slug: 'trongphuc-tech', pageTitle: 'Nguyễn Trọng Phúc - Tech Bio', bio: 'Nơi chia sẻ các bài viết kỹ thuật phần mềm và kiến thức thiết kế hệ thống.', backgroundType: 'THEME', backgroundValue: 'mint', buttonStyle: 'classic', isPublished: true,
      links: {
        create: [{ title: 'Đọc blog cá nhân', url: 'https://trongphuc.dev', emoji: '💻', position: 0, isActive: true, clicks: 142 }]
      }
    }
  });
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/smart-links.js'), smartLinksJs);

const socialAccountsJs = `module.exports = async function (prisma, context) {
  console.log('Seeding SocialAccounts...');
  const { brand1, testBrand } = context.brands;

  const socialFB = await prisma.socialAccount.create({
    data: { brandId: brand1.id, platform: 'FACEBOOK', platformAccountId: 'fb_page_123', username: 'publicast.global', displayName: 'PubliCast Global Fanpage', accessToken: 'fb_mock_token', scopes: 'pages_read_engagement,pages_manage_posts', isConnected: true, connectedAt: new Date() }
  });
  await prisma.facebookPage.create({ data: { socialAccountId: socialFB.id, pageId: 'fb_page_123', category: 'Software Company', likesCount: 5200, followersCount: 5600, about: 'Trang thông tin chính thức của PubliCast Global' } });

  const socialYT = await prisma.socialAccount.create({
    data: { brandId: brand1.id, platform: 'YOUTUBE', platformAccountId: 'yt_channel_456', username: '@publicast_global', displayName: 'PubliCast Global YT', accessToken: 'yt_mock_token', scopes: 'youtube.readonly,youtube.upload', isConnected: true, connectedAt: new Date() }
  });
  await prisma.youTubeChannel.create({ data: { socialAccountId: socialYT.id, channelId: 'yt_channel_456', subscribersCount: 12000, totalVideosCount: 84, totalViewsCount: 450000 } });

  const testSocialFB = await prisma.socialAccount.create({
    data: { brandId: testBrand.id, platform: 'FACEBOOK', platformAccountId: 'fb_page_test', username: 'trongphuc.test', displayName: 'Trong Phuc Tech Fanpage', accessToken: 'fb_mock_token_test', scopes: 'pages_read_engagement,pages_manage_posts', isConnected: true, connectedAt: new Date() }
  });
  await prisma.facebookPage.create({ data: { socialAccountId: testSocialFB.id, pageId: 'fb_page_test', likesCount: 1500, followersCount: 1650, about: 'Trang kiểm thử công nghệ của Nguyễn Trọng Phúc' } });
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/social-accounts.js'), socialAccountsJs);

const analyticsJs = `module.exports = async function (prisma, context) {
  console.log('Seeding Analytics & Ads...');
  const { brand1 } = context.brands;

  const adAcc = await prisma.adAccount.create({
    data: { brandId: brand1.id, platform: 'META_ADS', platformAccountId: 'act_vothanhnha_ad', accountName: 'Meta Ads - Võ Thành Nhã Pro', currency: 'VND', timezone: 'Asia/Ho_Chi_Minh', accessToken: 'mock_ad_token', isActive: true }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const spend = 150000 + Math.round(Math.sin(i) * 50000 + Math.random() * 20000);
    const clicks = Math.round(spend / 1500);
    const conversions = Math.round(clicks * 0.05);

    await prisma.analytics.create({
      data: {
        brandId: brand1.id, adAccountId: adAcc.id, dateFrom: d, dateTo: d, granularity: 'DAY', fetchedAt: new Date(), analyticsType: 'AD',
        adAnalytics: {
          create: {
            campaignId: 'camp_brand1_lead', campaignName: 'Lead Generation - VietNam', totalSpend: spend, impressions: clicks * 50, clicks: clicks, ctr: 2.0, cpc: 1500, cpm: 75000, conversions: conversions, conversionValue: conversions * 50000, cpa: conversions > 0 ? spend / conversions : 0, roas: conversions > 0 ? (conversions * 50000) / spend : 0, reach: clicks * 40, frequency: 1.1
          }
        }
      }
    });
  }
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/analytics.js'), analyticsJs);

const postsJs = `module.exports = async function (prisma, context) {
  console.log('Seeding Posts...');
  const { testUser, customerUser } = context.users;
  const { testBrand, brand1 } = context.brands;
  const { testAutoList } = context.autoLists;

  await prisma.post.create({ data: { brandId: testBrand.id, createdByUserId: testUser.id, title: 'Bài viết ra mắt sản phẩm mới - Bản nháp', caption: 'Chúng tôi sắp sửa ra mắt giải pháp AI tự động hóa lịch đăng bài đa kênh. Cùng chờ đón nhé!', type: 'IMAGE', status: 'DRAFT', targetPlatforms: 'FACEBOOK,INSTAGRAM', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) } });
  await prisma.post.create({ data: { brandId: testBrand.id, createdByUserId: testUser.id, title: 'Thông báo tuyển dụng vị trí Developer', caption: 'PubliCast đang tuyển dụng lập trình viên NodeJS / ReactJS có kinh nghiệm. Môi trường làm việc năng động, phúc lợi cao!', type: 'TEXT', status: 'SCHEDULED', targetPlatforms: 'LINKEDIN', scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) } });
  await prisma.post.create({ data: { brandId: testBrand.id, createdByUserId: testUser.id, title: 'Chia sẻ kiến thức Marketing đa kênh', caption: 'Làm thế nào để phân phối nội dung đồng thời lên Facebook, TikTok và YouTube Shorts mà vẫn giữ chân người dùng? Đọc bài viết sau đây.', type: 'LINK', status: 'PUBLISHED', targetPlatforms: 'FACEBOOK', publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), platformPostId: 'fb_post_999123', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) } });
  await prisma.post.create({ data: { brandId: testBrand.id, createdByUserId: testUser.id, title: 'Video Demo tính năng AI Content Generator', caption: 'Cùng xem sức mạnh của AI trong việc tự động sáng tạo nội dung bài viết và đề xuất hashtag cực thông minh.', type: 'VIDEO', status: 'FAILED', targetPlatforms: 'YOUTUBE', failureReason: 'OAuth Token Expired. Please reconnect your account.', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) } });
  
  if(testAutoList) {
    await prisma.post.create({ data: { brandId: testBrand.id, createdByUserId: testUser.id, title: 'Kỹ thuật tối ưu database MySQL cho ứng dụng lớn', caption: 'Tìm hiểu cách index, tối ưu truy vấn để database luôn hoạt động ổn định.', type: 'TEXT', status: 'SCHEDULED', targetPlatforms: 'LINKEDIN', autoListId: testAutoList.id, createdAt: new Date() } });
  }

  // Templates (Library)
  await prisma.post.create({ data: { brandId: brand1.id, createdByUserId: customerUser.id, title: 'Mẫu thông báo chương trình khuyến mãi cuối tuần', caption: '🔥 KHUYẾN MÃI CỰC KHỦNG CUỐI TUẦN 🔥\\n\\nNhận ngay ưu đãi giảm giá lên đến 50% cho toàn bộ sản phẩm trên hệ thống. Số lượng có hạn, nhanh tay săn ngay!\\n\\n👉 Chi tiết xem tại: https://publicast.com/promo\\n\\n#KhuyenMai #CuoiTuan #PubliCast', type: 'IMAGE', status: 'DRAFT', targetPlatforms: 'FACEBOOK,LINKEDIN', isLibrary: true, mediaUrls: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop&q=60', mediaThumbnailUrls: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop&q=60', createdAt: new Date() } });
  await prisma.post.create({ data: { brandId: brand1.id, createdByUserId: customerUser.id, title: 'Mẫu video giới thiệu tính năng sản phẩm mới', caption: '🚀 GIỚI THIỆU TÍNH NĂNG MỚI: AI CONTENT GENERATOR 🚀\\n\\nBạn đã bao giờ tốn hàng giờ để viết caption và tìm hashtag? Hãy xem video này để biết cách AI giúp bạn tự động hóa việc đó trong 30 giây!\\n\\n#AI #ProductUpdate #Marketing #PubliCast', type: 'VIDEO', status: 'DRAFT', targetPlatforms: 'YOUTUBE,TIKTOK', isLibrary: true, mediaUrls: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60', mediaThumbnailUrls: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60', metadata: JSON.stringify({ youtubeType: 'video', youtubeTitle: 'GIỚI THIỆU TÍNH NĂNG MỚI: AI CONTENT GENERATOR', privacyStatus: 'public', categoryId: '28', madeForKids: false, youtubeThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60', tags: 'AI, ProductUpdate, Marketing, PubliCast', firstComment: 'Hãy đăng ký dùng thử miễn phí tại publicast.com nhé!' }), createdAt: new Date() } });
  await prisma.post.create({ data: { brandId: testBrand.id, createdByUserId: testUser.id, title: 'Mẫu Daily Tech Tips chia sẻ kiến thức', caption: '💡 DAILY TECH TIPS 💡\\n\\nCách tối ưu hóa MySQL database cực đơn giản mà bạn nên biết để tăng tốc hiệu năng ứng dụng lên gấp 2 lần.\\n\\n#MySQL #Database #Developer #Tips', type: 'IMAGE', status: 'DRAFT', targetPlatforms: 'LINKEDIN', isLibrary: true, mediaUrls: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60', mediaThumbnailUrls: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60', createdAt: new Date() } });
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/posts.js'), postsJs);

const livestreamsJs = `module.exports = async function (prisma, context) {
  console.log('Seeding Livestreams...');
  const { testUser } = context.users;
  const { testBrand } = context.brands;

  await prisma.livestream.create({
    data: {
      brandId: testBrand.id, createdByUserId: testUser.id, title: 'Livestream hỏi đáp giải pháp PubliCast', description: 'Buổi giao lưu trực tiếp giải đáp mọi thắc mắc của người dùng về việc tự động hóa kế hoạch bài đăng.', scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), durationMinutes: 60, status: 'SCHEDULED', streamKey: 'live_test_key_123', rtmpUrl: 'rtmp://live.publicast.com/app', targetPlatforms: 'YOUTUBE,FACEBOOK', streamQuality: 'HD_720P'
    }
  });
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/livestreams.js'), livestreamsJs);

const platformLimitsJs = `module.exports = async function (prisma, context) {
  console.log('Seeding PlatformLimits...');
  const platformLimits = [
    { platform: 'YOUTUBE', subType: 'VIDEO', maxCaptionLength: 5000, maxFileSizeMb: 1024, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov', minVideoDuration: null, maxVideoDuration: null, aspectRatios: '16:9' },
    { platform: 'YOUTUBE', subType: 'SHORTS', maxCaptionLength: 100, maxFileSizeMb: 100, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov', minVideoDuration: 1, maxVideoDuration: 60, aspectRatios: '9:16' },
    { platform: 'FACEBOOK', subType: 'POST', maxCaptionLength: 63206, maxFileSizeMb: 100, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: null, maxVideoDuration: null, aspectRatios: null },
    { platform: 'FACEBOOK', subType: 'REEL', maxCaptionLength: 2000, maxFileSizeMb: 100, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov', minVideoDuration: 3, maxVideoDuration: 90, aspectRatios: '9:16' },
    { platform: 'FACEBOOK', subType: 'STORY', maxCaptionLength: 2200, maxFileSizeMb: 50, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: 1, maxVideoDuration: 15, aspectRatios: '9:16' },
    { platform: 'TIKTOK', subType: 'VIDEO', maxCaptionLength: 2200, maxFileSizeMb: 100, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov,webm', minVideoDuration: 3, maxVideoDuration: 600, aspectRatios: '9:16' },
    { platform: 'INSTAGRAM', subType: 'POST', maxCaptionLength: 2200, maxFileSizeMb: 100, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: 3, maxVideoDuration: 60, aspectRatios: '1:1,4:5' },
    { platform: 'INSTAGRAM', subType: 'REEL', maxCaptionLength: 2200, maxFileSizeMb: 100, allowedMediaTypes: 'VIDEO', allowedFormats: 'mp4,mov', minVideoDuration: 3, maxVideoDuration: 90, aspectRatios: '9:16' },
    { platform: 'INSTAGRAM', subType: 'STORY', maxCaptionLength: 2200, maxFileSizeMb: 50, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: 1, maxVideoDuration: 15, aspectRatios: '9:16' },
    { platform: 'LINKEDIN', subType: 'POST', maxCaptionLength: 3000, maxFileSizeMb: 100, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: 3, maxVideoDuration: 600, aspectRatios: null },
    { platform: 'DISCORD', subType: 'POST', maxCaptionLength: 2000, maxFileSizeMb: 25, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: null, maxVideoDuration: null, aspectRatios: null },
    { platform: 'TELEGRAM', subType: 'POST', maxCaptionLength: 1024, maxFileSizeMb: 50, allowedMediaTypes: 'ALL', allowedFormats: 'mp4,mov,png,jpg,jpeg', minVideoDuration: null, maxVideoDuration: null, aspectRatios: null }
  ];

  for (const limit of platformLimits) {
    await prisma.platformLimit.upsert({
      where: { platform_subType: { platform: limit.platform, subType: limit.subType } },
      update: limit, create: limit
    });
  }
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/platform-limits.js'), platformLimitsJs);

const notificationsJs = `module.exports = async function (prisma, context) {
  console.log('Seeding Notifications...');
  const { testUser } = context.users;
  const { testBrand } = context.brands;

  for (let i = 0; i < 10; i++) {
    const category = ['stream', 'content', 'team', 'platform', 'system'][i % 5];
    const isGlobal = i === 9;
    const daysAgo = Math.floor(i / 2);
    const createdNotification = await prisma.systemNotification.create({
      data: {
        title: \`Thông báo thử nghiệm #\${i + 1} (\${category})\`, message: \`Nội dung chi tiết của thông báo thử nghiệm hệ thống #\${i + 1}.\`, type: category,
        brandId: isGlobal ? null : testBrand.id, userId: isGlobal ? null : testUser.id, isGlobal,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * daysAgo)
      }
    });

    if (i % 2 === 0) {
      await prisma.notificationReadReceipt.create({
        data: { notificationId: createdNotification.id, userId: testUser.id, readAt: new Date() }
      });
    }
  }
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/notifications.js'), notificationsJs);

const demoDataJs = `module.exports = async function (prisma, context) {
  // Empty as all mock data is seeded in their respective files.
};
`;
fs.writeFileSync(path.join(__dirname, 'prisma/seed/demo-data.js'), demoDataJs);

console.log("All seed files generated successfully.");
