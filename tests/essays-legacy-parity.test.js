const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'content-data.js'), 'utf8');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox);

const essays = sandbox.window.CONTENT_DATA.essays.items;
assert(Array.isArray(essays), 'essays.items should be an array');

const legacyEssays = [
  { title: 'Currency Of Last Resort', link: 'https://bitcoinmagazine.com/culture/currency-of-last-resort' },
  { title: 'Can Fedimints Help Bitcoin Scale To The World?', link: 'https://bitcoinmagazine.com/culture/will-fedimints-bring-bitcoin-to-the-world' },
  { title: 'Structural Adjustment: How The IMF And World Bank Repress Poor Countries And Funnel Their Resources To Rich Ones', link: 'https://bitcoinmagazine.com/culture/imf-world-bank-repress-poor-countries' },
  { title: 'The End of Super Imperialism', link: 'https://bitcoinmagazine.com/culture/bitcoin-replacing-us-super-imperialism' },
  { title: 'The Quest for Digital Cash', link: 'https://bitcoinmagazine.com/culture/bitcoin-adam-back-and-digital-cash' },
  { title: 'Bitcoin And The American Idea', link: 'https://bitcoinmagazine.com/culture/bitcoin-and-the-american-idea' },
  { title: 'Fighting Monetary Colonialism With Open-Source Code', link: 'https://bitcoinmagazine.com/culture/bitcoin-a-currency-of-decolonization' },
  { title: 'Inside Cuba’s Bitcoin Revolution', link: 'https://bitcoinmagazine.com/culture/cubas-bitcoin-revolution' },
  { title: 'Can Bitcoin Be Palestine’s Currency Of Freedom?', link: 'https://bitcoinmagazine.com/culture/can-bitcoin-bring-palestine-freedom' },
  { title: 'The Village and the Strongman: the Unlikely Story of Bitcoin and El Salvador', link: 'https://bitcoinmagazine.com/culture/the-polarity-of-bitcoin-in-el-salvador' },
  { title: 'Finding Financial Freedom In Afghanistan', link: 'https://bitcoinmagazine.com/culture/bitcoin-financial-freedom-in-afghanistan' },
  { title: 'The Humanitarian And Environmental Case For Bitcoin', link: 'https://bitcoinmagazine.com/culture/bitcoin-is-humanitarian-and-environmental' },
  { title: 'Check your Financial Priviledge', link: 'https://bitcoinmagazine.com/culture/check-your-financial-privilege' },
  { title: 'The Hidden Costs of the Petrodollar', link: 'https://bitcoinmagazine.com/culture/the-hidden-costs-of-the-petrodollar' },
  { title: 'Bitcoin is a Trojan Horse for Freedom', link: 'https://bitcoinmagazine.com/culture/bitcoin-is-a-trojan-horse-for-freedom' },
  { title: 'Can Governments Stop Bitcoin?', link: 'https://quillette.com/2021/02/21/can-governments-stop-bitcoin/' },
  { title: 'In the Fight Against Extremism, Don’t Demonize Surveillance-Busting Tools like Signal and Bitcoin', link: 'https://time.com/5933380/signal-bitcoin-extremism-democracy/' },
  { title: 'COVID-19 and the Normalization of Mass Surveillance', link: 'https://quillette.com/2020/05/11/covid-19-and-the-normalization-of-mass-surveillance/' },
  { title: 'Dictatorships Are Making the Coronavirus Outbreak Worse', link: 'https://www.wired.com/story/opinion-dictatorships-are-making-the-coronavirus-outbreak-worse/' },
  { title: 'A World Without Bitcoin', link: 'https://unchainedpodcast.com/alex-gladstein-on-a-world-without-bitcoin/' },
  { title: 'A Human Rights Activist Explains Bitcoin’s Importance', link: 'https://www.bloomberg.com/news/articles/2019-12-23/a-human-rights-activist-explains-why-bitcoin-is-so-important-to-his-work' },
  { title: 'How Bitcoin Can Protect Free Speech in the Digital Age', link: 'https://quillette.com/2019/12/17/how-bitcoin-can-protect-free-speech-in-the-digital-age/' },
  { title: 'Dissidents and Activists Have a Lot to Gain From Bitcoin, if Only They Knew It', link: 'https://www.coindesk.com/dissidents-and-activists-have-a-lot-to-gain-from-bitcoin-if-only-they-knew-it' },
  { title: 'In China, it’s Blockchain and Tyranny vs Bitcoin and Freedom', link: 'https://bitcoinmagazine.com/culture/op-ed-in-china-its-blockchain-and-tyranny-vs-bitcoin-and-freedom' },
  { title: 'The Moral Case for Lightning: A Global Private Payment Network', link: 'https://gladstein.medium.com/the-moral-case-for-lightning-a-global-private-payment-network-9b232019a75b' },
  { title: 'Bitcoin could change the game for foreign aid', link: 'https://www.cnn.com/2019/05/23/perspectives/bitcoin-foreign-aid/index.html' },
  { title: 'Why Bitcoin Matters for Freedom', link: 'https://time.com/5486673/bitcoin-venezuela-authoritarian/' },
  { title: 'The Kim-Trump Summit Is a Tragedy for the North Korean People', link: 'https://time.com/5287046/kim-trump-peace-talks-tragedy-north-korea/' },
  { title: 'How the UN’s Sustainable Development Goals undermine democracy', link: 'https://qz.com/africa/1299149/how-the-uns-sustainable-development-goals-undermine-democracy/' }
];

const essayByLink = new Map(essays.map((item) => [item.link, item]));
const missing = legacyEssays.filter((legacy) => !essayByLink.has(legacy.link));
assert.deepStrictEqual(missing, [], `Missing legacy essays: ${missing.map((m) => m.title).join(', ')}`);

legacyEssays.forEach((legacy) => {
  const found = essayByLink.get(legacy.link);
  assert(found.title && found.title.trim().length > 0, `Legacy essay should have title for ${legacy.link}`);
  assert(found.date && found.date.trim().length > 0, `Legacy essay should have date for ${legacy.link}`);
  assert(found.outlet && found.outlet.trim().length > 0, `Legacy essay should have outlet for ${legacy.link}`);
});

console.log('essays-legacy-parity.test.js passed');
