#!/usr/bin/env node
/**
 * Minimal imagery pipeline for archive items.
 * Usage:
 *   node scripts/image-pipeline.js --url "https://..." --slug "lex-fridman-231" --type podcast
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const url = arg('url');
const slug = arg('slug', `item-${Date.now()}`);
const type = arg('type', 'misc');
const outDir = arg('outDir', path.join(process.cwd(), 'images', 'archive', type));

if (!url) {
  console.error('Missing --url');
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

function fetchText(target) {
  return new Promise((resolve, reject) => {
    const lib = target.startsWith('https') ? https : http;
    lib.get(target, { headers: { 'User-Agent': 'Mozilla/5.0 OpenClaw Image Pipeline' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchText(new URL(res.headers.location, target).toString()));
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${target}`));
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractOgImage(html) {
  const m = html.match(/<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']og:image["'][^>]*>/i)
    || html.match(/<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function youtubeThumbFromUrl(u) {
  try {
    const parsed = new URL(u);
    let id = null;
    if (parsed.hostname.includes('youtube.com')) id = parsed.searchParams.get('v');
    if (parsed.hostname === 'youtu.be') id = parsed.pathname.slice(1);
    return id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : null;
  } catch {
    return null;
  }
}

function downloadFile(fileUrl, outPath) {
  return new Promise((resolve, reject) => {
    const lib = fileUrl.startsWith('https') ? https : http;
    lib.get(fileUrl, { headers: { 'User-Agent': 'Mozilla/5.0 OpenClaw Image Pipeline' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadFile(new URL(res.headers.location, fileUrl).toString(), outPath));
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for image ${fileUrl}`));
      const ext = (res.headers['content-type'] || '').includes('png') ? '.png' : '.jpg';
      const finalPath = outPath.endsWith(ext) ? outPath : outPath.replace(/\.[a-z]+$/i, '') + ext;
      const ws = fs.createWriteStream(finalPath);
      res.pipe(ws);
      ws.on('finish', () => resolve(finalPath));
      ws.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  const yt = youtubeThumbFromUrl(url);
  let imageUrl = yt;
  let source = yt ? 'youtube-derived' : 'og:image';

  if (!imageUrl) {
    const html = await fetchText(url);
    imageUrl = extractOgImage(html);
    if (!imageUrl) throw new Error('No og:image/twitter:image found');
    imageUrl = new URL(imageUrl, url).toString();
  }

  const outBase = path.join(outDir, `${slug}.jpg`);
  const downloaded = await downloadFile(imageUrl, outBase);

  const manifestPath = path.join(process.cwd(), 'images', 'archive', 'manifest.json');
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  let manifest = [];
  if (fs.existsSync(manifestPath)) {
    try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch {}
  }

  const rel = path.relative(process.cwd(), downloaded).replace(/\\/g, '/');
  manifest = manifest.filter((m) => m.slug !== slug);
  manifest.push({ slug, type, pageUrl: url, imageUrl, localPath: rel, source, updatedAt: new Date().toISOString() });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(JSON.stringify({ ok: true, slug, type, pageUrl: url, imageUrl, localPath: rel, source }, null, 2));
})().catch((e) => {
  console.error(e.message || String(e));
  process.exit(1);
});
