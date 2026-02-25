# alexgladstein.org — Build Specification

## Overview
Build a multi-page personal website for Alex Gladstein. World-class quality (Apple.com / Stripe.com level).
All content data is in `content-database.md` — read it first.

## Design Direction
- Cypherpunk aesthetic but LIGHT and elegant (not dark/hacker)
- Bitcoin orange (#F7931A) as accent color
- Full-bleed sections with large imagery
- Clean, spacious, LOTS of whitespace
- Smooth scroll animations (intersection observer)
- Professional but with personality
- Typography: Inter for body, Playfair Display for headings, JetBrains Mono for accents
- Responsive: must look great on desktop (1440px) and mobile

## Pages to Build

### 1. index.html — Homepage
**Only a few eye-popping highlights.** Hit hard. Not everything, just the best.
- Cinematic hero: Large portrait photo, name huge, "Human Rights Activist | Author | Technologist"
- "As Seen In" media logo strip: TIME, The Atlantic, WIRED, CNN, Foreign Policy, BBC, NPR, WSJ, NYT, Guardian, New Republic, Forbes (use text-based logos with proper styling)
- **Featured highlight cards (4-5 max):**
  - Journal of Democracy essay "Why Bitcoin Is Freedom Money" (Oct 2025)
  - Book: "A Trojan Horse for Freedom" — use Scarce City CDN images (see content-database.md images section, use: `https://cdn.sanity.io/images/w4avejpr/production/8f0b3ceb3129f491a2685faa6fe7ad85f4d94ce2-4438x6657.jpg?h=800&q=80&auto=format`)
  - Lex Fridman Podcast #231 (YouTube thumbnail: `https://img.youtube.com/vi/kSbMU5CbFM0/maxresdefault.jpg`)
  - Network State Podcast #32 with Balaji (Jan 2026)
  - Bitcoin Conference Nashville 2024 keynote (YouTube thumbnail: `https://img.youtube.com/vi/24waV3Fwvow/maxresdefault.jpg`)
- Quote carousel (2-3 powerful quotes from Alex's essays)
- Brief about blurb + "Read more" link to /about
- Navigation: Home, About, Books, Essays, Podcasts, Talks, Contact

### 2. about.html — About
- Full bio from content-database.md
- Alt headshot image
- Stats: 15+ years at HRF, 4 books, briefed EU Parliament & US State Dept
- List of media outlets where he's appeared

### 3. books.html — Books
- 4 books with gorgeous CSS-only cover designs (unique color schemes per book)
- For "A Trojan Horse for Freedom" — use actual Scarce City photos from CDN:
  - Front cover: `https://cdn.sanity.io/images/w4avejpr/production/8f0b3ceb3129f491a2685faa6fe7ad85f4d94ce2-4438x6657.jpg?h=800&q=80&auto=format`
  - Back cover: `https://cdn.sanity.io/images/w4avejpr/production/b788ef904ef2d2a2900befc9145fc701a45f36bf-4672x7008.jpg?h=800&q=80&auto=format`
  - Slipcase: `https://cdn.sanity.io/images/w4avejpr/production/3a23e1ee3ba73131aa4c1f35bb4c3230bce87124-1280x853.jpg?h=800&q=80&auto=format`
  - Interior: `https://cdn.sanity.io/images/w4avejpr/production/f0974ebb9344d50b212bd5cc44eeaaa0e232459e-7008x4672.jpg?h=800&q=80&auto=format`
  - Full front: `https://cdn.sanity.io/images/w4avejpr/production/c1234cde5d43e08d1d1a2019f44b792cc3571cd8-4672x7008.jpg?h=800&q=80&auto=format`
- Each book: title, year, short description, buy links

### 4. essays.html — Essays
- Hero picks at top (Alex will choose later, for now feature: Journal of Democracy, TIME "Why Bitcoin Matters for Freedom", Foreign Policy "Macron" piece, New Republic "Dictators Love Development Statistics")
- Then ALL essays chronologically newest to oldest
- Each entry: **title**, publication name/logo, date, link to original
- Maybe a 1-2 line excerpt max. NO full text.
- Group by year with year headers
- Goes back to 2012

### 5. podcasts.html — Podcasts
- Apple Podcasts-style layout: podcast show name, episode title, date, link
- Hero picks at top (Lex Fridman, Glenn Greenwald/System Update, Network State/Balaji, Darknet Diaries, Nate Hagens)
- Then chronological newest to oldest
- Include ALL episodes from content-database.md
- Each card: show name, episode title, date, external link

### 6. talks.html — Talks
- Bitcoin Conference Nashville 2024 as featured hero (big YouTube embed or thumbnail)
- Then chronological list
- Each: title, event/venue, date, YouTube thumbnail + link
- Use `https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg` for thumbnails

### 7. contact.html — Contact (or footer section on all pages)
- Email: alex@hrf.org
- X: @gladstein
- Nostr: npub (display truncated)
- HRF: hrf.org

## Technical Requirements
- Static HTML/CSS/JS only — no frameworks, no build tools
- Each page is a separate .html file
- Shared CSS in styles.css
- Shared JS in scripts.js (navigation, animations)
- Google Fonts loaded via CDN (Inter, Playfair Display, JetBrains Mono)
- All images via CDN URLs (YouTube thumbnails, Scarce City, HRF portrait) — no local image files needed except the trojan-horse/ folder
- Mobile responsive
- Consistent navigation header + footer across all pages

## Portrait Image
`https://cdn-ilccclh.nitrocdn.com/NjtqKQHOTztkdEZtWVwhTXMBkDrrjmBI/assets/images/optimized/rev-e5051e2/hrf.org/wp-content/uploads/2024/10/Profile-Alex-Gladstein-V1.png`

## Alt Headshot
`https://store.bitcoinmagazine.com/cdn/shop/files/Alex_G_headshot.jpg?v=1761603342&width=640`
