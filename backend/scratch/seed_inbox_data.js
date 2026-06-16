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

  // 1. Get or Create UnifiedInbox for the brand
  console.log('Ensuring UnifiedInbox exists...');
  let inbox = await prisma.unifiedInbox.findUnique({
    where: { brandId: brand.id }
  });
  if (!inbox) {
    inbox = await prisma.unifiedInbox.create({
      data: { brandId: brand.id }
    });
  }

  // 2. Clear old inbox items for this inbox
  console.log('Clearing old inbox items...');
  await prisma.inboxItem.deleteMany({
    where: { inboxId: inbox.id }
  });

  // 3. Ensure mock Social Accounts exist for linking
  console.log('Ensuring Facebook and Instagram social accounts exist...');
  
  // Facebook Account
  let fbAccount = await prisma.socialAccount.findFirst({
    where: { brandId: brand.id, platform: 'FACEBOOK' }
  });
  if (!fbAccount) {
    fbAccount = await prisma.socialAccount.create({
      data: {
        brandId: brand.id,
        platform: 'FACEBOOK',
        platformAccountId: 'fb-page-123',
        username: 'publicast_fb',
        displayName: 'PubliCast Team Facebook',
        accessToken: 'mock-access-token-fb',
        scopes: 'manage_pages,publish_pages',
        connectedAt: new Date()
      }
    });
  }

  // Instagram Account
  let igAccount = await prisma.socialAccount.findFirst({
    where: { brandId: brand.id, platform: 'INSTAGRAM' }
  });
  if (!igAccount) {
    igAccount = await prisma.socialAccount.create({
      data: {
        brandId: brand.id,
        platform: 'INSTAGRAM',
        platformAccountId: 'ig-acc-123',
        username: 'publicast_ig',
        displayName: 'publicast_creator',
        accessToken: 'mock-access-token-ig',
        scopes: 'instagram_basic,instagram_manage_messages',
        connectedAt: new Date()
      }
    });
  }

  // 4. Seed Inbox Items (Direct Messages and Comments)
  console.log('Seeding Inbox Items...');

  // --- FACEBOOK DATA ---
  
  // FB Conversation 1: Comment (Unread)
  const fbComment1 = await prisma.inboxItem.create({
    data: {
      inboxId: inbox.id,
      platform: 'FACEBOOK',
      type: 'COMMENT',
      platformItemId: 'fb-comment-1',
      authorId: 'user-fb-1',
      authorName: 'Alice Nguyen',
      authorAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
      content: 'Phần mềm này có hỗ trợ tự động đăng Reels và Shorts không shop ơi? Mình đang rất cần tính năng này.',
      status: 'UNREAD',
      sentiment: 'POSITIVE',
      tags: JSON.stringify(['Hỏi giá', 'Quan tâm']),
      socialAccountId: fbAccount.id,
      platformCreatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      syncedAt: new Date()
    }
  });

  // FB Conversation 1 Reply (Thread)
  await prisma.inboxItem.create({
    data: {
      inboxId: inbox.id,
      platform: 'FACEBOOK',
      type: 'COMMENT',
      platformItemId: 'fb-comment-1-reply',
      authorId: 'fb-page-123',
      authorName: 'PubliCast Team Facebook',
      authorAvatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
      content: 'Chào bạn! PubliCast hỗ trợ lên lịch và tự động đăng Reels (Instagram, Facebook) cũng như YouTube Shorts hoàn toàn tự động nhé. Bạn có thể đăng ký dùng thử 14 ngày miễn phí ạ!',
      parentItemId: fbComment1.id,
      status: 'READ',
      socialAccountId: fbAccount.id,
      platformCreatedAt: new Date(Date.now() - 1.8 * 60 * 60 * 1000), // 1.8 hours ago
      syncedAt: new Date()
    }
  });

  // FB Conversation 2: Direct Message (Unread)
  await prisma.inboxItem.create({
    data: {
      inboxId: inbox.id,
      platform: 'FACEBOOK',
      type: 'DIRECT_MESSAGE',
      platformItemId: 'fb-dm-1',
      authorId: 'user-fb-2',
      authorName: 'Minh Hoàng',
      authorAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
      content: 'Chào Admin, bên mình muốn mua gói PRO cho team 5 người sử dụng. Có chính sách chiết khấu hay xuất hóa đơn đỏ không bạn?',
      status: 'UNREAD',
      sentiment: 'NEUTRAL',
      tags: JSON.stringify(['Khách hàng VIP', 'Hỗ trợ']),
      socialAccountId: fbAccount.id,
      platformCreatedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
      syncedAt: new Date()
    }
  });


  // --- INSTAGRAM DATA ---

  // IG Conversation 1: Comment (Unread)
  const igComment1 = await prisma.inboxItem.create({
    data: {
      inboxId: inbox.id,
      platform: 'INSTAGRAM',
      type: 'COMMENT',
      platformItemId: 'ig-comment-1',
      authorId: 'user-ig-1',
      authorName: 'johndoe_design',
      authorAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
      content: 'Giao diện lịch tuần của app nhìn đẹp và tiện thật sự! Xứng đáng 5 sao.',
      status: 'UNREAD',
      sentiment: 'POSITIVE',
      tags: JSON.stringify(['Khen ngợi']),
      socialAccountId: igAccount.id,
      platformCreatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      syncedAt: new Date()
    }
  });

  // IG Conversation 2: Direct Message (Read)
  const igDM1 = await prisma.inboxItem.create({
    data: {
      inboxId: inbox.id,
      platform: 'INSTAGRAM',
      type: 'DIRECT_MESSAGE',
      platformItemId: 'ig-dm-1',
      authorId: 'user-ig-2',
      authorName: 'sarah_mkt',
      authorAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
      content: 'Hello PubliCast, I would love to check out your pricing plans for agencies. Do you have bulk discounts?',
      status: 'READ',
      sentiment: 'POSITIVE',
      tags: JSON.stringify(['Agency', 'Foreign Client']),
      socialAccountId: igAccount.id,
      platformCreatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      syncedAt: new Date()
    }
  });

  // IG Conversation 2 Reply
  await prisma.inboxItem.create({
    data: {
      inboxId: inbox.id,
      platform: 'INSTAGRAM',
      type: 'DIRECT_MESSAGE',
      platformItemId: 'ig-dm-1-reply',
      authorId: 'ig-acc-123',
      authorName: 'publicast_creator',
      authorAvatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
      content: 'Hi Sarah! Yes, we have special agency discount packages starting from 10 brands. Let me send you our brochure!',
      parentItemId: igDM1.id,
      status: 'READ',
      socialAccountId: igAccount.id,
      platformCreatedAt: new Date(Date.now() - 23.5 * 60 * 60 * 1000), // 23.5 hours ago
      syncedAt: new Date()
    }
  });

  console.log('Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
