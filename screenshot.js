const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Mobile viewport (375px - iPhone SE)
  await page.setViewportSize({ width: 375, height: 812 });

  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.evaluate(() => sessionStorage.setItem('intro_shown', '1'));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:\\GIT\\warning-machines.com\\screenshot-mobile-home.png', fullPage: true });

  await page.goto('http://localhost:3000/services/electronics', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:\\GIT\\warning-machines.com\\screenshot-mobile-electronics.png', fullPage: true });

  await page.goto('http://localhost:3000/services/firmware', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:\\GIT\\warning-machines.com\\screenshot-mobile-firmware.png', fullPage: true });

  await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:\\GIT\\warning-machines.com\\screenshot-mobile-products.png', fullPage: true });

  await page.goto('http://localhost:3000/services/cad', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:\\GIT\\warning-machines.com\\screenshot-mobile-cad.png', fullPage: true });

  await page.goto('http://localhost:3000/about-us', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:\\GIT\\warning-machines.com\\screenshot-mobile-about.png', fullPage: true });

  await browser.close();
})();
