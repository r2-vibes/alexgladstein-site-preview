const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'content-data.js'), 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(src, ctx);
const data = ctx.window.CONTENT_DATA;
const sections = ['books', 'essays', 'podcasts', 'talks', 'press', 'interviews'];

function normalizeTitle(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/[’‘]/g, "'")
    .replace(/\s*\((?:legacy archive|essay version|podcast version)\)\s*$/i, '')
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .toLowerCase();
}

function identity(item) {
  return String(item.canonicalUrl || item.link || '').replace(/\/$/, '') || normalizeTitle(item.title);
}

const errors = [];
const artworkOwners = new Map();
const sourceOwners = new Map();
const checkedDimensions = new Set();

function rasterDimensions(file) {
  const buffer = fs.readFileSync(file);
  if (buffer.toString('ascii', 1, 4) === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
      }
      offset += 2 + length;
    }
  }
  return null;
}

function imageDimensions(file) {
  if (file.endsWith('.svg')) {
    const svg = fs.readFileSync(file, 'utf8').slice(0, 1200);
    const width = Number(svg.match(/\bwidth=["'](\d+)/)?.[1]);
    const height = Number(svg.match(/\bheight=["'](\d+)/)?.[1]);
    return width && height ? { width, height } : null;
  }
  return rasterDimensions(file);
}

for (const section of sections) {
  const records = [...(data[section].featured || []), ...(data[section].items || [])];

  for (const item of records) {
    const ref = `${section}: ${item.title}`;
    if (!item.canonicalUrl || !/^https:\/\//.test(item.canonicalUrl)) errors.push(`${ref} has no canonicalUrl`);
    if (!item.image || !item.image.startsWith('images/')) errors.push(`${ref} has no local image`);
    if (!item.imageSource || !/^https:\/\//.test(item.imageSource)) errors.push(`${ref} has no imageSource`);
    if (!item.imageAlt || item.imageAlt.trim().length < 8) errors.push(`${ref} has weak imageAlt`);

    if (item.image && item.image.startsWith('images/')) {
      const absolute = path.join(root, item.image);
      if (!fs.existsSync(absolute)) {
        errors.push(`${ref} points to missing artwork ${item.image}`);
      } else if (fs.statSync(absolute).size > 1_000_000) {
        errors.push(`${ref} artwork exceeds 1 MB: ${item.image}`);
      }

      if (fs.existsSync(absolute) && !checkedDimensions.has(item.image)) {
        checkedDimensions.add(item.image);
        const dimensions = imageDimensions(absolute);
        if (!dimensions || dimensions.width < 300 || dimensions.height < 200) {
          errors.push(`${ref} has bad artwork dimensions: ${item.image} (${dimensions ? `${dimensions.width}x${dimensions.height}` : 'unknown'})`);
        }
      }

      const owner = artworkOwners.get(item.image);
      const currentIdentity = identity(item);
      if (owner && owner.identity !== currentIdentity && owner.title !== normalizeTitle(item.title)) {
        errors.push(`${ref} reuses ${item.image} from unrelated item "${owner.displayTitle}"`);
      } else if (!owner) {
        artworkOwners.set(item.image, {
          identity: currentIdentity,
          title: normalizeTitle(item.title),
          displayTitle: item.title
        });
      }
    }

    if (item.imageSource) {
      const owner = sourceOwners.get(item.imageSource);
      const currentIdentity = identity(item);
      if (owner && owner.identity !== currentIdentity && owner.title !== normalizeTitle(item.title)) {
        errors.push(`${ref} reuses source artwork from unrelated item "${owner.displayTitle}"`);
      } else if (!owner) {
        sourceOwners.set(item.imageSource, { identity: currentIdentity, title: normalizeTitle(item.title), displayTitle: item.title });
      }
    }
  }

  const canonicalUrls = new Map();
  for (const item of data[section].items || []) {
    const key = String(item.canonicalUrl || '').replace(/\/$/, '');
    if (canonicalUrls.has(key)) errors.push(`${section} duplicates canonical URL for "${item.title}" and "${canonicalUrls.get(key)}"`);
    else canonicalUrls.set(key, item.title);
  }
}

const essayTitles = new Map();
for (const item of data.essays.items || []) {
  const key = normalizeTitle(item.title);
  if (essayTitles.has(key)) {
    errors.push(`essays duplicates normalized title "${item.title}" and "${essayTitles.get(key)}"`);
  } else {
    essayTitles.set(key, item.title);
  }
}

const legacyRoundRobin = /fallbackPools|idx\s*%\s*pool\.length/;
for (const file of ['scripts/render-static-archives.js', 'content-pages.js']) {
  assert(!legacyRoundRobin.test(fs.readFileSync(path.join(root, file), 'utf8')),
    `${file} must not cycle a shared fallback pool by card index`);
}
assert.strictEqual(errors.length, 0, `Archive artwork integrity failures:\n${errors.join('\n')}`);

console.log('archive-artwork-integrity.test.js passed');
