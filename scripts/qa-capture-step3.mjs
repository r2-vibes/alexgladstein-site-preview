import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const outDir = 'screenshots/qa-step3-current';
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 2200 } });

async function shot(url, path, selector) {
  await page.goto(url, { waitUntil: 'networkidle' });
  if (selector) {
    const locator = page.locator(selector).first();
    await locator.waitFor({ state: 'visible', timeout: 15000 });
    await locator.screenshot({ path });
  } else {
    await page.screenshot({ path, fullPage: true });
  }
}

await shot('http://127.0.0.1:4173/index.html', `${outDir}/homepage-full.png`);
await shot('http://127.0.0.1:4173/index.html', `${outDir}/homepage-featured-focus.png`, '.feature-grid');
await shot('http://127.0.0.1:4173/books.html', `${outDir}/books-full.png`);
await shot('http://127.0.0.1:4173/books.html', `${outDir}/books-featured-focus.png`, '.featured-grid');
await shot('http://127.0.0.1:4173/books.html', `${outDir}/books-chronology-focus.png`, '.timeline-grid');
await shot('http://127.0.0.1:4173/interviews.html', `${outDir}/interviews-full.png`);
await shot('http://127.0.0.1:4173/interviews.html', `${outDir}/interviews-top-grid-focus.png`, '.featured-grid');

await browser.close();
console.log(outDir);
