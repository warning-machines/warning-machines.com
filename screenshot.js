const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext()).newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => sessionStorage.setItem('intro_shown', '1'));
  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Nav bar
  await page.screenshot({ path: 'C:\\GitHub\\warning-machines.com\\screenshot-nav-desktop.png', clip: { x: 0, y: 0, width: 1440, height: 72 } });

  // Footer
  const footer = await page.$('footer');
  await footer.screenshot({ path: 'C:\\GitHub\\warning-machines.com\\screenshot-footer.png' });

  await browser.close();
})();
