import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { chromium } from 'playwright';

const root = path.resolve(import.meta.dirname, '..');
const baseUrl = process.argv[2] || 'http://127.0.0.1:4173';
const output = path.join(root, 'screenshots', 'archive-repair-qa');
const pages = ['books', 'essays', 'podcasts', 'talks', 'press', 'interviews'];
const viewports = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 }
};

fs.mkdirSync(output, { recursive: true });
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'content-data.js'), 'utf8'), sandbox);
const content = sandbox.window.CONTENT_DATA;
const browser = await chromium.launch({ headless: true });
const failures = [];
const checks = [];

for (const [mode, viewport] of Object.entries(viewports)) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1, bypassCSP: true });
  const page = await context.newPage();
  page.on('pageerror', (error) => failures.push(`${mode}: page error: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) {
      failures.push(`${mode}: console error: ${message.text()}`);
    }
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && ['document', 'script', 'stylesheet'].includes(response.request().resourceType())) {
      failures.push(`${mode}: critical resource ${response.status()} ${response.url()}`);
    }
  });

  for (const slug of pages) {
    await page.goto(`${baseUrl}/${slug}.html`, { waitUntil: 'networkidle' });
    const totalPages = await page.locator('.page-indicator').evaluate((el) => Number(el.textContent.match(/of\s+(\d+)/)?.[1] || 1));

    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
      const visibleImages = await page.locator('.feature-card img, .timeline-card img').all();
      for (const image of visibleImages) await image.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => [...document.querySelectorAll('.feature-card img, .timeline-card img')]
        .filter((image) => image.offsetParent !== null)
        .every((image) => image.complete && image.naturalWidth > 0));
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForFunction(() => window.scrollY === 0);
      const result = await page.evaluate(() => {
        const cards = [...document.querySelectorAll('.feature-card, .timeline-card')].filter((card) => card.offsetParent !== null);
        const images = cards.map((card) => {
          const image = card.querySelector('.catalog-image');
          return {
            title: card.querySelector('h3')?.textContent.trim(),
            href: card.querySelector('a')?.href,
            src: image?.getAttribute('src'),
            complete: image?.complete,
            width: image?.naturalWidth,
            height: image?.naturalHeight
          };
        });
        const unrelatedDuplicates = [];
        const owners = new Map();
        for (const image of images) {
          if (owners.has(image.src) && owners.get(image.src).href !== image.href) unrelatedDuplicates.push(`${owners.get(image.src).title} / ${image.title}`);
          else owners.set(image.src, image);
        }
        return {
          broken: images.filter((image) => !image.complete || image.width < 200 || image.height < 150),
          unrelatedDuplicates,
          horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          cardCount: cards.length
        };
      });

      checks.push({ mode, slug, pageNumber, totalPages, ...result });
      if (result.broken.length) failures.push(`${mode} ${slug} page ${pageNumber}: broken/undersized images ${JSON.stringify(result.broken)}`);
      if (result.unrelatedDuplicates.length) failures.push(`${mode} ${slug} page ${pageNumber}: duplicate artwork ${result.unrelatedDuplicates.join('; ')}`);
      if (result.horizontalOverflow) failures.push(`${mode} ${slug} page ${pageNumber}: horizontal overflow`);

      if (pageNumber === 1) {
        await page.screenshot({ path: path.join(output, `${slug}-${mode}.png`), fullPage: true });
      }
      if (pageNumber < totalPages) {
        await page.locator('.pagination-next').click();
        await page.locator('.page-indicator').waitFor({ state: 'visible' });
        await page.waitForFunction((expected) => document.querySelector('.page-indicator')?.textContent.includes(`Page ${expected} `), pageNumber + 1);
      }
    }
  }
  await context.close();
}

const contactContext = await browser.newContext({ viewportSize: { width: 1440, height: 1000 } });
const contactPage = await contactContext.newPage();
for (const slug of pages) {
  const items = [...content[slug].featured, ...content[slug].items];
  const cards = items.map((item) => `<article><img src="${baseUrl}/${item.image}" alt=""><div><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.outlet || item.meta || '')}</small></div></article>`).join('');
  await contactPage.setContent(`<!doctype html><style>
    *{box-sizing:border-box}body{margin:0;padding:24px;background:#e9e9e7;font-family:Arial,sans-serif;color:#151515}
    h1{margin:0 0 20px;font-size:28px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
    article{background:#fff;border:1px solid #ccc;break-inside:avoid}img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block}
    div{padding:10px}b{display:block;font-size:13px;line-height:1.25}small{display:block;margin-top:5px;color:#666;font-size:11px}
  </style><h1>${slug.toUpperCase()} · ${items.length} CARDS</h1><section class="grid">${cards}</section>`, { waitUntil: 'networkidle' });
  await contactPage.screenshot({ path: path.join(output, `${slug}-contact-sheet.png`), fullPage: true });
}
await contactContext.close();
await browser.close();

fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify({ checks, failures }, null, 2));
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`QA passed: ${checks.length} desktop/mobile pagination states, ${pages.length * 2} full-page captures, ${pages.length} artwork contact sheets.`);
}

function escapeHtml(value = '') {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
