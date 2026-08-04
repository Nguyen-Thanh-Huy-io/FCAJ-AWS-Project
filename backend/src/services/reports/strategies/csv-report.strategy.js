const ReportGeneratorStrategy = require('./report-generator.strategy');

class CsvReportStrategy extends ReportGeneratorStrategy {
  async generate(title, brand, data, options = {}) {
    const brandName = brand?.name || 'PubliCast Brand';
    
    let csvContent = '\uFEFF'; // Add UTF-8 BOM for Excel compatibility
    
    // Header Info
    csvContent += `"BÁO CÁO PHÂN TÍCH THƯƠNG HIỆU: ${title.replace(/"/g, '""')}"\n`;
    csvContent += `"Thương hiệu:","${brandName.replace(/"/g, '""')}"\n`;
    csvContent += `"Ngày xuất bản:","${new Date().toLocaleDateString('vi-VN')}"\n\n`;
    
    // Overview Section
    csvContent += `"1. TỔNG QUAN HIỆU SUẤT"\n`;
    csvContent += `"Chỉ số","Giá trị"\n`;
    csvContent += `"Tổng lượt tiếp cận (Reach)","${data.overview?.reach || 0}"\n`;
    csvContent += `"Tổng lượt hiển thị (Impressions)","${data.overview?.impressions || 0}"\n`;
    csvContent += `"Tổng lượt tương tác (Engagements)","${data.overview?.engagements || 0}"\n`;
    csvContent += `"Tỷ lệ tương tác trung bình (Engagement Rate)","${(data.overview?.engagementRate || 0).toFixed(2)}%"\n\n`;
    
    // Channel Detail Section
    csvContent += `"2. CHI TIẾT TỪNG KÊNH MẠNG XÃ HỘI"\n`;
    csvContent += `"Nền tảng","Tên hiển thị","Followers/Subscribers","Số lượng bài đăng","Tỷ lệ tương tác"\n`;
    
    if (data.channels && data.channels.length > 0) {
      data.channels.forEach(ch => {
        csvContent += `"${ch.platform}","${(ch.displayName || '').replace(/"/g, '""')}","${ch.followers || 0}","${ch.postsCount || 0}","${(ch.engagementRate || 0).toFixed(2)}%"\n`;
      });
    } else {
      csvContent += `"Không có dữ liệu kênh nào"\n`;
    }
    csvContent += '\n';
    
    // Top Posts Section
    csvContent += `"3. DANH SÁCH BÀI VIẾT NỔI BẬT (VIRAL POSTS)"\n`;
    csvContent += `"Hạng","Nền tảng","Tiêu đề / Nội dung nháp","Lượt thích","Lượt bình luận","Lượt chia sẻ","Tỷ lệ tương tác"\n`;
    
    if (data.topPosts && data.topPosts.length > 0) {
      data.topPosts.forEach((post, idx) => {
        const postTitle = post.title || post.caption || 'Không có tiêu đề';
        csvContent += `"${idx + 1}","${post.platform}","${postTitle.replace(/"/g, '""')}","${post.likes || 0}","${post.comments || 0}","${post.shares || 0}","${(post.engagementRate || 0).toFixed(2)}%"\n`;
      });
    } else {
      csvContent += `"Không có dữ liệu bài đăng"\n`;
    }
    
    return {
      buffer: Buffer.from(csvContent, 'utf-8'),
      contentType: 'text/csv',
      extension: 'csv'
    };
  }
}

module.exports = CsvReportStrategy;
