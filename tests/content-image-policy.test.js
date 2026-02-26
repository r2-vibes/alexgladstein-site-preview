const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'content-data.js'), 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(src, ctx);
const data = ctx.window.CONTENT_DATA;

const sections = ['books', 'essays', 'podcasts', 'press', 'interviews', 'talks'];
const offenders = [];
const missing = [];

const blockedImagePath = (img = '') => {
  const p = String(img || '').toLowerCase();
  return (
    p.includes('images/alex-speaking-') ||
    p.includes('images/email/') ||
    p.includes('/media/inbound/') ||
    p.startsWith('/users/') ||
    p.startsWith('file://')
  );
};

for (const sec of sections) {
  for (const bucket of ['featured', 'items']) {
    for (const item of data[sec][bucket] || []) {
      const img = item.image || '';
      if (blockedImagePath(img)) {
        offenders.push(`${sec}/${bucket}: ${item.title} -> ${img}`);
      }
      if (img.startsWith('images/')) {
        const abs = path.join(root, img);
        if (!fs.existsSync(abs)) {
          missing.push(`${sec}/${bucket}: ${item.title} -> ${img}`);
        }
      }
    }
  }
}

assert.strictEqual(offenders.length, 0, `Disallowed image sources found:\n${offenders.join('\n')}`);
assert.strictEqual(missing.length, 0, `Missing local image files found:\n${missing.join('\n')}`);

console.log('content-image-policy.test.js passed');
