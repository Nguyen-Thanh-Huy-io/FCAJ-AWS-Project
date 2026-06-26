const { Builder, By, Key, until } = require('selenium-webdriver');
const { createClient } = require('redis');

async function runLocalRegisterTest() {
  console.log("=========================================================");
  console.log("🚀 CHẠY TEST SELENIUM ĐĂNG KÝ + XÁC THỰC OTP (StreamHub)...");
  console.log("=========================================================");

  // Khởi tạo Redis client
  const redisClient = createClient({
    url: 'redis://127.0.0.1:6379'
  });

  redisClient.on('error', (err) => console.error('Redis Client Error', err));

  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // 1. Kết nối Redis
    console.log("🔌 Kết nối tới Redis server...");
    await redisClient.connect();

    const targetUrl = 'http://localhost:5173/signup';
    console.log(`👉 Đang truy cập URL: ${targetUrl}`);
    await driver.get(targetUrl);

    // Chờ form đăng ký xuất hiện
    console.log("🔍 Chờ form Đăng ký xuất hiện...");
    let nameInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Your name']")), 5000);
    let emailInput = await driver.findElement(By.xpath("//input[@placeholder='you@company.com']"));
    
    // Tìm các trường password bằng xpath
    let passwordInputs = await driver.findElements(By.xpath("//input[@type='password']"));
    let passwordInput = passwordInputs[0];
    let confirmPasswordInput = passwordInputs[1];
    
    let checkbox = await driver.findElement(By.xpath("//input[@type='checkbox']"));
    let submitButton = await driver.findElement(By.xpath("//button[@type='submit']"));

    console.log("✍️ Điền Tên: 'Selenium OTP Tester'");
    await nameInput.sendKeys('Selenium OTP Tester');

    // Tạo email test dạng gmail test với timestamp để tránh trùng lặp, không chứa dấu chấm
    const timestamp = Date.now();
    const testEmail = `publicasttestuser${timestamp}@gmail.com`;
    console.log(`✍️ Điền Email Test: '${testEmail}'`);
    await emailInput.sendKeys(testEmail);
    
    console.log("✍️ Điền mật khẩu: 'Password123!'");
    await passwordInput.sendKeys('Password123!');
    
    console.log("✍️ Điền xác nhận mật khẩu: 'Password123!'");
    await confirmPasswordInput.sendKeys('Password123!');

    console.log("🖱️ Tick vào ô đồng ý điều khoản dịch vụ...");
    await checkbox.click();

    console.log("🖱️ Bấm nút tạo tài khoản...");
    await submitButton.click();

    // 2. Đợi chuyển hướng sang trang Verify OTP
    console.log("⏳ Chờ hệ thống xử lý đăng ký và chuyển hướng sang trang OTP...");
    await driver.wait(until.urlContains('/verify-otp'), 5000);
    console.log("🎉 Đăng ký thành công, đã chuyển đến trang xác thực OTP!");

    // Đợi 2 giây để chắc chắn backend đã tạo và lưu OTP vào Redis
    console.log("⏳ Đang chờ 2 giây để mã OTP được lưu vào Redis...");
    await driver.sleep(2000);

    // 3. Lấy OTP từ Redis
    const redisKey = `otp:${testEmail}`;
    console.log(`🔍 Đang truy vấn OTP từ Redis với key: ${redisKey}`);
    const otp = await redisClient.get(redisKey);
    
    if (!otp) {
      throw new Error(`Không tìm thấy mã OTP cho email ${testEmail} trong Redis!`);
    }
    console.log(`🔑 Tìm thấy mã OTP trong Redis: ${otp}`);

    // 4. Nhập OTP vào form Verify OTP
    console.log("✍️ Điền mã OTP vào ô input...");
    let otpInput = await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='000000']")), 5000);
    await otpInput.sendKeys(otp);

    console.log("🖱️ Bấm nút Verify Code...");
    let verifyButton = await driver.findElement(By.xpath("//button[@type='submit']"));
    await verifyButton.click();

    // 5. Chờ hệ thống xác thực và chuyển hướng sang trang Onboarding /start hoặc /dashboard
    console.log("⏳ Chờ chuyển hướng sau khi xác thực thành công...");
    // Theo cấu trúc App.jsx và Login.jsx, verify thành công sẽ navigate("/start")
    await driver.wait(until.urlContains('/start'), 8000);
    console.log("🎉 Chuyển hướng thành công sang trang Onboarding (/start)!");
    console.log("✅ KẾT QUẢ: TOÀN BỘ LUỒNG ĐĂNG KÝ VÀ XÁC THỰC OTP BẰNG SELENIUM THÀNH CÔNG RỰC RỠ!");

  } catch (error) {
    console.error("❌ KẾT QUẢ: Kiểm thử thất bại!");
    console.error("Chi tiết lỗi:", error.message);
  } finally {
    // 6. Dọn dẹp
    console.log("🔌 Đóng kết nối Redis...");
    await redisClient.disconnect();
    
    console.log("🧹 Đang đóng trình duyệt...");
    await driver.quit();
    console.log("=========================================================");
  }
}

runLocalRegisterTest();
