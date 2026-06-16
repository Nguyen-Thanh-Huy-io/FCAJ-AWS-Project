const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Finding user and brand...');
  const user = await prisma.user.findUnique({
    where: { email: 'vothanhnha26@gmail.com' }
  });
  if (!user) {
    throw new Error('User vothanhnha26@gmail.com not found.');
  }

  const brand = await prisma.brand.findFirst({
    where: { ownerId: user.id }
  });
  if (!brand) {
    throw new Error('Brand not found for user.');
  }

  // 1. Clear existing library, deleted, and autolists data
  console.log('Clearing old library posts, deleted posts, and autolists...');
  await prisma.post.deleteMany({
    where: {
      brandId: brand.id,
      OR: [
        { isLibrary: true },
        { isDeleted: true },
        { NOT: { autoListId: null } }
      ]
    }
  });

  await prisma.autoList.deleteMany({
    where: { brandId: brand.id }
  });

  const sampleImages = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=60'
  ];

  // 2. Seed Posts Library
  console.log('Seeding Posts Library...');
  const libraryPosts = [
    { title: 'Tip: Color Palettes in UI Design', caption: 'Here are 5 perfect color palettes for SaaS landing pages in 2026. Keep it clean and high-contrast! 🎨', type: 'IMAGE' },
    { title: 'How to setup Tailwind v4 in Vite', caption: 'Follow this 3-step guide to integrate the new Tailwind CSS v4 in your Vite project. Super fast build times! 🚀', type: 'CAROUSEL' },
    { title: 'Cross-posting strategy workflow', caption: 'Learn how to publish one video to TikTok, Reels and YouTube Shorts simultaneously without watermarks.', type: 'VIDEO' },
    { title: 'Clean Architecture in Node.js', caption: 'Decoupling your framework from your business logic is the key to scaling your backend. Read our new guide! 💻', type: 'IMAGE' },
    { title: 'Startup Checklist for Product Launches', caption: '1. UI polish, 2. Stripe integration test, 3. Analytics tracking check, 4. Send email campaign. Ready to launch! 🚀', type: 'IMAGE' }
  ];

  for (const p of libraryPosts) {
    await prisma.post.create({
      data: {
        brandId: brand.id,
        createdByUserId: user.id,
        title: p.title,
        caption: p.caption,
        type: p.type,
        status: 'DRAFT',
        targetPlatforms: 'INSTAGRAM,FACEBOOK',
        mediaUrls: sampleImages[Math.floor(Math.random() * sampleImages.length)],
        isLibrary: true,
        isDeleted: false
      }
    });
  }

  // 3. Seed Deleted Posts
  console.log('Seeding Deleted Posts...');
  const deletedPosts = [
    { title: 'Outdated promotion banner', caption: 'Our Easter discount campaign is live! Get 20% off all premium plans using code EASTER20. 🐣 (Old Post)', type: 'IMAGE', status: 'PUBLISHED' },
    { title: 'Draft typo post', caption: 'This is a test post that has many typos and was deleted immediately.', type: 'IMAGE', status: 'DRAFT' },
    { title: 'Failed video export', caption: 'Check out our new podcast episode where we talk about AI safety. (Export failed due to encoding error)', type: 'VIDEO', status: 'FAILED', failureReason: 'VIDEO_TRANSCODING_FAILED' }
  ];

  for (const p of deletedPosts) {
    const deletedTime = new Date();
    deletedTime.setDate(deletedTime.getDate() - 3); // deleted 3 days ago

    await prisma.post.create({
      data: {
        brandId: brand.id,
        createdByUserId: user.id,
        title: p.title,
        caption: p.caption,
        type: p.type,
        status: p.status,
        targetPlatforms: 'TIKTOK,YOUTUBE',
        mediaUrls: sampleImages[Math.floor(Math.random() * sampleImages.length)],
        isLibrary: false,
        isDeleted: true,
        deletedAt: deletedTime,
        failureReason: p.failureReason
      }
    });
  }

  // 4. Seed Autolists and their Posts
  console.log('Seeding Autolists and queue posts...');
  
  // Autolist 1: Tips Queue (Active)
  const autolist1 = await prisma.autoList.create({
    data: {
      brandId: brand.id,
      name: 'Weekly Marketing Tips',
      sourceType: 'MANUAL',
      targetPlatforms: 'INSTAGRAM,FACEBOOK',
      scheduleType: 'SPECIFIC',
      specificTimes: '09:00,18:00',
      activeDays: 'MON,WED,FRI',
      isActive: true,
      loopEnabled: true,
      totalPostsCount: 4,
      publishedPostsCount: 1
    }
  });

  // Create posts for Autolist 1
  const list1Posts = [
    { title: 'Marketing Tip #1: Engagement', caption: 'Ask questions at the end of your posts to drive comments and boost algorithm placement! 💬', status: 'PUBLISHED', publishedAt: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { title: 'Marketing Tip #2: Video Hooks', caption: 'The first 3 seconds of your Reels/TikToks decide 90% of your view duration. Use high-contrast text hooks!', status: 'SCHEDULED', scheduledAt: new Date(new Date().setDate(new Date().getDate() + 2)) },
    { title: 'Marketing Tip #3: Carousel structure', caption: 'Build carousels with a teaser on slide 1, value on slides 2-4, and call-to-action on slide 5. 📈', status: 'SCHEDULED', scheduledAt: new Date(new Date().setDate(new Date().getDate() + 4)) },
    { title: 'Marketing Tip #4: Hashtags research', caption: 'Don\'t use 30 hashtags. 5 to 7 highly targeted niche hashtags work much better in 2026. 🏷️', status: 'DRAFT' }
  ];

  for (const p of list1Posts) {
    await prisma.post.create({
      data: {
        brandId: brand.id,
        createdByUserId: user.id,
        title: p.title,
        caption: p.caption,
        type: 'IMAGE',
        status: p.status,
        targetPlatforms: 'INSTAGRAM,FACEBOOK',
        mediaUrls: sampleImages[Math.floor(Math.random() * sampleImages.length)],
        autoListId: autolist1.id,
        scheduledAt: p.scheduledAt,
        publishedAt: p.publishedAt
      }
    });
  }

  // Autolist 2: RSS Feed (Active)
  const autolist2 = await prisma.autoList.create({
    data: {
      brandId: brand.id,
      name: 'PubliCast Blog RSS Sync',
      sourceType: 'RSS_FEED',
      rssUrl: 'https://blog.publicast.com/feed.xml',
      targetPlatforms: 'LINKEDIN,TWITTER',
      scheduleType: 'INTERVAL',
      intervalMinutes: 1440,
      activeDays: 'MON,TUE,WED,THU,FRI,SAT,SUN',
      isActive: true,
      loopEnabled: false,
      totalPostsCount: 2,
      publishedPostsCount: 2
    }
  });

  const list2Posts = [
    { title: 'Blog: Scaling Antigravity AI framework', caption: 'How we built a self-healing agent framework using Node.js and BullMQ queues. Link in bio!', status: 'PUBLISHED', publishedAt: new Date(new Date().setDate(new Date().getDate() - 5)) },
    { title: 'Blog: The future of headless social scheduling', caption: 'Why APIs are taking over traditional social media dashboards. Read our thoughts.', status: 'PUBLISHED', publishedAt: new Date(new Date().setDate(new Date().getDate() - 1)) }
  ];

  for (const p of list2Posts) {
    await prisma.post.create({
      data: {
        brandId: brand.id,
        createdByUserId: user.id,
        title: p.title,
        caption: p.caption,
        type: 'IMAGE',
        status: p.status,
        targetPlatforms: 'LINKEDIN,TWITTER',
        mediaUrls: sampleImages[Math.floor(Math.random() * sampleImages.length)],
        autoListId: autolist2.id,
        publishedAt: p.publishedAt
      }
    });
  }

  // Autolist 3: Campaign Promos (Inactive)
  const autolist3 = await prisma.autoList.create({
    data: {
      brandId: brand.id,
      name: 'Summer Campaign Promos',
      sourceType: 'CSV_UPLOAD',
      targetPlatforms: 'YOUTUBE,TIKTOK',
      scheduleType: 'SPECIFIC',
      specificTimes: '12:00',
      activeDays: 'SAT,SUN',
      isActive: false,
      loopEnabled: false,
      totalPostsCount: 3,
      publishedPostsCount: 0
    }
  });

  const list3Posts = [
    { title: 'Promo #1: Summer launch', caption: 'Summer features are here! Live streaming syndication is now available for all plans. ☀️', status: 'DRAFT' },
    { title: 'Promo #2: Flash sale alert', caption: 'FLASH SALE! 50% off for the next 24 hours. Don\'t miss out!', status: 'DRAFT' },
    { title: 'Promo #3: Feature walkthrough', caption: 'Watch our summer feature walkthrough video on YouTube. Link below!', status: 'DRAFT' }
  ];

  for (const p of list3Posts) {
    await prisma.post.create({
      data: {
        brandId: brand.id,
        createdByUserId: user.id,
        title: p.title,
        caption: p.caption,
        type: 'IMAGE',
        status: p.status,
        targetPlatforms: 'YOUTUBE,TIKTOK',
        mediaUrls: sampleImages[Math.floor(Math.random() * sampleImages.length)],
        autoListId: autolist3.id
      }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
