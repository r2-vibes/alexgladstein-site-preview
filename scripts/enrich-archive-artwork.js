const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const dataFile = path.join(root, 'content-data.js');
const generatedRoot = path.join(root, 'images', 'archive', 'generated');
const sections = ['books', 'essays', 'podcasts', 'talks', 'press', 'interviews'];
const sectionLabels = {
  books: 'LIBRARY', essays: 'WRITING', podcasts: 'WATCH & LISTEN',
  talks: 'TALKS', press: 'PRESS', interviews: 'INTERVIEWS'
};
const outletAliases = new Map([
  ['Coindesk', 'CoinDesk'], ['Time Magazine', 'TIME'], ['Wired Magazine', 'WIRED'],
  ['Wired', 'WIRED'], ['alexgladstein.com', 'AlexGladstein.com']
]);

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(dataFile, 'utf8'), sandbox);
const content = sandbox.window.CONTENT_DATA;

function normalizeTitle(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/[’‘]/g, "'")
    .replace(/\s*\((?:legacy archive)\)\s*$/i, '')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase();
}

function canonicalScore(item) {
  let score = 0;
  if (!/web\.archive\.org/.test(item.link || '')) score += 10;
  if (item.image) score += 2;
  if (!/archived from legacy/i.test(item.blurb || '')) score += 1;
  return score;
}

function dedupeEssays(items = []) {
  const winners = new Map();
  for (const item of items) {
    const key = normalizeTitle(item.title);
    const winner = winners.get(key);
    if (!winner || canonicalScore(item) > canonicalScore(winner)) winners.set(key, item);
  }
  return items.filter((item) => winners.get(normalizeTitle(item.title)) === item);
}

function cleanRecord(item) {
  if (item.title) item.title = item.title.replace(/Priviledge/g, 'Privilege');
  if (item.outlet && outletAliases.has(item.outlet)) item.outlet = outletAliases.get(item.outlet);
  item.canonicalUrl = item.canonicalUrl || item.link;
  const outlet = item.outlet || String(item.meta || '').split('·')[0].trim() || 'Alex Gladstein';
  item.imageAlt = item.imageAlt || `${item.title} artwork from ${outlet}`;
  return item;
}

function hashFor(section, item) {
  return crypto.createHash('sha1')
    .update(`${section}\n${item.canonicalUrl || item.link}\n${item.title}`)
    .digest('hex').slice(0, 10);
}

function slugify(value = '') {
  return String(value).toLowerCase().normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'item';
}

function xml(value = '') {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function wrapTitle(title, max = 32, lines = 3) {
  const words = String(title).split(/\s+/);
  const result = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      result.push(line);
      line = word;
    } else line = next;
  }
  if (line) result.push(line);
  if (result.length > lines) {
    const kept = result.slice(0, lines);
    kept[lines - 1] = `${kept[lines - 1].slice(0, max - 1).trim()}…`;
    return kept;
  }
  return result;
}

function generatedCard(section, item) {
  const dir = path.join(generatedRoot, section);
  fs.mkdirSync(dir, { recursive: true });
  const base = `${slugify(item.title)}-${hashFor(section, item)}.svg`;
  const absolute = path.join(dir, base);
  const relative = path.relative(root, absolute).split(path.sep).join('/');
  const seed = Number.parseInt(hashFor(section, item).slice(0, 6), 16);
  const shift = seed % 260;
  const outlet = item.outlet || String(item.meta || '').split('·')[0].trim() || 'ALEX GLADSTEIN';
  const date = item.date || String(item.meta || '').split('·')[1]?.trim() || '';
  const lines = wrapTitle(item.title);
  const tspans = lines.map((line, index) =>
    `<tspan x="76" dy="${index === 0 ? 0 : 66}">${xml(line)}</tspan>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-labelledby="title desc">
  <title id="title">${xml(item.title)}</title>
  <desc id="desc">Branded ${xml(sectionLabels[section])} title card for ${xml(outlet)}</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#111214"/><stop offset="1" stop-color="#24272c"/></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#F7931A"/><stop offset="1" stop-color="#ffb34d"/></linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <circle cx="${970 + (shift % 120)}" cy="${40 + (shift % 100)}" r="260" fill="#F7931A" opacity=".12"/>
  <circle cx="${1040 - (shift % 80)}" cy="${560 - (shift % 110)}" r="170" fill="#F7931A" opacity=".07"/>
  <path d="M0 ${610 - (shift % 40)} L1200 ${470 + (shift % 80)} L1200 675 L0 675Z" fill="#F7931A" opacity=".08"/>
  <rect x="76" y="66" width="70" height="8" rx="4" fill="url(#accent)"/>
  <text x="76" y="118" fill="#F7931A" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="4">${xml(sectionLabels[section])}</text>
  <text x="76" y="245" fill="#fff" font-family="Georgia, Times New Roman, serif" font-size="54" font-weight="700">${tspans}</text>
  <text x="76" y="596" fill="#d8d9dc" font-family="Arial, Helvetica, sans-serif" font-size="23" letter-spacing="1">${xml(outlet.toUpperCase())}${date ? `  ·  ${xml(date)}` : ''}</text>
  <text x="1114" y="610" text-anchor="end" fill="#F7931A" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800">AG</text>
</svg>`;
  fs.writeFileSync(absolute, svg);
  return { absolute, relative };
}

function youtubeId(url = '') {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1).split('/')[0];
    if (/youtube\.com$/.test(parsed.hostname.replace(/^www\./, ''))) {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v');
      const match = parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/);
      if (match) return match[1];
    }
  } catch {}
  return null;
}

function attrs(tag) {
  const result = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) result[match[1].toLowerCase()] = match[3];
  return result;
}

function decodeEntities(value = '') {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

async function fetchWithTimeout(url, timeout = 9000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, {
      redirect: 'follow', signal: controller.signal,
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; AlexGladsteinArchive/1.0)' }
    });
  } finally { clearTimeout(timer); }
}

async function sourceArtwork(item) {
  const videoId = youtubeId(item.canonicalUrl);
  if (videoId) return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  if (/web\.archive\.org/.test(item.canonicalUrl || '')) return null;
  try {
    const response = await fetchWithTimeout(item.canonicalUrl);
    if (!response.ok || !String(response.headers.get('content-type')).includes('text/html')) return null;
    const html = (await response.text()).slice(0, 2_000_000);
    for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
      const values = attrs(match[0]);
      const key = (values.property || values.name || '').toLowerCase();
      if (['og:image', 'og:image:secure_url', 'twitter:image', 'twitter:image:src'].includes(key) && values.content) {
        return new URL(decodeEntities(values.content), response.url).href;
      }
    }
  } catch {}
  return null;
}

async function downloadOptimized(section, item, sourceUrl) {
  if (!sourceUrl) return null;
  const dir = path.join(generatedRoot, section);
  fs.mkdirSync(dir, { recursive: true });
  const stem = `${slugify(item.title)}-${hashFor(section, item)}`;
  const sourceFile = path.join(dir, `${stem}.source`);
  const outputFile = path.join(dir, `${stem}.jpg`);
  try {
    let response = await fetchWithTimeout(sourceUrl);
    if (!response.ok && /i\.ytimg\.com/.test(sourceUrl)) {
      response = await fetchWithTimeout(sourceUrl.replace('maxresdefault', 'hqdefault'));
      sourceUrl = sourceUrl.replace('maxresdefault', 'hqdefault');
    }
    if (!response.ok || !String(response.headers.get('content-type')).startsWith('image/')) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 2_000 || buffer.length > 15_000_000) return null;
    fs.writeFileSync(sourceFile, buffer);
    execFileSync('/usr/bin/sips', ['-Z', '1200', '-s', 'format', 'jpeg', '-s', 'formatOptions', '78', sourceFile, '--out', outputFile], { stdio: 'ignore' });
    if (!fs.existsSync(outputFile) || fs.statSync(outputFile).size < 2_000) return null;
    return { relative: path.relative(root, outputFile).split(path.sep).join('/'), sourceUrl };
  } catch {
    return null;
  } finally {
    if (fs.existsSync(sourceFile)) fs.unlinkSync(sourceFile);
  }
}

async function mapLimit(values, limit, fn) {
  let index = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (index < values.length) {
      const current = values[index++];
      await fn(current);
    }
  });
  await Promise.all(workers);
}

async function main() {
  content.essays.items = dedupeEssays(content.essays.items);
  const records = [];
  for (const section of sections) {
    for (const bucket of ['featured', 'items']) {
      for (const item of content[section][bucket] || []) records.push({ section, bucket, item: cleanRecord(item) });
    }
  }

  const existingOwners = new Map();
  for (const record of records) {
    const { section, item } = record;
    const card = generatedCard(section, item);
    record.fallback = card.relative;
    item.fallbackImage = card.relative;
    if (!item.image) continue;
    const owner = existingOwners.get(item.image);
    const sameItem = owner && (owner.item.canonicalUrl === item.canonicalUrl || normalizeTitle(owner.item.title) === normalizeTitle(item.title));
    const absolute = path.join(root, item.image);
    const tooLarge = fs.existsSync(absolute) && fs.statSync(absolute).size > 1_000_000;
    if ((owner && !sameItem) || !fs.existsSync(absolute) || tooLarge) item.image = '';
    else if (!owner) existingOwners.set(item.image, record);
    if (item.image) item.imageSource = item.imageSource || item.canonicalUrl;
  }

  let found = 0;
  let branded = 0;
  const needsArtwork = records.filter(({ item }) => !item.image);
  await mapLimit(needsArtwork, 8, async ({ section, item, fallback }) => {
    const sourceUrl = await sourceArtwork(item);
    const downloaded = await downloadOptimized(section, item, sourceUrl);
    if (downloaded) {
      item.image = downloaded.relative;
      item.imageSource = downloaded.sourceUrl;
      found += 1;
    } else {
      item.image = fallback;
      item.imageSource = item.canonicalUrl;
      branded += 1;
    }
  });

  fs.writeFileSync(dataFile, `window.CONTENT_DATA = ${JSON.stringify(content, null, 2)};\n`);
  console.log(`Enriched ${records.length} records: ${found} source artworks, ${branded} branded cards, ${records.length - needsArtwork.length} retained local artworks.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
