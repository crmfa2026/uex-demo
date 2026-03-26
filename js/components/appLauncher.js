import { showToast } from './toast.js';

export function initAppLauncher() {
  const btn = document.querySelector('.nav-apps-btn');
  const overlay = document.getElementById('al-overlay');
  const panel = document.getElementById('app-launcher');
  const closeBtn = document.getElementById('al-close');
  const search = document.getElementById('al-search');
  const list = document.getElementById('al-list');
  const viewAll = document.getElementById('al-view-all');

  if (!btn || !overlay || !panel || !closeBtn || !search || !list) return;

  const positionPanel = () => {
    const r = btn.getBoundingClientRect();
    const panelWidth = panel.getBoundingClientRect().width || 560;
    const viewportPad = 12;
    const desiredLeft = Math.max(viewportPad, Math.min(r.left, window.innerWidth - panelWidth - viewportPad));
    panel.style.left = `${Math.round(desiredLeft)}px`;
    panel.style.top = `${Math.round(r.bottom + 10)}px`;

    const arrowLeft = Math.round((r.left + r.width / 2) - desiredLeft - 10);
    panel.style.setProperty('--al-arrow-left', `${Math.max(18, Math.min(arrowLeft, panelWidth - 38))}px`);
  };

  const filter = (q) => {
    const term = (q || '').trim().toLowerCase();
    list.querySelectorAll('.al-item').forEach((item) => {
      const name = (item.getAttribute('data-app') || item.textContent || '').toLowerCase();
      item.style.display = !term || name.includes(term) ? '' : 'none';
    });
  };

  const close = () => {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
    search.value = '';
    filter('');
  };
  const open = () => {
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');
    positionPanel();
    setTimeout(() => search.focus(), 0);
  };
  const isOpen = () => overlay.classList.contains('show');

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen()) close();
    else open();
  });

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    close();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) close();
  });
  window.addEventListener('resize', () => {
    if (isOpen()) positionPanel();
  });
  window.addEventListener('scroll', () => {
    if (isOpen()) positionPanel();
  }, true);

  search.addEventListener('input', () => filter(search.value));

  list.addEventListener('click', (e) => {
    const item = e.target.closest?.('.al-item');
    if (!item) return;
    const app = item.getAttribute('data-app') || item.textContent.trim();
    list.querySelectorAll('.al-item').forEach((i) => i.classList.toggle('is-active', i === item));
    showToast({ type: 'success', title: 'App selected', body: app });
    close();
  });

  viewAll?.addEventListener('click', () => {
    showToast({ type: 'success', title: 'View All', body: 'This can link to a full app directory screen.' });
    close();
  });
}

