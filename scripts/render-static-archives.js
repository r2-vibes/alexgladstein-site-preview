const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const pages = ['books', 'essays', 'podcasts', 'talks', 'press', 'interviews'];

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'content-data.js'), 'utf8'), sandbox);
const content = sandbox.window.CONTENT_DATA;

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(value = '') {
  return escapeHtml(value).replace(/`/g, '&#96;');
}

function normalizeDateLabel(raw = '') {
  const text = String(raw || '').trim();
  if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/.test(text)) return text;
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return text;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[Number(match[2]) - 1]} ${match[1]}`;
}

function formatMeta(item = {}) {
  const date = normalizeDateLabel(item.date || '');
  const outlet = String(item.outlet || '').trim();
  if (date && outlet) return `${date} · ${outlet}`;
  return date || outlet || '';
}

function isBlockedImagePath(img = '') {
  const p = String(img || '').toLowerCase();
  return (
    p.includes('images/alex-speaking-') ||
    p.includes('images/email/') ||
    p.includes('/media/inbound/') ||
    p.startsWith('/users/') ||
    p.startsWith('file://')
  );
}

function itemFallback(item = {}) {
  return item.fallbackImage || item.image || '';
}

function cardImage(item = {}) {
  const img = item && item.image ? item.image : '';
  if (!img || isBlockedImagePath(img)) return itemFallback(item);
  return img;
}

function archiveItems(featured = [], items = []) {
  const featuredRecords = new Set(featured.map((item) => item.canonicalUrl || item.link).filter(Boolean));
  return items.filter((item) => !featuredRecords.has(item.canonicalUrl || item.link));
}

function featuredMarkup(slug, items = []) {
  return items.map((item, idx) => `
        <article class="feature-card">
          <img class="catalog-image" src="${escapeAttr(cardImage(item))}" data-fallback="${escapeAttr(itemFallback(item))}" alt="${escapeAttr(item.imageAlt || item.title)}" loading="lazy" decoding="async" />
          <p class="meta">${escapeHtml(item.meta || '')}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.blurb || '')}</p>
          <div class="feature-foot">
            <span>${escapeHtml(item.tag || 'Priority Read')}</span>
            <a href="${escapeAttr(item.link)}" target="_blank" rel="noopener">Open ↗</a>
          </div>
        </article>`).join('');
}

function timelineMarkup(slug, items = []) {
  return items.map((item, idx) => `
        <article class="timeline-card">
          <img class="catalog-image" src="${escapeAttr(cardImage(item))}" data-fallback="${escapeAttr(itemFallback(item))}" alt="${escapeAttr(item.imageAlt || item.title)}" loading="lazy" decoding="async" />
          <p class="meta">${escapeHtml(formatMeta(item))}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.blurb || '')}</p>
          <a href="${escapeAttr(item.link)}" target="_blank" rel="noopener">Read more</a>
        </article>`).join('');
}

function replaceField(html, field, value) {
  const escaped = escapeHtml(value || '');
  return html
    .replace(new RegExp(`(<p class="mono" data-field="${field}">)[\\s\\S]*?(<\\/p>)`), `$1${escaped}$2`)
    .replace(new RegExp(`(<h1 data-field="${field}">)[\\s\\S]*?(<\\/h1>)`), `$1${escaped}$2`)
    .replace(new RegExp(`(<p class="lede" data-field="${field}">)[\\s\\S]*?(<\\/p>)`), `$1${escaped}$2`);
}

function replaceDivContent(html, className, content) {
  const openTag = `<div class="${className}">`;
  const start = html.indexOf(openTag);
  if (start === -1) throw new Error(`Could not find .${className}`);

  const contentStart = start + openTag.length;
  const divPattern = /<\/?div\b[^>]*>/g;
  divPattern.lastIndex = contentStart;

  let depth = 1;
  let match;
  while ((match = divPattern.exec(html))) {
    if (match[0].startsWith('</')) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return `${html.slice(0, contentStart)}${content}\n      ${html.slice(match.index)}`;
    }
  }

  throw new Error(`Could not find closing div for .${className}`);
}

pages.forEach((slug) => {
  const data = content[slug];
  if (!data) throw new Error(`Missing content data for ${slug}`);

  const file = path.join(root, `${slug}.html`);
  let html = fs.readFileSync(file, 'utf8');
  html = replaceField(html, 'label', data.label);
  html = replaceField(html, 'title', data.title);
  html = replaceField(html, 'subtitle', data.subtitle);
  html = replaceDivContent(html, 'featured-grid', featuredMarkup(slug, data.featured));
  html = replaceDivContent(html, 'timeline-grid', timelineMarkup(slug, archiveItems(data.featured, data.items)));
  fs.writeFileSync(file, html);
  console.log(`Rendered ${slug}.html`);
});
