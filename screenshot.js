const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.evaluate(() => sessionStorage.setItem('intro_shown', '1'));

  await page.goto('http://localhost:3000/services/electronics', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  await page.screenshot({ path: 'C:\\GitHub\\warning-machines.com\\screenshot-elec-top.png' });

  // Scroll to work examples area
  await page.evaluate(() => window.scrollTo(0, 2200));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:\\GitHub\\warning-machines.com\\screenshot-elec-process.png' });

  // Scroll further to see more process steps
  await page.evaluate(() => window.scrollTo(0, 3200));
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:\\GitHub\\warning-machines.com\\screenshot-elec-process2.png' });

  await browser.close();
})();
