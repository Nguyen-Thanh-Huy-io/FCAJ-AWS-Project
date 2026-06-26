const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('=== KIỂM TRA ĐỘ BẢO MẬT TOKEN TRONG DATABASE ===');
  
  try {
    const accounts = await prisma.socialAccount.findMany();
    
    if (accounts.length === 0) {
      console.log('Không tìm thấy tài khoản mạng xã hội nào trong database.');
      return;
    }
    
    console.log(`Tìm thấy ${accounts.length} tài khoản:`);
    for (const acc of accounts) {
      console.log(`\n- Platform: ${acc.platform}`);
      console.log(`  Username: ${acc.username}`);
      console.log(`  Access Token lưu trong DB: ${acc.accessToken}`);
      console.log(`  Refresh Token lưu trong DB: ${acc.refreshToken}`);
      
      const isEncrypted = acc.accessToken.includes(':');
      console.log(`  Trạng thái mã hóa: ${isEncrypted ? 'ĐÃ MÃ HÓA (AES)' : 'PLAIN-TEXT (CẢNH BÁO BẢO MẬT)'}`);
    }
  } catch (error) {
    console.error('Lỗi khi truy vấn DB:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
