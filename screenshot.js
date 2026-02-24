const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.evaluate(() => sessionStorage.setItem('intro_shown', '1'));

  // Mobile — home
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:\\GitHub\\warning-machines.com\\screenshot-mobile-home.png' });

  // Mobile — nav open
  await page.click('.nav__hamburger');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'C:\\GitHub\\warning-machines.com\\screenshot-mobile-nav.png' });

  // Mobile — nav open with Services expanded
  await page.click('.nav__link--trigger');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:\\GitHub\\warning-machines.com\\screenshot-mobile-nav-services.png' });

  await browser.close();
})();
