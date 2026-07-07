const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const files = [
  'content-data.js',
  'index.html',
  'books.html',
  'essays.html',
  'podcasts.html',
  'talks.html',
  'press.html',
  'interviews.html',
];

const blockedUrls = [
  'https://store.bitcoinmagazine.com/products/a-trojan-horse-for-freedom',
  'https://www.whatbitcoindid.com/podcast/bitcoin-human-rights',
  'https://thelittlebitcoinbook.com/',
];

for (const file of files) {
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const url of blockedUrls) {
    assert(!text.includes(url), `${file} should not contain known dead URL ${url}`);
  }
}

const contentData = fs.readFileSync(path.join(root, 'content-data.js'), 'utf8');
assert(
  !/"link":\s*"https:\/\/alexgladstein\.com\//.test(contentData),
  'Legacy alexgladstein.com deep links should use archived URLs instead of redirecting to the homepage'
);

console.log('link-health-regression.test.js passed');
