const { Builder, By, Key, until } = require('selenium-webdriver');

async function runLocalLoginTest() {
  console.log("=========================================================");
  console.log("🚀 CHẠY TEST SELENIUM ĐĂNG NHẬP LOCAL (StreamHub)...");
  console.log("=========================================================");

  let driver = await new Builder().forBrowser('chrome').build();

  try {
    const targetUrl = 'http://localhost:5173/login';
    console.log(`👉 Đang truy cập URL: ${targetUrl}`);
    await driver.get(targetUrl);

    // Chờ các trường nhập liệu load xong
    console.log("🔍 Chờ form Đăng nhập xuất hiện...");
    let emailInput = await driver.wait(until.elementLocated(By.xpath("//input[@type='email']")), 5000);
    let passwordInput = await driver.findElement(By.xpath("//input[@type='password']"));
    let submitButton = await driver.findElement(By.xpath("//button[@type='submit']"));

    console.log("✍️ Điền email đăng nhập: 'test_selenium_user@example.com'");
    await emailInput.sendKeys('test_selenium_user@example.com');

    console.log("✍️ Điền mật khẩu: 'Password123!'");
    await passwordInput.sendKeys('Password123!');

    console.log("🖱️ Bấm nút đăng nhập...");
    await submitButton.click();

    // Chờ xem có chuyển hướng tới trang Dashboard không
    console.log("⏳ Chờ hệ thống xác thực và chuyển hướng trang...");
    await driver.wait(until.urlContains('/dashboard'), 5000);
    console.log("🎉 KẾT QUẢ: Đăng nhập thành công và chuyển hướng đến Dashboard!");
    console.log("✅ KẾT QUẢ: KIỂM THỬ SELENIUM LOGIN HOẠT ĐỘNG THÀNH CÔNG!");
  } catch (error) {
    console.error("❌ KẾT QUẢ: Kiểm thử thất bại!");
    console.error("Lưu ý: Bạn cần khởi chạy local server frontend ở port 5173 trước khi chạy test này.");
    console.error("Chi tiết lỗi:", error.message);
  } finally {
    console.log("🧹 Đang đóng trình duyệt...");
    await driver.quit();
    console.log("=========================================================");
  }
}

runLocalLoginTest();
