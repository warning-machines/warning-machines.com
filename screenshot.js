const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.evaluate(() => sessionStorage.setItem('intro_shown', '1'));

  await page.goto('http://localhost:3000/about-us', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:\\GitHub\\warning-machines.com\\screenshot-about.png', fullPage: true });

  await browser.close();
})();
