const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const data = fs.readFileSync(path.join(root, 'content-data.js'), 'utf8');

const deadTrojanStore = 'https://store.bitcoinmagazine.com/products/a-trojan-horse-for-freedom';
const oldWbdHumanRights = 'https://www.whatbitcoindid.com/podcast/bitcoin-human-rights';
const reasonHumanRights = 'https://reason.com/video/2021/02/05/bitcoin-is-protecting-human-rights-around-the-world/';
const deadLittleBitcoinBook = 'https://thelittlebitcoinbook.com/';

assert(!html.includes(deadTrojanStore), 'Homepage should not link to the dead Trojan Horse store product');
assert(!data.includes(deadTrojanStore), 'Featured data should not retain the dead Trojan Horse store product');
assert(!data.includes(deadLittleBitcoinBook), 'Books data should not link to the dead Little Bitcoin Book domain');
assert(!html.includes(oldWbdHumanRights), 'Start Here should not feature the WBD/Natalie Smolenski episode');

assert(html.includes('Bitcoin Is Protecting Human Rights Around the World'), 'Start Here item 03 should feature the 2021 Reason human-rights piece');
assert(html.includes(reasonHumanRights), 'Start Here item 03 should link to the 2021 Reason human-rights piece');
assert(data.includes(reasonHumanRights), 'Content data should retain the 2021 Reason human-rights piece');

assert(
  /<span class="start-index">02<\/span><span class="start-title">Bitcoin is a Trojan Horse for Freedom<\/span>/.test(html),
  'Start Here item 02 should be the Trojan Horse essay, not a dead product page'
);
assert(
  /<span class="start-index">03<\/span><span class="start-title">Bitcoin Is Protecting Human Rights Around the World<\/span>/.test(html),
  'Start Here item 03 should be the Reason 2021 human-rights piece'
);

console.log('start-here-links.test.js passed');
