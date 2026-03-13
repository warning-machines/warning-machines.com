const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ args: ['--disable-cache'] });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(() => sessionStorage.setItem('intro_shown', '1'));
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/GitHub/warning-machines.com/screenshot-home.png', fullPage: false });

  await page.goto('http://localhost:3000/services/electronics', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/GitHub/warning-machines.com/screenshot-svc-electronics.png', fullPage: false });

  await browser.close();
})();
