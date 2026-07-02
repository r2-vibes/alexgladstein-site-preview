const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'content-data.js'), 'utf8'), sandbox);

const podcasts = sandbox.window.CONTENT_DATA.podcasts.items;
const expectedTitles = [
  'TFTC #147: Alex Gladstein',
  'Bitcoin Vs Altcoins 2 with Alex Gladstein & Erik Voorhees',
  'The Bitcoin v Crypto War with Udi Wertheimer, Crypto Cobain, Alex Gladstein & Allen Farrington',
  'TFTC #313: The Financial Costs of War with Alex Gladstein',
  'TFTC #406: Debt-Based Colonialism and Structural Adjustment with Alex Gladstein',
  'BTC029: Jack Dorsey’s Involvement in Bitcoin & Jack Mallers’ El Salvador Announcement',
  'BTC120: Preston’s Top 5 Bitcoin Fundamental Moments',
  'BTC169: Bitcoin Changing Africa’s Energy and Finance Incentives',
  'WBD751: Bitcoin, a 30,000ft View with Jeff Booth & Alex Gladstein',
  'WBD797: The Ultimate Bitcoin Use Cases with Alex Gladstein',
  'Bitcoin Is the Third Way with Alex Gladstein',
  'Alex Gladstein on Argentina’s Bitcoin Adoption',
  'Bitcoin: A Shield Against Financial Exploitation',
  'Alex Gladstein: How Bitcoin Protects Human Rights',
  'Bitcoin Fixes This #88: Financial Privilege with Alex Gladstein',
  'Exit Strategy #005: Alex Gladstein on Bitcoin and Human Rights',
  'Blue Collar Bitcoin #026: Bitcoin, Freedom & Human Rights',
  'Bitcoin’s Role in the War on Cash with Mike Green & Alex Gladstein',
  'Alex Gladstein: Bitcoin Fixes Democracy'
];

expectedTitles.forEach((title) => {
  assert(
    podcasts.some((item) => item.title === title),
    `podcasts should include missing appearance: ${title}`
  );
});

const links = new Set();
podcasts.forEach((item) => {
  assert(item.link, `${item.title} should have a canonical link`);
  assert(!links.has(item.link), `${item.title} should not duplicate an existing podcast link`);
  links.add(item.link);
});

console.log('podcast-completeness-sweep.test.js passed');
