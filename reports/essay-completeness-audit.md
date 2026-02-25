# Essay Completeness Audit (Final)

Generated: 2026-02-24 (PST)
Scope: `content-data.js` essay inventory vs. (a) legacy archive scrape, (b) local parity docs, and (c) web-discovered Alex Gladstein essays/op-eds.

## Method & Sources
- Legacy scrape: `legacy-scrape/https:__alexgladstein_wordpress_com_essays_.html`
- Local parity/docs: `ESSAYS-LEGACY-PARITY.md`, `legacy-scrape/parity-report.md`, `content-database.md`
- Web discovery: Brave search queries for TIME / Atlantic / Foreign Policy / Reason / Bitcoin Magazine bylines
- Note: direct fetch of `alexgladstein.org` failed at audit time, so `.com` legacy scrape + parity docs were used as primary historical source.

## Snapshot
- Legacy essays discovered: **29**
- Legacy essays represented in current dataset: **29/29** (per parity docs and spot-check)
- Current `content-data.js` essays inventory: **61** entries (featured + items)
- Net result: strong legacy coverage, with a handful of canonical-link confidence issues and some newer Reason essays missing.

## FOUND
| Publication | Date | Title | URL | Suggested Imagery Source |
|---|---|---|---|---|
| Bitcoin Magazine | 2022-05-04 | Currency Of Last Resort | https://bitcoinmagazine.com/culture/currency-of-last-resort | Legacy WordPress hero image (`wp-content/uploads/2023/05/20220506_btcfinal_russia_ukraine_gladstein.png`) |
| Bitcoin Magazine | 2021-04-15 | Bitcoin is a Trojan Horse for Freedom | https://bitcoinmagazine.com/culture/bitcoin-is-a-trojan-horse-for-freedom | Existing local Trojan Horse artwork (`images/trojan-horse/*`) |
| TIME | 2018-12-28 | Why Bitcoin Matters for Freedom | https://time.com/5486673/bitcoin-venezuela-authoritarian/ | `images/archive/press/press-featured-time-bitcoin-matters-freedom.jpg` |
| Journal of Democracy | 2025 | Why Bitcoin Is Freedom Money | https://www.journalofdemocracy.org/articles/why-bitcoin-is-freedom-money/ | Journal of Democracy article hero image / issue cover |
| Quillette | 2020-05-11 | COVID-19 and the Normalization of Mass Surveillance | https://quillette.com/2020/05/11/covid-19-and-the-normalization-of-mass-surveillance/ | Quillette article OG image |

## MISSING
| Publication | Date | Title | URL | Suggested Imagery Source |
|---|---|---|---|---|
| Reason | 2024-08-13 | Can Nostr make Twitter’s dreams come true? | https://reason.com/2024/08/13/can-nostr-make-twitters-dreams-come-true/ | Reason OG image from article page (Adani Samat image) |
| Reason (Video) | 2024-09-17 | Nostr Is Decentralizing Social Media To Stop Government Censorship | https://reason.com/video/2024/09/17/is-nostr-an-antidote-to-social-media-censorship/ | Reason video thumbnail / YouTube mirror thumbnail |

## LOW-CONFIDENCE
| Publication | Date | Title | URL | Suggested Imagery Source |
|---|---|---|---|---|
| TIME | 2014-05-02 | Erykah Badu Won't Apologize for Swaziland Performance for a Dictator | https://time.com/85126/erykah-badu-swaziland-human-rights/ | TIME article hero image (replace archive-only link variant) |
| Foreign Policy | 2015-07-07 | How North Korea’s Marchers for Peace Became Fellow Travelers | https://foreignpolicy.com/2015/07/07/how-north-koreas-marchers-for-peace-became-fellow-travelers/ | Foreign Policy article header image |
| The Atlantic | 2014-04-18 | Africa's Game of Thrones | https://www.theatlantic.com/international/archive/2014/04/africas-game-of-thrones/360864/ | The Atlantic article hero image |
| Coin Center / Bitcoin policy ecosystem | 2019-03-13 | A Human Rights Activist’s Response to Bitcoin Critics | https://alexgladstein.com/2019/03/13/a-human-rights-activists-response-to-bitcoin-critics/ | Existing local archive image (or recrawl canonical original if available) |

## Recommended follow-ups (non-destructive)
1. Add the two 2024 Reason entries to `essays.items`.
2. For low-confidence rows, keep current archive links but append canonical external links in metadata (or swap if preferred).
3. Optional: add `canonicalLink` field for historical entries to preserve archive stability + publication provenance.
