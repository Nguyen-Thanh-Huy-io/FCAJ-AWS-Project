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
  // Wait for React to render the login form
  await driver.wait(until.elementLocated(By.id('email')), 15000);
  await driver.findElement(By.id('email')).sendKeys(email);
  await driver.findElement(By.id('password')).sendKeys(password);
  await driver.findElement(By.css('button[type="submit"]')).click();
  // Wait for successful navigation after login, adjust as needed
  await driver.wait(until.urlContains('/dashboard'), 10000);
}

module.exports = { loginAs };
