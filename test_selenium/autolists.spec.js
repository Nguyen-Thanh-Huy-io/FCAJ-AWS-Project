const path = require('path');
const { expect } = require('chai');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const mysql = require('mysql2/promise');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

describe('Autolists E2E UI Test Suite', function () {
  this.timeout(90000);
  let driver;
  let dbConnection;
  const uniqueQueueName = `E2E Autolist Test Queue - ${Date.now()}`;
  const uniquePostCaption = `Bài đăng Autolist đầu tiên từ E2E Test - ${Date.now()}`;

  async function safeClick(selector, timeout = 12000) {
    let attempts = 0;
    while (attempts < 3) {
      try {
        const element = await driver.wait(until.elementLocated(selector), timeout);
        await driver.wait(until.elementIsVisible(element), timeout);
        await element.click();
        return;
      } catch (err) {
        if (err.name === 'StaleElementReferenceError' || err.name === 'ElementClickInterceptedError') {
          attempts++;
          await driver.sleep(1200);
        } else {
          throw err;
        }
      }
    }
    const element = await driver.findElement(selector);
    await driver.executeScript("arguments[0].click();", element);
  }

  before(async function () {
    // 1. Kết nối DB để seed mock social accounts
    dbConnection = await mysql.createConnection(process.env.MYSQL_URL || 'mysql://root:root_password@localhost:3307/publicast');
    const email = process.env.ADMIN_EMAIL || 'vothanhnha26@gmail.com';
    const [users] = await dbConnection.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) throw new Error(`User not found: ${email}`);
    const userId = users[0].id;
    const [brands] = await dbConnection.execute('SELECT id FROM brands WHERE ownerId = ? OR id IN (SELECT brandId FROM teams WHERE userId = ?)', [userId, userId]);
    if (brands.length === 0) throw new Error(`Brand not found for user: ${email}`);
    const brandId = brands[0].id;

    // Chèn mock Facebook account
    const mockId = `mock-fb-social-account-id-${brandId}`;
    await dbConnection.execute('DELETE FROM social_accounts WHERE id = ?', [mockId]);
    const nowStr = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await dbConnection.execute(
      `INSERT INTO social_accounts (id, brandId, platform, platformAccountId, username, displayName, accessToken, scopes, isConnected, connectedAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [mockId, brandId, 'FACEBOOK', 'fb-123', 'mock_facebook_user', 'Mock Facebook', 'mock_token', 'mock_scopes', 1, nowStr, nowStr]
    );

    // 2. Khởi tạo Selenium Webdriver
    const options = new chrome.Options();
    if (process.env.CI || process.env.HEADLESS) {
      options.addArguments('--headless=new');
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
      options.addArguments('--disable-gpu');
    }
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    // 3. Đăng nhập
    const loginUrl = `${BASE_URL}/login`;
    await driver.get(loginUrl);
    const emailInput = await driver.wait(until.elementLocated(By.id('email')), 15000);
    const passwordInput = await driver.findElement(By.id('password'));
    const submitButton = await driver.findElement(By.xpath("//button[@type='submit']"));

    await emailInput.sendKeys(email);
    await driver.sleep(400);
    await passwordInput.sendKeys(process.env.ADMIN_PASSWORD || 'nhacc123@');
    await driver.sleep(400);
    await submitButton.click();

    // Chờ vào Dashboard
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return url.includes('/dashboard') || url.includes('/start') || url.includes('/manage/connections');
    }, 15000);
  });

  after(async function () {
    // Dọn dẹp dữ liệu test trong DB
    if (dbConnection) {
      console.log('🧹 Dọn dẹp dữ liệu kiểm thử Autolist E2E từ Database...');
      try {
        await dbConnection.execute('DELETE FROM posts WHERE caption = ?', [uniquePostCaption]);
        await dbConnection.execute('DELETE FROM auto_lists WHERE name = ?', [uniqueQueueName]);
      } catch (err) {
        console.error('❌ Lỗi dọn dẹp:', err.message);
      } finally {
        await dbConnection.end();
      }
    }
    if (driver) {
      await driver.quit();
    }
  });

  it('Verify Autolists UI Flow: Create, Configure, Insert Post, Save and List', async function () {
    // 1. Đi đến trang Autolists
    console.log('🔗 Điều hướng sang trang Autolists...');
    await driver.get(`${BASE_URL}/planner/autolists`);
    await driver.sleep(2000);

    // 2. Click nút Create autolist
    console.log('➕ Bấm nút "Create autolist" để mở Form...');
    await safeClick(By.xpath("//button[contains(., 'Create autolist')]"));
    await driver.sleep(2000);

    // 3. Điền tên Autolist
    console.log('✍️ Điền tên hàng đợi Autolist...');
    const nameInput = await driver.wait(
      until.elementLocated(By.css('input[placeholder="Enter queue name..."]')),
      12000
    );
    await nameInput.clear();
    await nameInput.sendKeys(uniqueQueueName);

    // 4. Chọn platform Facebook (mặc định đã được chọn hoặc click chọn)
    console.log('🌐 Chọn nền tảng Facebook...');
    const fbBtn = await driver.findElement(By.xpath("//button[contains(., 'Facebook')]"));
    const fbClass = await fbBtn.getAttribute('class');
    if (!fbClass.includes('bg-gray-100')) {
      await safeClick(By.xpath("//button[contains(., 'Facebook')]"));
    }

    // 5. Điều chỉnh timing: Nhập số phút Interval (120 phút)
    console.log('⏱️ Cấu hình khoảng cách đăng bài (Interval): 120 phút...');
    const intervalInput = await driver.wait(
      until.elementLocated(By.css('input[type="number"]')),
      12000
    );
    await intervalInput.clear();
    await intervalInput.sendKeys('120');

    // 6. Click Create queue
    console.log('💾 Lưu cấu hình Autolist...');
    await safeClick(By.xpath("//button[contains(., 'Create queue')]"));
    await driver.sleep(4000); // Chờ điều hướng sang trang Edit Autolist

    // 7. Xác nhận đã vào trang Edit Autolist (Header có text Edit autolist)
    const headerTitle = await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Edit autolist')]")),
      15000
    );
    expect(headerTitle).to.exist;

    // 8. Bấm nút chèn bài viết đầu tiên
    console.log('📝 Bấm nút "Add your first post" để thêm bài đăng nháp...');
    await safeClick(By.xpath("//button[contains(., 'Add your first post')]"));
    await driver.sleep(2000);

    // 9. Điền caption cho bài viết nháp
    console.log('✍️ Viết nội dung caption bài đăng nháp...');
    const textarea = await driver.wait(
      until.elementLocated(By.css('textarea[placeholder="Write what you want to share..."]')),
      12000
    );
    await textarea.clear();
    await textarea.sendKeys(uniquePostCaption);
    await driver.sleep(1000);

    // Trigger blur bằng JavaScript để kích hoạt sự kiện onBlur lưu caption
    await driver.executeScript("arguments[0].blur();", textarea);
    await driver.sleep(1500);

    // 10. Click Save settings ở header để lưu toàn bộ thay đổi
    console.log('💾 Click "Save settings" để lưu toàn bộ hàng đợi...');
    await safeClick(By.xpath("//button[contains(., 'Save settings')]"));
    await driver.sleep(3000);

    // 11. Quay lại trang danh sách Autolists để xác nhận Autolist hiển thị trên UI
    console.log('📋 Trở lại danh sách Autolists để xác nhận...');
    await driver.get(`${BASE_URL}/planner/autolists`);
    await driver.sleep(3000);

    // Kiểm tra hàng đợi có tên uniqueQueueName xuất hiện trong danh sách
    const queueCardTitle = await driver.wait(
      until.elementLocated(By.xpath(`//h3[contains(text(), '${uniqueQueueName}')]`)),
      15000
    );
    expect(queueCardTitle).to.exist;
    console.log(`✅ Thành công! Hàng đợi Autolist "${uniqueQueueName}" đã được tạo, xếp lịch bài đăng và hiển thị trên giao diện!`);
  });
});
