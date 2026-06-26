const { Builder, By, Key, until } = require('selenium-webdriver');

async function searchGoogle() {
  // Khởi tạo driver Chrome
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Mở trang Google
    await driver.get('https://www.google.com');
    console.log('Da mo trang Google');

    // Tim o tim kiem
    let searchBox = await driver.findElement(By.name('q'));
    
    // Ngưng 1 giây trước khi gõ để mọi người kịp nhìn
    await driver.sleep(1000);
    
    // Chỉ gõ chữ trước, chưa bấm Enter vội
    await searchBox.sendKeys('Selenium WebDriver tutorial');
    
    // Ngưng 2 giây để khán giả đọc được chữ vừa gõ trên màn hình
    await driver.sleep(2000);
    
    // Bây giờ mới bấm phím Enter
    await searchBox.sendKeys(Key.RETURN);

    // Cho ket qua xuat hien (chờ tới khi tiêu đề trang có chữ Selenium)
    await driver.wait(until.titleContains('Selenium'), 5000);

    // Thay vì in tiêu đề (đôi khi Google trả về nguyên cái URL dài ngoằng), ta in câu thông báo gọn gàng
    console.log('--- Đã tìm kiếm thành công và tải xong trang kết quả! ---');

  } catch (error) {
    console.error('Lỗi khi chạy test:', error);
  } finally {
    // COMMENT LẠI ĐỂ TRÌNH DUYỆT KHÔNG BỊ TẮT NGAY
    // await driver.quit();
    console.log('--- Test hoàn tất (trình duyệt được giữ mở để quan sát) ---');
  }
}

searchGoogle();
