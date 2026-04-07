function buildTimeScale() {
  const scale = document.getElementById('dc-time-scale');
  if (!scale) return;
  scale.innerHTML = '';
  const labels = ['12 AM','2 AM','4 AM','6 AM','8 AM','10 AM','12 PM','2 PM','4 PM','6 PM','8 PM','10 PM'];
  labels.forEach((t) => {
    const cell = document.createElement('div');
    cell.textContent = t;
    scale.appendChild(cell);
  });
}

function initViewMenu() {
  const btn = document.getElementById('dc-view-btn');
  const menu = document.getElementById('dc-view-menu');
  if (!btn || !menu) return;

  const setOpen = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(btn.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', (e) => {
    const item = e.target.closest?.('.dc-view-item');
    if (!item) return;
    e.stopPropagation();
    const view = item.getAttribute('data-view') || 'daily';
    btn.childNodes[0].textContent = view === 'weekly' ? 'Weekly' : 'Daily';
    menu.querySelectorAll('.dc-view-item').forEach((it) => it.setAttribute('aria-checked', it === item ? 'true' : 'false'));
    setOpen(false);
  });

  document.addEventListener('click', (e) => {
    if (menu.contains(e.target) || btn.contains(e.target)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

function initSearchFilter() {
  const input = document.getElementById('dc-appointments-search');
  const tbody = document.getElementById('dc-appt-tbody');
  if (!input || !tbody) return;
  const rows = Array.from(tbody.querySelectorAll('tr'));

  input.addEventListener('input', () => {
    const q = (input.value || '').trim().toLowerCase();
    rows.forEach((tr) => {
      const a = (tr.getAttribute('data-account') || tr.children?.[0]?.textContent || '').toLowerCase();
      const z = (tr.getAttribute('data-zone') || tr.children?.[3]?.textContent || '').toLowerCase();
      tr.style.display = !q || a.includes(q) || z.includes(q) ? '' : 'none';
    });
  });
}

function initResourceFilter() {
  const input = document.getElementById('dc-resources-search');
  const root = document.getElementById('dc-resources');
  if (!input || !root) return;
  const rows = Array.from(root.querySelectorAll('.dc-res-row'));
  const groups = Array.from(root.querySelectorAll('.dc-res-group'));

  input.addEventListener('input', () => {
    const q = (input.value || '').trim().toLowerCase();
    rows.forEach((row) => {
      const text = (row.textContent || '').trim().toLowerCase();
      row.style.display = !q || text.includes(q) ? '' : 'none';
    });
    groups.forEach((g) => {
      const anyVisible = Array.from(g.querySelectorAll('.dc-res-row')).some((r) => r.style.display !== 'none');
      g.style.display = anyVisible ? '' : 'none';
    });
  });
}

function initDateNav() {
  const label = document.getElementById('dc-range-label');
  const prev = document.getElementById('dc-prev');
  const next = document.getElementById('dc-next');
  const today = document.getElementById('dc-today-btn');
  if (!label || !prev || !next || !today) return;

  const start = new Date('2026-04-06T12:00:00');
  let offsetDays = 0;

  const fmt = (d) => d.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
  const render = () => {
    const d = new Date(start);
    d.setDate(d.getDate() + offsetDays);
    label.textContent = fmt(d);
  };

  prev.addEventListener('click', () => { offsetDays -= 1; render(); });
  next.addEventListener('click', () => { offsetDays += 1; render(); });
  today.addEventListener('click', () => { offsetDays = 0; render(); });
  render();
}

buildTimeScale();
initViewMenu();
initSearchFilter();
initResourceFilter();
initDateNav();

