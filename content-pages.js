function reorderItemsForVisibleUniqueness(featured = [], items = []) {
  const featuredImages = new Set((featured || []).map((item) => item.image).filter(Boolean));
  const uniqueFirst = [];
  const repeatedLater = [];

  (items || []).forEach((item) => {
    if (item?.image && featuredImages.has(item.image)) repeatedLater.push(item);
    else uniqueFirst.push(item);
  });

  return [...uniqueFirst, ...repeatedLater];
}


function normalizeDateLabel(raw = '') {
  const t = String(raw || '').trim();
  if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/.test(t)) return t;
  const m = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[Number(m[2]) - 1]} ${m[1]}`;
  }
  return t;
}

function formatMeta(item = {}) {
  const date = normalizeDateLabel(item.date || '');
  const outlet = String(item.outlet || '').trim();
  if (date && outlet) return `${date} · ${outlet}`;
  return date || outlet || '';
}


function isBlockedImagePath(img = '') {
  const p = String(img || '').toLowerCase();
  return (
    p.includes('images/alex-speaking-') ||
    p.includes('images/email/') ||
    p.includes('/media/inbound/') ||
    p.startsWith('/users/') ||
    p.startsWith('file://')
  );
}

function safeCardImage(item, idx, slug, getFallbackImage) {
  const img = item?.image || '';
  if (!img || isBlockedImagePath(img)) return getFallbackImage(idx);
  return img;
}

if (typeof window !== 'undefined') {
  window.reorderItemsForVisibleUniqueness = reorderItemsForVisibleUniqueness;
}

document.addEventListener('DOMContentLoaded', () => {
  const pageEl = document.querySelector('.catalog-page');
  if (!pageEl || !window.CONTENT_DATA) return;

  const slug = pageEl.dataset.page;
  const data = window.CONTENT_DATA[slug];
  if (!data) return;

  const itemsPerPage = 4;
  let pageIndex = 0;
  const orderedItems = reorderItemsForVisibleUniqueness(data.featured, data.items);

  const labelEl = pageEl.querySelector('[data-field="label"]');
  const titleEl = pageEl.querySelector('[data-field="title"]');
  const subtitleEl = pageEl.querySelector('[data-field="subtitle"]');
  if (labelEl) labelEl.textContent = data.label;
  if (titleEl) titleEl.textContent = data.title;
  if (subtitleEl) subtitleEl.textContent = data.subtitle;

  const featuredGrid = pageEl.querySelector('.featured-grid');
  const timelineGrid = pageEl.querySelector('.timeline-grid');
  const pageIndicator = pageEl.querySelector('.page-indicator');
  const prevBtn = pageEl.querySelector('.pagination-prev');
  const nextBtn = pageEl.querySelector('.pagination-next');

  const fallbackPools = {
    books: ['images/trojan-horse/1.jpg', 'images/trojan-horse/2.jpg', 'images/trojan-horse/3.jpg'],
    essays: ['images/archive/essays/essays-featured-why-bitcoin-freedom-money.jpg', 'images/archive/essays/essays-reason-nostr-dreams-2024.png', 'images/archive/essays/essays-bitcoinmag-stranded-africa-2024.png'],
    podcasts: ['images/archive/podcasts/podcasts-featured-lex-fridman-231.jpg', 'images/archive/podcasts/podcasts-coinstories-untold-human-rights-2024.jpg', 'images/archive/podcasts/podcasts-wbd-965-financial-repression-2025.jpg'],
    talks: ['images/archive/talks/talks-featured-bitcoin-conference-nashville-2024.jpg', 'images/archive/talks/talks-item-end-financial-repression.jpg', 'images/archive/talks/talks-item-harsh-truth.jpg'],
    press: ['images/archive/press/press-forbes-empowering-human-rights-2024.png', 'images/archive/press/press-item-wired-el-salvador.jpg', 'images/archive/press/press-item-foreign-policy-macron.jpg'],
    interviews: ['images/archive/interviews/interviews-coindesk-bitcoin-revolution-2021.jpg', 'images/archive/interviews/interviews-newslens-authoritarianism-2018.jpg', 'images/archive/interviews/interviews-reason-video-2021.jpg']
  };

  function getFallbackImage(idx) {
    const pool = fallbackPools[slug] || fallbackPools.essays;
    return pool[idx % pool.length];
  }

  function hydrateCardImages(scope = pageEl) {
    const imgs = scope.querySelectorAll('.catalog-image');
    imgs.forEach((img, idx) => {
      img.onerror = () => {
        if (!img.dataset.fallbackApplied) {
          img.dataset.fallbackApplied = 'true';
          img.src = img.dataset.fallback || getFallbackImage(idx);
        }
      };
    });
  }

  function updatePaginationState(totalPages) {
    pageIndicator.textContent = `Page ${pageIndex + 1} of ${totalPages}`;
    pageIndicator.setAttribute('aria-live', 'polite');
    prevBtn.disabled = pageIndex === 0;
    nextBtn.disabled = pageIndex >= totalPages - 1;
    const hidden = totalPages <= 1;
    pageIndicator.parentElement.hidden = hidden;
  }


  function defaultPriorityTag() {
    if (slug === 'podcasts') return 'Priority Listen';
    if (slug === 'talks') return 'Priority Watch';
    return 'Priority Read';
  }

  function renderFeatured() {
    featuredGrid.innerHTML = data.featured.map((item, idx) => `
      <article class="feature-card">
        <img class="catalog-image" src="${safeCardImage(item, idx, slug, getFallbackImage)}" data-fallback="${getFallbackImage(idx)}" alt="${item.title}" loading="lazy" decoding="async" />
        <p class="meta">${item.meta}</p>
        <h3>${item.title}</h3>
        <p>${item.blurb}</p>
        <div class="feature-foot">
          <span>${item.tag || defaultPriorityTag()}</span>
          <a href="${item.link}" target="_blank" rel="noopener">Open ↗</a>
        </div>
      </article>
    `).join('');
    hydrateCardImages(featuredGrid);
  }

  function renderPage() {
    const start = pageIndex * itemsPerPage;
    const pageItems = orderedItems.slice(start, start + itemsPerPage);

    timelineGrid.innerHTML = pageItems.map((item, idx) => `
      <article class="timeline-card">
        <img class="catalog-image" src="${safeCardImage(item, start + idx, slug, getFallbackImage)}" data-fallback="${getFallbackImage(start + idx)}" alt="${item.title}" loading="lazy" decoding="async" />
        <p class="meta">${formatMeta(item)}</p>
        <h3>${item.title}</h3>
        <p>${item.blurb}</p>
        <a href="${item.link}" target="_blank" rel="noopener">Read more</a>
      </article>
    `).join('');

    const totalPages = Math.ceil(orderedItems.length / itemsPerPage);
    updatePaginationState(totalPages);
    hydrateCardImages(timelineGrid);
  }

  function goToPage(nextPage) {
    const totalPages = Math.ceil(orderedItems.length / itemsPerPage);
    const clamped = Math.max(0, Math.min(nextPage, totalPages - 1));
    if (clamped === pageIndex) return;
    pageIndex = clamped;
    renderPage();
    const top = timelineGrid.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => goToPage(pageIndex - 1));
  nextBtn.addEventListener('click', () => goToPage(pageIndex + 1));

  window.addEventListener('keydown', (event) => {
    if (!pageEl.contains(document.activeElement)) return;
    if (event.key === 'ArrowLeft') goToPage(pageIndex - 1);
    if (event.key === 'ArrowRight') goToPage(pageIndex + 1);
  });

  renderFeatured();
  renderPage();
});
