const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto('https://www.cases.design/work/elements', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Grab computed font sizes
  const sizes = await page.evaluate(() => {
    const getSize = (sel) => {
      const el = document.querySelector(sel);
      return el ? window.getComputedStyle(el).fontSize : 'not found';
    };
    // Try to find elements by their text content or role
    const allText = [...document.querySelectorAll('p, span, h1, h2')].slice(0, 40).map(el => ({
      tag: el.tagName,
      text: el.textContent.trim().slice(0, 60),
      fontSize: window.getComputedStyle(el).fontSize,
      fontWeight: window.getComputedStyle(el).fontWeight,
    }));
    return allText;
  });

  console.log(JSON.stringify(sizes, null, 2));

  await page.screenshot({ path: 'C:\\GitHub\\warning-machines.com\\screenshot-ref-top.png', clip: { x: 0, y: 0, width: 1440, height: 600 } });

  await browser.close();
})();
