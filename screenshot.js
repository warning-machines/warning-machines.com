const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.evaluate(() => sessionStorage.setItem('intro_shown', '1'));

  // Desktop — products list
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:\\GIT\\warning-machines.com\\screenshot-products-desktop.png', fullPage: true });

  // Desktop — product detail
  await page.goto('http://localhost:3000/products/1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:\\GIT\\warning-machines.com\\screenshot-product-detail.png', fullPage: true });

  // Mobile — products list
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3000/products', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:\\GIT\\warning-machines.com\\screenshot-mobile-products.png', fullPage: true });

  // Mobile — product detail
  await page.goto('http://localhost:3000/products/1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:\\GIT\\warning-machines.com\\screenshot-mobile-product-detail.png', fullPage: true });

  await browser.close();
})();
