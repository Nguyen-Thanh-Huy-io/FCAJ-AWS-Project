/**
 * Seed Posts - Idempotent
 *
 * Post không có unique constraint, dùng deterministic id để upsert an toàn.
 */
module.exports = async function (prisma, context) {
  console.log('Seeding Posts...');
  const { testUser, customerUser } = context.users;
  const { testBrand, brand1 } = context.brands;
  const { testAutoList } = context.autoLists;

  async function upsertPost({ id, data }) {
    return prisma.post.upsert({
      where: { id },
      update: data,
      create: { id, ...data }
    });
  }

  await upsertPost({
    id: 'post_test_draft',
    data: { brandId: testBrand.id, createdByUserId: testUser.id, title: 'Bài viết ra mắt sản phẩm mới - Bản nháp', caption: 'Chúng tôi sắp sửa ra mắt giải pháp AI tự động hóa lịch đăng bài đa kênh. Cùng chờ đón nhé!', type: 'IMAGE', status: 'DRAFT', targetPlatforms: 'FACEBOOK,INSTAGRAM', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
  });
  
  await upsertPost({
    id: 'post_test_scheduled',
    data: { brandId: testBrand.id, createdByUserId: testUser.id, title: 'Thông báo tuyển dụng vị trí Developer', caption: 'PubliCast đang tuyển dụng lập trình viên NodeJS / ReactJS có kinh nghiệm. Môi trường làm việc năng động, phúc lợi cao!', type: 'TEXT', status: 'SCHEDULED', targetPlatforms: 'LINKEDIN', scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
  });
  
  await upsertPost({
    id: 'post_test_published',
    data: { brandId: testBrand.id, createdByUserId: testUser.id, title: 'Chia sẻ kiến thức Marketing đa kênh', caption: 'Làm thế nào để phân phối nội dung đồng thời lên Facebook, TikTok và YouTube Shorts mà vẫn giữ chân người dùng? Đọc bài viết sau đây.', type: 'LINK', status: 'PUBLISHED', targetPlatforms: 'FACEBOOK', publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), platformPostId: 'fb_post_999123', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
  });
  
  await upsertPost({
    id: 'post_test_failed',
    data: { brandId: testBrand.id, createdByUserId: testUser.id, title: 'Video Demo tính năng AI Content Generator', caption: 'Cùng xem sức mạnh của AI trong việc tự động sáng tạo nội dung bài viết và đề xuất hashtag cực thông minh.', type: 'VIDEO', status: 'FAILED', targetPlatforms: 'YOUTUBE', failureReason: 'OAuth Token Expired. Please reconnect your account.', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) }
  });

  if (testAutoList) {
    await upsertPost({
      id: 'post_test_autolist',
      data: { brandId: testBrand.id, createdByUserId: testUser.id, title: 'Kỹ thuật tối ưu database MySQL cho ứng dụng lớn', caption: 'Tìm hiểu cách index, tối ưu truy vấn để database luôn hoạt động ổn định.', type: 'TEXT', status: 'SCHEDULED', targetPlatforms: 'LINKEDIN', autoListId: testAutoList.id, createdAt: new Date() }
    });
  }

  // Templates (Library)
  await upsertPost({
    id: 'post_template_promo',
    data: { brandId: brand1.id, createdByUserId: customerUser.id, title: 'Mẫu thông báo chương trình khuyến mãi cuối tuần', caption: '🔥 KHUYẾN MÃI CỰC KHỦNG CUỐI TUẦN 🔥\n\nNhận ngay ưu đãi giảm giá lên đến 50% cho toàn bộ sản phẩm trên hệ thống. Số lượng có hạn, nhanh tay săn ngay!\n\n👉 Chi tiết xem tại: https://publicast.com/promo\n\n#KhuyenMai #CuoiTuan #PubliCast', type: 'IMAGE', status: 'DRAFT', targetPlatforms: 'FACEBOOK,LINKEDIN', isLibrary: true, mediaUrls: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop&q=60', mediaThumbnailUrls: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop&q=60', createdAt: new Date() }
  });

  await upsertPost({
    id: 'post_template_video',
    data: { brandId: brand1.id, createdByUserId: customerUser.id, title: 'Mẫu video giới thiệu tính năng sản phẩm mới', caption: '🚀 GIỚI THIỆU TÍNH NĂNG MỚI: AI CONTENT GENERATOR 🚀\n\nBạn đã bao giờ tốn hàng giờ để viết caption và tìm hashtag? Hãy xem video này để biết cách AI giúp bạn tự động hóa việc đó trong 30 giây!\n\n#AI #ProductUpdate #Marketing #PubliCast', type: 'VIDEO', status: 'DRAFT', targetPlatforms: 'YOUTUBE,TIKTOK', isLibrary: true, mediaUrls: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60', mediaThumbnailUrls: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60', metadata: JSON.stringify({ youtubeType: 'video', youtubeTitle: 'GIỚI THIỆU TÍNH NĂNG MỚI: AI CONTENT GENERATOR', privacyStatus: 'public', categoryId: '28', madeForKids: false, youtubeThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60', tags: 'AI, ProductUpdate, Marketing, PubliCast', firstComment: 'Hãy đăng ký dùng thử miễn phí tại publicast.com nhé!' }), createdAt: new Date() }
  });

  await upsertPost({
    id: 'post_template_tips',
    data: { brandId: testBrand.id, createdByUserId: testUser.id, title: 'Mẫu Daily Tech Tips chia sẻ kiến thức', caption: '💡 DAILY TECH TIPS 💡\n\nCách tối ưu hóa MySQL database cực đơn giản mà bạn nên biết để tăng tốc hiệu năng ứng dụng lên gấp 2 lần.\n\n#MySQL #Database #Developer #Tips', type: 'IMAGE', status: 'DRAFT', targetPlatforms: 'LINKEDIN', isLibrary: true, mediaUrls: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60', mediaThumbnailUrls: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60', createdAt: new Date() }
  });
};
