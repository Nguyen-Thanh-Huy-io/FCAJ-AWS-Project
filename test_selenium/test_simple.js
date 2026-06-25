const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const { reportBugToJira } = require('./jira_helper');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'test_cases', 'auth', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Hàm hỗ trợ chụp màn hình và báo lỗi Jira
async function handleTestFailure(driver, testCaseName, error) {
  const fileName = `${testCaseName.toLowerCase()}_failed_${Date.now()}.png`;
  const filePath = path.join(SCREENSHOT_DIR, fileName);
  try {
    const image = await driver.takeScreenshot();
    fs.writeFileSync(filePath, image, 'base64');
    console.log(`📸 Đã lưu ảnh chụp màn hình lỗi: ${fileName}`);
  } catch (err) {
    console.error(`❌ Không thể chụp ảnh màn hình lỗi:`, err.message);
  }

  const description = `Kịch bản kiểm thử tự động ${testCaseName} thất bại.\n\nChi tiết lỗi: ${error.message}\n\nStack Trace:\n${error.stack}`;
  await reportBugToJira(testCaseName, description, fs.existsSync(filePath) ? filePath : null);
}

async function runSimpleTest() {
  console.log("🌐 Đang khởi động Trình duyệt Chrome...");
  const options = new chrome.Options();
  if (process.env.CI) {
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
  }
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    console.log(`👉 Truy cập trang chủ: ${BASE_URL}`);
    await driver.get(BASE_URL);

    // KỊCH BẢN GIẢ LẬP LỖI:
    // Cố ý kiểm tra tiêu đề trang web sai để kích hoạt lỗi và đẩy lên Jira
    console.log("⏳ Kiểm tra tiêu đề trang web...");
    const actualTitle = await driver.getTitle();
    console.log(`📄 Tiêu đề thực tế: "${actualTitle}"`);

    const expectedTitle = "StreamHub";
    if (actualTitle !== expectedTitle) {
      throw new Error(`AssertionError: Tiêu đề trang web không khớp! Kỳ vọng: "${expectedTitle}", Thực tế: "${actualTitle}"`);
    }

    console.log("✅ TEST CASE SIMPLE_001 ĐẠT (PASS)!");

  } catch (error) {
    console.error("❌ TEST CASE SIMPLE_001 THẤT BẠI (FAIL)!");
    console.error("Chi tiết lỗi:", error.message);
    await handleTestFailure(driver, 'SIMPLE_001', error);
    process.exitCode = 1; // Đánh dấu test suite thất bại để CI nhận diện
  } finally {
    console.log("🧹 Đang đóng trình duyệt...");
    await driver.quit();
  }
}

runSimpleTest();
