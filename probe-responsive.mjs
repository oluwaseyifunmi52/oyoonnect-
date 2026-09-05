import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const widths = [320, 360, 375, 390, 414, 768, 1024, 1440];
const routes = ['/', '/community', '/jobs'];

for (const width of widths) {
  for (const route of routes) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    await page.goto('http://localhost:5173' + route, { waitUntil: 'networkidle0', timeout: 20000 });
    await new Promise(r => setTimeout(r, 1500));
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      return {
        scrollW: doc.scrollWidth,
        clientW: doc.clientWidth,
        bodyScrollW: body.scrollWidth,
        bodyClientW: body.clientWidth,
        overflowing: Array.from(document.querySelectorAll('*')).filter(el => {
          const r = el.getBoundingClientRect();
          return r.right > doc.clientWidth + 1;
        }).slice(0, 5).map(el => `${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 60)} @ ${el.getBoundingClientRect().right.toFixed(0)}`),
      };
    });
    console.log(`[${width}px] ${route}: scrollW=${overflow.scrollW}, clientW=${overflow.clientW}, overflow=${overflow.bodyScrollW - overflow.bodyClientW}px`);
    if (overflow.overflowing.length > 0) {
      console.log('  overflowing:', overflow.overflowing.join(' | '));
    }
    await page.close();
  }
}

await browser.close();