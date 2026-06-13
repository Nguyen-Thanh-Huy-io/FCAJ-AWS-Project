const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Finding user and brand...');
  const user = await prisma.user.findUnique({
    where: { email: 'vothanhnha26@gmail.com' }
  });
  if (!user) {
    throw new Error('User vothanhnha26@gmail.com not found. Please run prisma db seed first.');
  }

  const brand = await prisma.brand.findFirst({
    where: { ownerId: user.id }
  });
  if (!brand) {
    throw new Error('Brand not found for user. Please run prisma db seed first.');
  }

  console.log(`Clearing existing posts for brand: ${brand.name}...`);
  await prisma.post.deleteMany({
    where: { brandId: brand.id }
  });

  console.log('Generating seed posts around the current week (June 07, 2026 - June 20, 2026)...');

  // Helper to construct dates relative to current week
  const makeDate = (dayOffset, hour, minute) => {
    // Starting base is June 7, 2026 (Sunday of the target week)
    const base = new Date('2026-06-07T00:00:00Z');
    base.setUTCDate(base.getUTCDate() + dayOffset);
    base.setUTCHours(hour, minute, 0, 0);
    return base;
  };

  const seedPosts = [
    // --- Sunday June 7 ---
    {
      title: 'Poll: What tools do you use for Social Media?',
      caption: 'Struggling to keep up with your TikTok content? Create Polls on Facebook! Polls on social networks have been incredibly successful for engagement. Read our blog post to learn how to moderate comments effectively. ✅ #marketing #tools',
      type: 'IMAGE',
      status: 'PUBLISHED',
      targetPlatforms: 'FACEBOOK',
      scheduledAt: makeDate(0, 14, 45), // 2:45 PM
      publishedAt: makeDate(0, 14, 46),
      mediaUrls: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&auto=format&fit=crop&q=60',
    },

    // --- Monday June 8 ---
    {
      title: 'Metrics study preview 2026',
      caption: 'Metricoolers, something big is coming today! We are launching our annual social media metrics study. Check the preview to see how your feed compares. 📊',
      type: 'IMAGE',
      status: 'PUBLISHED',
      targetPlatforms: 'TWITTER,FACEBOOK,INSTAGRAM',
      scheduledAt: makeDate(1, 10, 0), // 10:00 AM
      publishedAt: makeDate(1, 10, 1),
      mediaUrls: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=60',
    },
    {
      title: 'Influencer Marketing Tips',
      caption: 'If you are an influencer, content creator or brand manager, check our latest checklist of collaboration strategies. 🚀 #influencer #growth',
      type: 'IMAGE',
      status: 'PUBLISHED',
      targetPlatforms: 'FACEBOOK,LINKEDIN',
      scheduledAt: makeDate(1, 11, 15), // 11:15 AM
      publishedAt: makeDate(1, 11, 16),
      mediaUrls: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=60',
    },
    {
      title: 'TikTok Study 2026 Release',
      caption: '[TIKTOK STUDY 2026] If you upload content to TikTok, you should know these key posting times and hashtag behaviors. Full guide in bio!',
      type: 'VIDEO',
      status: 'PUBLISHED',
      targetPlatforms: 'TIKTOK',
      scheduledAt: makeDate(1, 16, 30), // 4:30 PM
      publishedAt: makeDate(1, 16, 31),
      mediaUrls: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=150&auto=format&fit=crop&q=60',
    },

    // --- Tuesday June 9 ---
    {
      title: 'Facebook Algorithms Changes',
      caption: '⚠️ Facebook social network is changing the reach algorithms. Discover what is the most active content format this summer and how to build a dynamic pipeline.',
      type: 'IMAGE',
      status: 'FAILED',
      targetPlatforms: 'FACEBOOK',
      scheduledAt: makeDate(2, 11, 15), // 11:15 AM
      failureReason: 'FACEBOOK: Page access token has expired or brand account disconnected',
      mediaUrls: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150&auto=format&fit=crop&q=60',
    },
    {
      title: 'Best Time to Post on Twitter/X',
      caption: 'Does publishing on Twitter/X during work hours boost engagement? Our data analysis reveals interesting trends. #metrics',
      type: 'IMAGE',
      status: 'SCHEDULED',
      targetPlatforms: 'TWITTER',
      scheduledAt: makeDate(2, 11, 30), // 11:30 AM
      mediaUrls: 'https://images.unsplash.com/photo-1611605698335-8b15d27e03f9?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1611605698335-8b15d27e03f9?w=150&auto=format&fit=crop&q=60',
    },
    {
      title: 'Hello Metricoolers: Pinterest Tips',
      caption: 'Hello Metricoolers! 👋 Although Pinterest may not seem like a primary traffic driver, it actually converts 3x higher than other platforms. Here is how to start.',
      type: 'CAROUSEL',
      status: 'SCHEDULED',
      targetPlatforms: 'INSTAGRAM',
      scheduledAt: makeDate(2, 14, 0), // 2:00 PM
      mediaUrls: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?w=600&auto=format&fit=crop&q=60,https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?w=150&auto=format&fit=crop&q=60',
    },

    // --- Wednesday June 10 ---
    {
      title: '[TOP Metricool Feature] Auto Lists',
      caption: '[TOP Metricool FEATURE] ♾️ What is Auto List and how can you recycle your evergreen content automatically without setting dates manually every single time?',
      type: 'IMAGE',
      status: 'DRAFT',
      targetPlatforms: 'INSTAGRAM',
      scheduledAt: makeDate(3, 11, 0), // 11:00 AM
      mediaUrls: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150&auto=format&fit=crop&q=60',
    },
    {
      title: 'Productive Social Calendar Hacks',
      caption: 'Discover the best calendar shortcuts to save 10 hours a week on scheduling posts. Multiple platforms, one interface! #productivity',
      type: 'IMAGE',
      status: 'PENDING_APPROVAL',
      targetPlatforms: 'FACEBOOK,LINKEDIN',
      scheduledAt: makeDate(3, 13, 30), // 1:30 PM
      mediaUrls: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=150&auto=format&fit=crop&q=60',
    },

    // --- Thursday June 11 ---
    {
      title: 'YouTube channel optimization guide',
      caption: 'If your YouTube channel is more alive than ever, we tell you the secret to staying on top: schedule your videos consistently and optimize thumbnails. 🎥',
      type: 'VIDEO',
      status: 'FAILED',
      targetPlatforms: 'YOUTUBE',
      scheduledAt: makeDate(4, 11, 15), // 11:15 AM
      failureReason: 'YOUTUBE: Upload failed. Invalid API token permissions.',
      mediaUrls: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=150&auto=format&fit=crop&q=60',
    },
    {
      title: 'Do you want to double your account reach?',
      caption: 'Do you want to double your account reach? Try combining short vertical videos on Instagram, YouTube and TikTok. Learn our cross-posting workflow!',
      type: 'VIDEO',
      status: 'SCHEDULED',
      targetPlatforms: 'FACEBOOK,TIKTOK,INSTAGRAM',
      scheduledAt: makeDate(4, 13, 0), // 1:00 PM
      mediaUrls: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=60',
    },
    {
      title: 'AI Copywriting inside PubliCast',
      caption: 'Now in the Planner, you have our AI COPYWRITING assistant! Generate headlines, translate captions and add emojis in 1 click. Try it now! 🤖✨',
      type: 'IMAGE',
      status: 'APPROVED',
      targetPlatforms: 'FACEBOOK,TWITTER',
      scheduledAt: makeDate(4, 16, 30), // 4:30 PM
      mediaUrls: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=150&auto=format&fit=crop&q=60',
    },

    // --- Friday June 12 ---
    {
      title: 'Autolist Blog Twitter - English',
      caption: 'Autolist: Blog Twitter - Inglés. Sharing our daily developer notes, tips on React, and architectural clean code patterns. #programming',
      type: 'IMAGE',
      status: 'SCHEDULED',
      targetPlatforms: 'TWITTER',
      scheduledAt: makeDate(5, 11, 15), // 11:15 AM
      mediaUrls: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=150&auto=format&fit=crop&q=60',
    },

    // --- Saturday June 13 ---
    {
      title: 'Autolist Video Facebook & YouTube',
      caption: 'Check out our latest video showcase of the PubliCast Dashboard UI. Let us know your thoughts on our premium aesthetics! 🎬 #design #dashboard',
      type: 'VIDEO',
      status: 'SCHEDULED',
      targetPlatforms: 'FACEBOOK,YOUTUBE',
      scheduledAt: makeDate(6, 11, 15), // 11:15 AM
      mediaUrls: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=150&auto=format&fit=crop&q=60',
    },
    {
      title: 'Weekend Programming Quote',
      caption: "“Simple code is clean code. Don't add abstractions until you need them.” - Pair programming with Antigravity! 🚀 Enjoy your weekend!",
      type: 'IMAGE',
      status: 'DRAFT',
      targetPlatforms: 'LINKEDIN',
      scheduledAt: makeDate(6, 15, 30), // 3:30 PM
      mediaUrls: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60',
      mediaThumbnailUrls: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=60',
    }
  ];

  console.log(`Seeding ${seedPosts.length} posts...`);

  for (const post of seedPosts) {
    // Generate default metadata options
    const options = {
      youtubeType: 'video',
      youtubeTitle: post.title,
      privacyStatus: 'public',
      categoryId: '22',
      playlistId: '',
      tags: 'marketing,social',
      madeForKids: false,
      firstComment: '',
      facebookType: 'post',
      facebookTitle: post.title,
      tiktokPrivacy: 'public',
      tiktokAllowComments: true,
      tiktokAllowDuet: true,
      tiktokAllowStitch: true,
      tiktokAiGenerated: false,
      tiktokCommercialContent: false
    };

    await prisma.post.create({
      data: {
        brandId: brand.id,
        createdByUserId: user.id,
        title: post.title,
        caption: post.caption,
        type: post.type,
        status: post.status,
        targetPlatforms: post.targetPlatforms,
        mediaUrls: post.mediaUrls,
        mediaThumbnailUrls: post.mediaThumbnailUrls,
        scheduledAt: post.scheduledAt,
        publishedAt: post.publishedAt || null,
        failureReason: post.failureReason || null,
        isLibrary: false,
        metadata: JSON.stringify(options)
      }
    });
  }

  console.log('Seeding posts completed successfully!');
}

main()
  .catch(e => {
    console.error('Error seeding posts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
