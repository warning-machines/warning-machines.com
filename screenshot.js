const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.evaluate(() => sessionStorage.setItem('intro_shown', '1'));

  await page.goto('http://localhost:3000/services/electronics', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:\\GitHub\\warning-machines.com\\screenshot-electronics.png' });

  await browser.close();
})();
