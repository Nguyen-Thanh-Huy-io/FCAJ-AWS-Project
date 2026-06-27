const { Builder, By, until } = require('selenium-webdriver');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function loginAs(driver, role) {
  // Navigate to login page
  await driver.get(`${process.env.BASE_URL || 'http://localhost:5173'}/login`);
  const emailEnv = role.toUpperCase() + '_EMAIL';
  const passwordEnv = role.toUpperCase() + '_PASSWORD';
  const email = process.env[emailEnv] || '';
  const password = process.env[passwordEnv] || '';
  if (!email || !password) {
    throw new Error(`Missing credentials for role ${role}. Set ${emailEnv} and ${passwordEnv} in environment.`);
  }
  const { Key } = require('selenium-webdriver');
  // Wait for React to render the login form
  await driver.wait(until.elementLocated(By.id('email')), 15000);
  
  // Fill credentials with delay to ensure React state update
  await driver.findElement(By.id('email')).sendKeys(email);
  await driver.sleep(500);
  const passwordInput = await driver.findElement(By.id('password'));
  await passwordInput.sendKeys(password);
  await driver.sleep(500);
  
  // Submit by pressing ENTER on password field
  await passwordInput.sendKeys(Key.ENTER);
  // Wait for successful navigation after login, adjust as needed (allow /dashboard or /start onboarding page)
  try {
    await driver.wait(async () => {
      const currentUrl = await driver.getCurrentUrl();
      console.log(`[loginAs] Current URL on navigation check: ${currentUrl}`);
      return currentUrl.includes('/dashboard') || currentUrl.includes('/start') || currentUrl.includes('/manage/connections');
    }, 20000);
  } catch (err) {
    const finalUrl = await driver.getCurrentUrl();
    let bodyText = "";
    try {
      bodyText = await driver.findElement(By.css('body')).getText();
    } catch (_) {}
    console.error(`❌ [loginAs] Timeout waiting for redirection. Final URL: ${finalUrl}`);
    console.error(`❌ [loginAs] Visible body text: \n${bodyText.substring(0, 1000)}`);
    throw err;
  }
}

module.exports = { loginAs };
