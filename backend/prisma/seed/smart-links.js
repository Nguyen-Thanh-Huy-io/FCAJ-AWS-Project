/**
 * Seed SmartLinks - Idempotent
 *
 * SmartLink có `slug` @unique.
 * SmartLinkDailyMetric có @@unique([smartLinkId, date]).
 * LinkItem dùng id cố định.
 */
module.exports = async function (prisma, context) {
  console.log('Seeding SmartLinks...');
  const { brand1, testBrand } = context.brands;

  // 1. Upsert SmartLink Brand 1
  const smartLinkBrand1 = await prisma.smartLink.upsert({
    where: { slug: 'publicast-links' },
    update: {
      pageTitle: 'PubliCast Global - SmartLinks',
      bio: 'Nền tảng lên kế hoạch và tối ưu hóa nội dung đa kênh tiện lợi.',
      profileImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      backgroundType: 'THEME', backgroundValue: 'midnight', buttonStyle: 'rounded',
      socialLinks: 'instagram=https://instagram.com;youtube=https://youtube.com',
      isPublished: true
    },
    create: {
      brandId: brand1.id, slug: 'publicast-links', pageTitle: 'PubliCast Global - SmartLinks',
      bio: 'Nền tảng lên kế hoạch và tối ưu hóa nội dung đa kênh tiện lợi.',
      profileImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      backgroundType: 'THEME', backgroundValue: 'midnight', buttonStyle: 'rounded',
      socialLinks: 'instagram=https://instagram.com;youtube=https://youtube.com',
      isPublished: true
    }
  });

  // Upsert LinkItems cho Brand 1
  const linksBrand1 = [
    { id: 'link_free_trial', title: 'Trải nghiệm ứng dụng miễn phí', url: 'https://publicast.com/free-trial', emoji: '🚀', position: 0, isActive: true, clicks: 250 },
    { id: 'link_docs', title: 'Tài liệu hướng dẫn sử dụng', url: 'https://docs.publicast.com', emoji: '📚', position: 1, isActive: true, clicks: 120 }
  ];
  for (const link of linksBrand1) {
    await prisma.linkItem.upsert({
      where: { id: link.id },
      update: { title: link.title, url: link.url, emoji: link.emoji, position: link.position, isActive: link.isActive, clicks: link.clicks, smartLinkId: smartLinkBrand1.id },
      create: { ...link, smartLinkId: smartLinkBrand1.id }
    });
  }

  // Upsert Daily Metrics Brand 1
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let index = 0; index < 30; index++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - index));
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const factor = isWeekend ? 0.5 : 1.0;
    const visits = Math.max(10, Math.round((50 + Math.sin(index / 5) * 20 + Math.random() * 10) * factor));
    const unique = Math.max(5, Math.round(visits * 0.8));

    await prisma.smartLinkDailyMetric.upsert({
      where: { smartLinkId_date: { smartLinkId: smartLinkBrand1.id, date } },
      update: { pageViews: visits, uniqueVisitors: unique },
      create: { smartLinkId: smartLinkBrand1.id, date, pageViews: visits, uniqueVisitors: unique }
    });
  }

  // 2. Upsert SmartLink Test Brand
  const testSmartLink = await prisma.smartLink.upsert({
    where: { slug: 'trongphuc-tech' },
    update: {
      pageTitle: 'Nguyễn Trọng Phúc - Tech Bio',
      bio: 'Nơi chia sẻ các bài viết kỹ thuật phần mềm và kiến thức thiết kế hệ thống.',
      backgroundType: 'THEME', backgroundValue: 'mint', buttonStyle: 'classic', isPublished: true
    },
    create: {
      brandId: testBrand.id, slug: 'trongphuc-tech', pageTitle: 'Nguyễn Trọng Phúc - Tech Bio',
      bio: 'Nơi chia sẻ các bài viết kỹ thuật phần mềm và kiến thức thiết kế hệ thống.',
      backgroundType: 'THEME', backgroundValue: 'mint', buttonStyle: 'classic', isPublished: true
    }
  });

  await prisma.linkItem.upsert({
    where: { id: 'link_blog_trongphuc' },
    update: { title: 'Đọc blog cá nhân', url: 'https://trongphuc.dev', emoji: '💻', position: 0, isActive: true, clicks: 142, smartLinkId: testSmartLink.id },
    create: { id: 'link_blog_trongphuc', title: 'Đọc blog cá nhân', url: 'https://trongphuc.dev', emoji: '💻', position: 0, isActive: true, clicks: 142, smartLinkId: testSmartLink.id }
  });
};
