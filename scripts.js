document.addEventListener('DOMContentLoaded', () => {
  const currentPath = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  document.querySelectorAll('nav a').forEach((a) => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    const hrefPath = href.split('#')[0] || 'index.html';

    if (hrefPath === currentPath) {
      a.setAttribute('aria-current', 'page');
    }
  });
});
