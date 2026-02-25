# Podcast Completeness Audit (Final)

Date: 2026-02-24 (PST)
Repo: `alexgladstein-site`

## Scope & sources used
- Legacy/parity sources reviewed:
  - https://alexgladstein.com/podcasts/
  - local parity artifact: `podcast-parity.md` (legacy feed mapped to `content-data.js`)
  - local archive scrape: `legacy-scrape/https:__alexgladstein_wordpress_com_podcasts_.html`
  - local archive summary: `legacy-scrape/parity-report.md`
- Current site dataset reviewed:
  - `content-data.js` → `podcasts.featured + podcasts.items` (33 entries currently)
- Public web discovery:
  - Brave web search + targeted fetches for post-2023 appearances.

## Key comparison outcomes
- Legacy migration parity is strong: legacy podcast corpus in local parity files is represented in current `content-data.js`.
- Additional post-legacy podcast appearances (esp. 2024–2025) appear to be missing from `content-data.js`.
- No reliable live corpus found at `alexgladstein.org` (search returned no indexable podcast pages); audit therefore used legacy `alexgladstein.com` sources and public podcast indexes.

## FOUND
| title | date | source_url | evidence_url | confidence | recommended_image_source |
|---|---|---|---|---|---|
| Lex Fridman Podcast #231 | 2021-10-16 | https://alexgladstein.com/2022/03/30/alex-gladstein-bitcoin-authoritarianism-and-human-rights-lex-fridman-podcast-podcast/ | https://www.youtube.com/watch?v=kSbMU5CbFM0 | high | https://i.ytimg.com/vi/kSbMU5CbFM0/maxresdefault.jpg |
| What Bitcoin Did — How the IMF & World Bank Exploit Poor Countries | 2022-12-01 | https://alexgladstein.com/2023/05/22/how-the-imf-world-bank-exploit-poor-countries-with-alex-gladstein/ | https://www.whatbitcoindid.com/podcast/how-the-imf-and-world-bank-exploit-poor-countries | high | https://i.ytimg.com/vi/DnHOxZgvdWM/maxresdefault.jpg |
| Bitcoin’s International Impact (Podcast) | 2021-04-28 | https://alexgladstein.com/2021/04/28/bitcoins-international-impact-podcast/ | https://podcasts.apple.com/us/podcast/btc023-bitcoins-international-impact-w-alex-gladstein/id928933489?i=1000518943744 | high | https://i.ytimg.com/vi/7peiA5zRn98/maxresdefault.jpg |
| Legacy corpus from podcasts category (18 older entries) represented in current dataset | 2018-2023 | https://alexgladstein.com/podcasts/ | https://alexgladstein.com/podcasts/ | high | N/A |

## MISSING
| title | date | source_url | evidence_url | confidence | recommended_image_source |
|---|---|---|---|---|---|
| Bitcoin: A Trojan Horse for Freedom (WBD904) | 2025-10-27 | https://www.whatbitcoindid.com/wbd904-alex-gladstein | https://podcasts.apple.com/us/podcast/bitcoin-and-the-end-of-financial-repression-alex-gladstein/id1482455669?i=1000733690736 | high | https://i.ytimg.com/vi/ivY_G5jMN38/maxresdefault.jpg |
| Is Bitcoin Failing? (Alex Gladstein & Paul Sztorc) | 2025-06-19 | https://open.spotify.com/episode/759Kp96B0cSxi0gkHhs0kM | https://fountain.fm/episode/BOoUihnJvy1gYwikOOCH | high | https://i.scdn.co/image/ab6765630000ba8acb636f4e764776a4e3437d64 |
| Coin Stories: Untold Human Rights Stories / How Bitcoin Gives Hope | 2024-10-19 | https://podcasts.apple.com/us/podcast/alex-gladstein-untold-human-rights-stories-how-bitcoin/id1569130932?i=1000673685494 | https://podcasts.apple.com/us/podcast/alex-gladstein-untold-human-rights-stories-how-bitcoin/id1569130932?i=1000673685494 | high | https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/94/b4/4c/94b44cb2-3384-9d1f-3467-c8c09cb74fc0/mza_888712040220204964.png/1200x1200bf-60.jpg |
| BTC169: Bitcoin Changing Africa’s Energy and Finance Incentives | 2024-02-14 | https://www.theinvestorspodcast.com/bitcoin-fundamentals/bitcoin-changing-africas-energy-and-finance-incentives-alex-gladstein/ | https://open.spotify.com/episode/1abAVcd3C3mdI1p3Yl7tU0 | high | https://www.theinvestorspodcast.com/?seraph_accel_gi=wp-content%2Fuploads%2F2024%2F02%2Fbitcoin-changing-africa-energy-and-finance-incentives-alex-gladstein-artwork-optimized.jpg&n=BMjIh4JC4u9EdrOBow90hg&lm=65CC3769 |
| What Bitcoin Did: Bitcoin & Human Rights (Alex Gladstein & Natalie Smolenski) | 2024-04-26 | https://www.whatbitcoindid.com/podcast/bitcoin-human-rights | https://www.whatbitcoindid.com/podcast/bitcoin-human-rights | medium | N/A |

## LOW-CONFIDENCE
| title | date | source_url | evidence_url | confidence | recommended_image_source |
|---|---|---|---|---|---|
| TFTC #406: Debt-Based Colonialism and Structural Adjustment (guest appearance) | 2023-03-20 | https://tftc.io/tftc-podcast/406/ | https://podcasts.apple.com/us/podcast/406-debt-based-colonialism-and-structural-adjustment/id1292381204?i=1000604983679 | low | N/A |
| Coin Stories: Bitcoin as a Human Rights Tool (possible duplicate/repackaged with existing 2023 site post) | 2021-09-01 | https://podcasts.apple.com/al/podcast/alex-gladstein-bitcoin-as-a-human-rights-tool/id1569130932?i=1000534122790 | https://podtail.com/podcast/coin-stories/alex-gladstein-bitcoin-as-a-human-rights-tool/ | low | https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/94/b4/4c/94b44cb2-3384-9d1f-3467-c8c09cb74fc0/mza_888712040220204964.png/1200x1200bf-60.jpg |

## Suggested next step (non-destructive)
- Triage MISSING rows in this order: WBD904, Is Bitcoin Failing, Coin Stories (2024-10-19), BTC169, then 2024 WBD Bitcoin & Human Rights.
- For each accepted row, add one canonical item with: title/date/outlet/link + image from `recommended_image_source` (or manually-curated equivalent).
