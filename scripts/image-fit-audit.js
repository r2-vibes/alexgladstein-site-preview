#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'content-data.js');
const src = fs.readFileSync(dataPath, 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(src, ctx);
const data = ctx.window.CONTENT_DATA;

const targetRatio = 320 / 220; // feature image box aspect
const rows = [];

function sizeFor(imagePath) {
  try {
    const out = execSync(`sips -g pixelWidth -g pixelHeight "${path.join(root, imagePath)}"`, { encoding: 'utf8' });
    const w = Number((out.match(/pixelWidth: (\d+)/) || [])[1]);
    const h = Number((out.match(/pixelHeight: (\d+)/) || [])[1]);
    return { w, h };
  } catch {
    return null;
  }
}

for (const section of ['essays','podcasts','press','interviews','talks','books']) {
  for (const bucket of ['featured','items']) {
    for (const item of (data[section][bucket] || [])) {
      const img = item.image;
      if (!img || !img.startsWith('images/')) continue;
      const size = sizeFor(img);
      if (!size) continue;
      const ratio = size.w / size.h;
      const distortion = Math.abs(Math.log(ratio / targetRatio));
      const risk = distortion > 0.55 ? 'HIGH' : distortion > 0.30 ? 'MEDIUM' : 'LOW';
      rows.push({ section, bucket, title: item.title, img, w: size.w, h: size.h, ratio: ratio.toFixed(2), risk });
    }
  }
}

rows.sort((a,b)=> (a.risk < b.risk ? 1 : -1));
const outPath = path.join(root, 'IMAGE-FIT-REPORT.md');
const lines = [
  '# Image Fit Report',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  'Rule: feature cards use object-fit: contain with centered positioning to avoid crop loss.',
  '',
  '| Risk | Section | Bucket | Ratio | Image | Title |',
  '|---|---|---|---:|---|---|'
];
for (const r of rows.slice(0, 200)) {
  lines.push(`| ${r.risk} | ${r.section} | ${r.bucket} | ${r.ratio} | ${r.img} | ${r.title.replace(/\|/g,'/')} |`);
}
fs.writeFileSync(outPath, lines.join('\n'));
console.log(outPath);
