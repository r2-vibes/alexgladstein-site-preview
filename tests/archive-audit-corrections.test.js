const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'content-data.js'), 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context);
const data = context.window.CONTENT_DATA;

function item(section, title) {
  const match = [...(data[section].featured || []), ...(data[section].items || [])]
    .find((entry) => entry.title === title);
  assert(match, `Missing ${section} record: ${title}`);
  return match;
}

const expected = [
  ['press', 'Empowering Human Rights Through Bitcoin and Open Source Software', 'image', 'images/archive/press/press-forbes-empowering-human-rights-2024.png'],
  ['press', 'Bitcoin and Human Rights: A Common Ground for Activists Worldwide', 'image', 'images/archive/generated/interviews/bitcoin-and-human-rights-a-common-ground-for-act-1522c26f5f.jpg'],
  ['interviews', 'Human rights activist Alex Gladstein on Bitcoin’s role in the global south', 'image', 'images/archive/generated/interviews/human-rights-activist-alex-gladstein-on-bitcoin--13e8fad967.svg'],
  ['interviews', 'Human rights activist Alex Gladstein on Bitcoin’s role in the global south (Interview)', 'image', 'images/archive/generated/interviews/human-rights-activist-alex-gladstein-on-bitcoin--2ac47d7399.svg'],
  ['interviews', 'Is the Bitcoin Craze Coming for Your 401(k)?', 'image', 'images/archive/generated/interviews/is-the-bitcoin-craze-coming-for-your-401-k-5b946394fa.svg'],
  ['podcasts', 'Is Bitcoin Failing? Alex Gladstein vs. Paul Sztorc', 'image', 'images/archive/generated/podcasts/is-bitcoin-failing-alex-gladstein-vs-paul-sztorc-edf5bfc1be.jpg'],
  ['podcasts', 'BITCOIN: A TROJAN HORSE FOR FREEDOM w/ Alex Gladstein', 'image', 'images/archive/generated/podcasts/bitcoin-a-trojan-horse-for-freedom-w-alex-gladst-ecf25b3e1d.jpg'],
  ['interviews', 'Q&A: Bitcoin Versus Authoritarianism', 'link', 'https://web.archive.org/web/20231210050451/https://international.thenewslens.com/article/100499'],
  ['press', 'Why Dictators Love Development Statistics', 'outlet', 'The New Republic'],
  ['press', 'In China, It’s Blockchain and Tyranny vs. Bitcoin and Freedom', 'link', 'https://bitcoinmagazine.com/culture/op-ed-in-china-its-blockchain-and-tyranny-vs-bitcoin-and-freedom'],
  ['podcasts', 'The Bitcoin v Crypto War with Udi Wertheimer, Crypto Cobain, Alex Gladstein & Allen Farrington', 'link', 'https://www.youtube.com/watch?v=Ivmb5EoPa_w'],
  ['podcasts', 'The Bitcoin v Crypto War with Udi Wertheimer, Crypto Cobain, Alex Gladstein & Allen Farrington', 'imageSource', 'https://i.ytimg.com/vi/Ivmb5EoPa_w/hqdefault.jpg'],
  ['podcasts', 'Alex Gladstein, Lyn Alden, and Mark Moss at Bitcoin 2021 Miami', 'link', 'https://www.youtube.com/watch?v=dNjP9QP3tCo'],
  ['podcasts', 'Citadel Dispatch e0.2.8 – el salvador, china, and bitcoin with @gladstein', 'link', 'https://www.youtube.com/watch?v=nQThxlfLd3Q'],
  ['essays', 'Dissidents and Activists Have a Lot to Gain From Bitcoin, if Only They Knew It', 'link', 'https://web.archive.org/web/20210612224821/https://www.coindesk.com/dissidents-and-activists-have-a-lot-to-gain-from-bitcoin-if-only-they-knew-it']
];

for (const [section, title, field, value] of expected) {
  const record = item(section, title);
  assert.strictEqual(record[field], value, `${section}: ${title} has wrong ${field}`);
  if (field === 'link') assert.strictEqual(record.canonicalUrl, value, `${section}: ${title} has stale canonicalUrl`);
}

const newsLensRecords = [...data.interviews.featured, ...data.interviews.items]
  .filter((entry) => `${entry.meta || ''} ${entry.outlet || ''}`.toLowerCase().includes('news lens'));
assert.strictEqual(newsLensRecords.length, 1, `Expected exactly one News Lens interview record, found ${newsLensRecords.length}`);
assert.strictEqual(newsLensRecords[0].title, 'Q&A: Bitcoin Versus Authoritarianism');

assert(!source.includes('"outlet": "News Republic"'), 'Stale News Republic outlet label remains');
assert(!source.includes('artwork from News Republic'), 'Stale News Republic imageAlt remains');

for (const staleImage of [
  'images/archive/press/press-item-bitcoin-protecting-rights-world.jpg',
  'images/archive/press/press-item-quillette-can-governments-stop-bitcoin.png',
  'images/archive/interviews/interviews-coindesk-bitcoin-revolution-2021.jpg',
  'images/archive/interviews/interviews-reason-video-2021.jpg',
  'images/archive/podcasts/podcasts-wbd-bitcoin-human-rights-2024.jpg',
  'images/trojan-horse/4.jpg'
]) {
  assert(!source.includes(`"image": "${staleImage}"`), `Stale mismatched artwork remains assigned: ${staleImage}`);
}

console.log('archive-audit-corrections.test.js passed');
