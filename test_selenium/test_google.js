const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runTest() {
  console.log("=========================================================");
  console.log("🚀 KHỞI CHẠY KIỂM THỬ TỰ ĐỘNG GIAO DIỆN BẰNG SELENIUM...");
  console.log("=========================================================");

  let options = new chrome.Options();
  
  // Khởi tạo trình duyệt Chrome
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    console.log("👉 Đang kết nối tới: https://www.google.com");
    await driver.get('https://www.google.com');

    // Chờ ô tìm kiếm xuất hiện (khoảng tối đa 5 giây)
    console.log("🔍 Chờ tải ô tìm kiếm...");
    let searchBox = await driver.wait(until.elementLocated(By.name('q')), 5000);

    // Gõ từ khóa tìm kiếm và ấn Enter
    console.log("✍️ Nhập từ khóa: 'PubliCast E2E Testing'");
    await searchBox.sendKeys('PubliCast E2E Testing', Key.RETURN);

    // Chờ kết quả tìm kiếm hiển thị
    console.log("⏳ Chờ kết quả tìm kiếm hiển thị...");
    await driver.sleep(3000);
    let title = await driver.getTitle();
    console.log(`✨ Kết quả tiêu đề trang: "${title}"`);
    console.log("✅ KẾT QUẢ: KIỂM THỬ SELENIUM HOẠT ĐỘNG THÀNH CÔNG!");
  } catch (error) {
    console.error("❌ KẾT QUẢ: Kiểm thử thất bại với lỗi sau:", error);
  } finally {
    console.log("🧹 Đang đóng trình duyệt...");
    await driver.quit();
    console.log("=========================================================");
  }
}

runTest();
