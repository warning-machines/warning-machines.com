const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ args: ['--disable-cache'] });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(() => sessionStorage.setItem('intro_shown', '1'));
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/GitHub/warning-machines.com/screenshot-home-mobile.png', fullPage: false });

  const services = ['electronics', 'firmware', 'cnc', 'cad', '3d-printing'];
  for (const svc of services) {
    await page.goto(`http://localhost:3000/services/${svc}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: `C:/GitHub/warning-machines.com/screenshot-svc-${svc}-mobile.png`, fullPage: false });
  }

  await browser.close();
})();
