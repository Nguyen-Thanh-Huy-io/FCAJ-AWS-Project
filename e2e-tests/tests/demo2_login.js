const { Builder, By, until } = require('selenium-webdriver');

async function testPubliCastLogin() {
  // Khởi tạo driver Chrome
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // 1. Mở trang đăng nhập PubliCast ở localhost
    // Lưu ý: Đảm bảo frontend đang chạy (npm run dev)
    await driver.get('http://localhost:5173/login');
    console.log('Đã mở trang đăng nhập PubliCast');

    // Chờ form đăng nhập xuất hiện (input type email)
    await driver.wait(until.elementLocated(By.css('input[type="email"]')), 5000);

    // 2. Điền Email
    const emailInput = await driver.findElement(By.css('input[type="email"]'));
    // Nghỉ 1s trước khi gõ email
    await driver.sleep(1000);
    await emailInput.sendKeys('2005hhbao2005@gmail.com');

    // 3. Điền Password
    const passwordInput = await driver.findElement(By.css('input[type="password"]'));
    // Nghỉ 1s cho khán giả kịp nhìn email rồi mới gõ pass
    await driver.sleep(1000);
    await passwordInput.sendKeys('123456aA@');

    // 4. Click nút Log in
    const loginBtn = await driver.findElement(By.css('button[type="submit"]'));
    // Nghỉ 1s trước khi bấm nút
    await driver.sleep(1000);
    await loginBtn.click();
    console.log('Đã bấm nút Log in');

    // 5. Chờ kết quả hoặc url chuyển hướng
    // Trong file Login.jsx, khi thành công navigate("/dashboard")
    await driver.wait(until.urlContains('/dashboard'), 5000);
    console.log('Đăng nhập thành công, đã chuyển sang Dashboard!');

  } catch (error) {
    console.error('Lỗi khi chạy test:', error.message);
  } finally {
    // COMMENT LẠI ĐỂ TRÌNH DUYỆT KHÔNG BỊ TẮT NGAY
    // await driver.quit();
    console.log('--- Test hoàn tất (trình duyệt được giữ mở để quan sát) ---');
  }
}

testPubliCastLogin();
