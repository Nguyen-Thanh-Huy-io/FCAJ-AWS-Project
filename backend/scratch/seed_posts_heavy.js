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

  console.log('Generating heavy seed posts for the last 2 months (April 15, 2026 - June 20, 2026)...');

  const platformsList = ['FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'YOUTUBE', 'LINKEDIN', 'TWITTER'];
  const statusPast = ['PUBLISHED', 'PUBLISHED', 'PUBLISHED', 'FAILED', 'PUBLISHED']; // 80% Published, 20% Failed
  const statusFuture = ['SCHEDULED', 'DRAFT', 'PENDING_APPROVAL', 'SCHEDULED'];
  const postTypes = ['IMAGE', 'VIDEO', 'CAROUSEL'];

  // List of beautiful placeholder images for social posts
  const sampleImages = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60', // Marketing/Chart
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=60', // Laptop workspace
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=60', // People meeting
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=60', // TikTok style
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=60', // Mobile app UI
    'https://images.unsplash.com/photo-1611605698335-8b15d27e03f9?w=600&auto=format&fit=crop&q=60', // Twitter logo
    'https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?w=600&auto=format&fit=crop&q=60', // Pinterest board
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60', // UI design layout
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=60', // Calendar planner
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60', // Cyber code
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60', // Digital dashboard
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=60', // AI Robot
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&auto=format&fit=crop&q=60', // Coding IDE
    'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&auto=format&fit=crop&q=60', // Video editing
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60'  // Desktop setup
  ];

  const captionsPool = [
    {
      title: 'Hacks to double your organic reach',
      caption: 'Do you want to double your account reach? Try combining short vertical videos on Instagram, YouTube and TikTok. Learn our cross-posting workflow! 🚀 #socialmedia #tips'
    },
    {
      title: 'Metrics Study Preview 2026',
      caption: 'Our annual social media metrics study is officially here! We analyzed 10M+ posts to reveal key posting times and hashtag behaviors. Check the full link in our bio! 📊'
    },
    {
      title: 'Clean Code principles for startups',
      caption: "“Simple code is clean code. Don't add abstractions until you need them.” - Pair programming with Antigravity AI assistant! enjoy your coding journey! 💻✨ #cleancode #startup"
    },
    {
      title: 'AI Copywriting Assistant is LIVE!',
      caption: 'Generate catchy headlines, translate captions and add matching emojis in 1 click using our new AI Assistant directly inside the Post Creator form! Try it today! 🤖📝'
    },
    {
      title: 'How to handle comments effectively',
      caption: 'Struggling to keep up with your comments moderation? Enable our Unified Inbox to manage messages, reviews and mentions from Facebook, IG and TikTok in one tab! ✅'
    },
    {
      title: 'TikTok Algorithm Secrets 2026',
      caption: 'Warning! TikTok has updated its SEO ranking factors. Utilizing proper keywords in your captions is now more important than hashtags. Share this tip! 🎬 #tiktokseo #marketing'
    },
    {
      title: 'LinkedIn networking strategies',
      caption: 'Connecting with key stakeholders? Here is a step-by-step guide to optimize your personal profile and build a premium digital brand in 2026. 💼 #networking #personalbrand'
    },
    {
      title: 'YouTube Shorts vs Long-form video',
      caption: 'Should you focus on YouTube Shorts or long-form videos this summer? Check out our latest analytics report showing engagement rates and watch time distributions. 🎥'
    },
    {
      title: 'Auto List: recycle your best posts',
      caption: '[TOP PubliCast FEATURE] ♾️ What is Auto List and how can you recycle your evergreen content automatically without setting calendar dates manually? Here is the full workflow!'
    },
    {
      title: 'Weekly Team Standup Highlights',
      caption: 'Aligning our engineering and marketing pipelines today. Big updates on the analytics dashboard and social links are coming next week! Stay tuned! 🚀'
    }
  ];

  const failureReasons = [
    'FACEBOOK: Page access token has expired or brand account disconnected',
    'YOUTUBE: Upload failed. Invalid API token permissions.',
    'TIKTOK: Video resolution exceeds maximum allowed size.',
    'INSTAGRAM: Media aspect ratio must be 1:1 or 4:5.',
    'LINKEDIN: Network timeout. Please try again.'
  ];

  const startDate = new Date('2026-04-15T00:00:00Z');
  const endDate = new Date('2026-06-20T00:00:00Z');
  const currentDate = new Date('2026-06-13T18:00:00Z'); // Current local context date

  let postCount = 0;

  // Iterate day by day from startDate to endDate
  for (let d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
    // Determine number of posts for this day (between 1 and 3 posts for high density)
    // Sunday might have fewer posts, weekdays more
    const dayOfWeek = d.getUTCDay();
    const numPosts = (dayOfWeek === 0) ? 1 : Math.floor(Math.random() * 2) + 2; // 1 post on Sun, 2-3 on weekdays

    for (let i = 0; i < numPosts; i++) {
      // Pick random hour and minute (golden hours: 9AM, 11AM, 1PM, 2PM, 4PM)
      const goldenHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];
      const hour = goldenHours[Math.floor(Math.random() * goldenHours.length)];
      const minute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];

      const scheduledAt = new Date(d);
      scheduledAt.setUTCHours(hour, minute, 0, 0);

      // Check if scheduledAt is in the past or future relative to current system date (June 13, 2026)
      const isPast = scheduledAt < currentDate;

      let status = 'DRAFT';
      let failureReason = null;
      let publishedAt = null;

      if (isPast) {
        status = statusPast[Math.floor(Math.random() * statusPast.length)];
        if (status === 'PUBLISHED') {
          publishedAt = new Date(scheduledAt);
          publishedAt.setUTCMinutes(publishedAt.getUTCMinutes() + 1); // published 1 min later
        } else if (status === 'FAILED') {
          failureReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
        }
      } else {
        status = statusFuture[Math.floor(Math.random() * statusFuture.length)];
      }

      // Select platforms (either single or multi-posting)
      let targetPlatforms = [];
      const numPlat = Math.floor(Math.random() * 3) + 1; // 1 to 3 platforms
      const shuffledPlat = [...platformsList].sort(() => 0.5 - Math.random());
      targetPlatforms = shuffledPlat.slice(0, numPlat);

      // Select type
      const type = postTypes[Math.floor(Math.random() * postTypes.length)];

      // Select content details
      const content = captionsPool[Math.floor(Math.random() * captionsPool.length)];

      // Media details
      let mediaUrls = [];
      const numMedia = type === 'CAROUSEL' ? 3 : (type === 'VIDEO' ? 1 : 1);
      const shuffledMedia = [...sampleImages].sort(() => 0.5 - Math.random());
      mediaUrls = shuffledMedia.slice(0, numMedia);

      const thumbnail = mediaUrls[0];

      // Metadata options
      const options = {
        youtubeType: 'video',
        youtubeTitle: content.title,
        privacyStatus: 'public',
        categoryId: '22',
        playlistId: '',
        tags: 'marketing,social',
        madeForKids: false,
        firstComment: '',
        facebookType: 'post',
        facebookTitle: content.title,
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
          title: content.title,
          caption: content.caption,
          type,
          status,
          targetPlatforms: targetPlatforms.join(','),
          mediaUrls: mediaUrls.join(','),
          mediaThumbnailUrls: thumbnail,
          scheduledAt,
          publishedAt,
          failureReason,
          isLibrary: false,
          metadata: JSON.stringify(options)
        }
      });

      postCount++;
    }
  }

  console.log(`Successfully seeded ${postCount} posts over the 2-month period!`);
}

main()
  .catch(e => {
    console.error('Error seeding heavy posts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
