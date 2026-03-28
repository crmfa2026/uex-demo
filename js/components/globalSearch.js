export function initGlobalSearch() {
  const bar = document.getElementById('global-search-bar');
  const input = document.getElementById('global-search-input');
  const panel = document.getElementById('global-search-panel');
  const scopeBtn = document.getElementById('global-search-scope');
  const scopeMenu = document.getElementById('global-search-scope-list');
  if (!bar || !input || !panel) return;

  const setPanelOpen = (open) => {
    panel.hidden = !open;
    bar.classList.toggle('is-panel-open', open);
    input.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  const syncPanel = () => {
    const hasText = input.value.trim().length > 0;
    const focused = document.activeElement === input;
    setPanelOpen(hasText && focused);
  };

  const closeScopeMenu = () => {
    if (scopeMenu) scopeMenu.hidden = true;
    scopeBtn?.setAttribute('aria-expanded', 'false');
  };

  const toggleScopeMenu = () => {
    if (!scopeMenu || !scopeBtn) return;
    const open = scopeMenu.hidden === false;
    if (open) closeScopeMenu();
    else {
      scopeMenu.hidden = false;
      scopeBtn.setAttribute('aria-expanded', 'true');
    }
  };

  input.addEventListener('input', syncPanel);
  input.addEventListener('focus', syncPanel);
  input.addEventListener('blur', () => {
    requestAnimationFrame(syncPanel);
  });

  panel.addEventListener('mousedown', (e) => {
    e.preventDefault();
  });

  scopeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleScopeMenu();
  });

  scopeMenu?.addEventListener('click', (e) => {
    const li = e.target.closest('li[role="option"]');
    if (!li) return;
    const label = li.dataset.label || li.textContent.trim();
    const strong = scopeBtn?.querySelector('strong');
    if (strong) strong.textContent = label;
    closeScopeMenu();
    input.focus();
  });

  document.addEventListener('click', (e) => {
    if (scopeBtn && !scopeBtn.contains(e.target) && scopeMenu && !scopeMenu.contains(e.target)) {
      closeScopeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeScopeMenu();
    if (document.activeElement === input) input.blur();
    syncPanel();
  });
}
