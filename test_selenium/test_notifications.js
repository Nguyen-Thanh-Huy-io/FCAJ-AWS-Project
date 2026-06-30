const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const API_URL  = 'http://localhost:3000';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'test_cases', 'auth', 'screenshots');

// Tài khoản OWNER/ADMIN mới có quyền POST /api/notifications
const TEST_EMAIL    = 'trongphuc91thcsduclap@gmail.com';
const TEST_PASSWORD = '123456aA@';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function takeScreenshot(driver, fileName) {
  try {
    const image = await driver.takeScreenshot();
    const filePath = path.join(SCREENSHOT_DIR, fileName);
    fs.writeFileSync(filePath, image, 'base64');
    console.log(`📸 Đã lưu ảnh chụp màn hình: ${fileName}`);
  } catch (err) {
    console.error(`❌ Không thể chụp ảnh màn hình ${fileName}:`, err.message);
  }
}

async function runNotificationTest() {
  console.log("=========================================================");
  console.log("🚀 KHỞI ĐỘNG KIỂM THỬ THÔNG BÁO THỜI GIAN THỰC (SSE) 🚀");
  console.log("=========================================================");

  const options = new chrome.Options();
  if (process.env.CI) {
    options.addArguments('--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu');
  }

  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    // ── 1. Đăng nhập ──────────────────────────────────────────────────
    console.log(`👉 Truy cập trang đăng nhập: ${BASE_URL}/login`);
    await driver.get(`${BASE_URL}/login`);

    console.log("🧹 Xóa session cũ...");
    await driver.manage().deleteAllCookies();
    await driver.executeScript('window.localStorage.clear(); window.sessionStorage.clear();');
    await driver.navigate().refresh();

    console.log("🔍 Chờ form đăng nhập xuất hiện...");
    const emailInput    = await driver.wait(until.elementLocated(By.xpath("//input[@type='email']")), 8000);
    const passwordInput = await driver.findElement(By.xpath("//input[@type='password']"));
    const submitButton  = await driver.findElement(By.xpath("//button[@type='submit']"));

    console.log(`✍️ Điền tài khoản: '${TEST_EMAIL}'`);
    await emailInput.sendKeys(TEST_EMAIL);
    await passwordInput.sendKeys(TEST_PASSWORD);
    await takeScreenshot(driver, 'notif_001_fill_login.png');

    console.log("🖱️ Bấm nút đăng nhập...");
    await submitButton.click();

    console.log("⏳ Chờ chuyển hướng vào Dashboard...");
    await driver.wait(until.urlContains('/dashboard'), 12000);
    console.log("🎉 Đăng nhập thành công!");
    await takeScreenshot(driver, 'notif_002_dashboard.png');

    // ── 2. Lấy brandId đầu tiên của user hiện tại qua API ─────────────
    // FIX: Không hardcode ID – lấy động qua API
    console.log("📡 Lấy brand đầu tiên của user...");
    const brandResult = await driver.executeScript(async () => {
      const res = await fetch(`${window.location.origin.replace('5173', '3000')}/api/brands`, {
        credentials: 'include'
      });
      const json = await res.json();
      return { status: res.status, brandId: json?.data?.[0]?.id || null };
    });

    console.log("📊 Brand API:", JSON.stringify(brandResult));

    if (brandResult.status !== 200 || !brandResult.brandId) {
      throw new Error(`Không lấy được brandId. API status: ${brandResult.status}. Kiểm tra tài khoản có brand chưa.`);
    }
    const brandId = brandResult.brandId;
    console.log(`✅ Dùng brandId: ${brandId}`);

    // ── 3. Đi đến trang thông báo ──────────────────────────────────────
    console.log(`👉 Di chuyển sang trang thông báo: ${BASE_URL}/notifications`);
    await driver.get(`${BASE_URL}/notifications`);
    await driver.sleep(2000);
    await takeScreenshot(driver, 'notif_003_notifications_page.png');

    // ── 4. Tạo thông báo qua API ───────────────────────────────────────
    // FIX: Dùng brandId động, KHÔNG hardcode userId (backend tự lấy từ token)
    console.log("📡 Gửi POST /api/notifications để tạo thông báo test...");
    const creationResult = await driver.executeScript(async (bId) => {
      const res = await fetch(`${window.location.origin.replace('5173', '3000')}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: 'Livestream Alert E2E',
          message: 'Hệ thống phát hiện lỗi đường truyền livestream. Vui lòng kết nối lại.',
          type: 'stream',
          brandId: bId,
          isGlobal: false
        })
      });
      const text = await res.text();
      try { return { status: res.status, data: JSON.parse(text) }; }
      catch(e) { return { status: res.status, rawText: text }; }
    }, brandId);

    console.log("📊 Kết quả tạo notification:", JSON.stringify(creationResult));

    // FIX: Assert API thành công trước khi tiếp tục
    if (creationResult.status !== 201) {
      throw new Error(
        `Tạo notification thất bại! Status: ${creationResult.status}. ` +
        `Lý do: ${JSON.stringify(creationResult.data || creationResult.rawText)}. ` +
        `Kiểm tra: tài khoản có role OWNER/ADMIN không?`
      );
    }
    console.log("✅ Tạo notification thành công (HTTP 201)!");

    // ── 5. Chờ SSE auto-render thông báo trên UI ───────────────────────
    console.log("⏳ Chờ thông báo hiển thị qua SSE (tối đa 8 giây)...");
    const targetXPath = "//*[contains(text(), 'Livestream Alert E2E')]";
    await driver.wait(until.elementLocated(By.xpath(targetXPath)), 8000);
    console.log("🎉 THÀNH CÔNG: Thông báo đã tự động render trên UI qua SSE!");
    await takeScreenshot(driver, 'notif_004_realtime_received.png');

    // ── 6. Đánh dấu đã đọc bằng nút CheckCircle ───────────────────────
    // FIX: Tìm đúng nút CheckCircle (không phải action button)
    // Card chưa đọc có opacity:1 và có nút class "p-1 text-gray-300"
    console.log("🖱️ Tìm nút CheckCircle (đánh dấu đã đọc) trong card...");
    const notifCard = await driver.findElement(
      By.xpath(`//div[contains(., 'Livestream Alert E2E') and contains(@style, 'border-radius')]`)
    );
    // FIX: Tìm nút có class text-gray-300 (CheckCircle button), không lấy .//button[1] ngẫu nhiên
    const checkButton = await notifCard.findElement(
      By.xpath(".//button[contains(@class, 'text-gray-300') or contains(@class, 'p-1')]")
    );
    console.log("🖱️ Click nút đánh dấu đã đọc...");
    await checkButton.click();

    // ── 7. Assert opacity đổi thành 0.7 (UI state = đã đọc) ────────────
    // FIX: Không chỉ sleep mà assert thực sự UI đã thay đổi
    console.log("⏳ Kiểm chứng card notification đổi sang trạng thái đã đọc (opacity 0.7)...");
    await driver.sleep(1500);

    const opacityValue = await driver.executeScript(() => {
      // Tìm card chứa text 'Livestream Alert E2E'
      const cards = Array.from(document.querySelectorAll('div[style*="border-radius"]'));
      const card = cards.find(el => el.textContent.includes('Livestream Alert E2E'));
      if (!card) return null;
      return card.style.opacity;
    });

    console.log(`📊 Opacity của card sau khi mark read: "${opacityValue}"`);

    if (opacityValue !== '0.7') {
      throw new Error(
        `Assert thất bại: Card chưa đổi sang trạng thái đã đọc. ` +
        `Opacity hiện tại: "${opacityValue}" (kỳ vọng: "0.7").`
      );
    }

    console.log("✅ Assert PASS: Card đã chuyển sang opacity 0.7 (trạng thái đã đọc)!");
    await takeScreenshot(driver, 'notif_005_marked_as_read.png');
    console.log("✅ KẾT QUẢ: Kịch bản kiểm thử Thông báo thời gian thực ĐẠT (PASS)!");

  } catch (error) {
    console.error("❌ KẾT QUẢ: Kịch bản kiểm thử Thông báo THẤT BẠI (FAIL)!");
    console.error("Chi tiết lỗi:", error.message);
    try {
      const currentUrl = await driver.getCurrentUrl();
      console.log(`Current URL at failure: ${currentUrl}`);
      const pageSource = await driver.getPageSource();
      console.log(`Page source snippet: ${pageSource.slice(0, 1000)}`);
    } catch (e) {
      console.error("Could not retrieve page source:", e.message);
    }
    await takeScreenshot(driver, 'notif_failed.png');
    process.exitCode = 1;
  } finally {
    console.log("🧹 Đang đóng trình duyệt...");
    await driver.quit();
    console.log("=========================================================");
  }
}

runNotificationTest();
