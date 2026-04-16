import { initAppLauncher } from './components/appLauncher.js';
import { initGlobalSearch } from './components/globalSearch.js';
import { initCollapsibles } from './components/collapsible.js';
import { showToast } from './components/toast.js';
import { loadAllPages } from './pageLoader.js';

import {
  assignCaseToMe,
  initWorkspaceTabs,
  objMeta,
  openAccountInTab,
  openContactInTab,
  openLeadInTab,
  openCaseInTab,
  openServiceAppointmentInTab,
  openWorkOrderInTab,
  openWorkspace,
  openWorkspaceList,
  setAccountDetailTab,
  setCaseRightTab,
  setWorkOrderTab,
  showLeadDetail,
  showContactDetail,
  showPage,
  toggleOppView,
} from './router.js';

import {
  cancelNewAccount,
  cancelNewLead,
  closeNewCaseModal,
  closeCaseEditModal,
  closeCaseStatusModal,
  onAccountRecordTypeChange,
  openCaseEditModal,
  openCaseStatusModal,
  openNewAccount,
  openNewCase,
  openNewLead,
  openNewWorkOrder,
  saveNewAccount,
  saveNewCase,
  saveCaseEditModal,
  saveCaseStatusModal,
  saveNewLead,
  closeNewWorkOrderModal,
  saveNewWorkOrder,
  openWorkOrderEditMode,
  cancelWorkOrderEditMode,
  saveWorkOrderEdits,
  nwoContinueFromType,
  nwoBackToType,
  nwoApptMoveRight,
  nwoApptMoveLeft,
} from './pages/forms.js';

function wireStaticHandlers() {
  document.getElementById('customer-portal-btn')?.addEventListener('click', () => {
    const w = window.open('pages/customer-portal.html', '_blank');
    if (w) w.opener = null;
  });

  document.getElementById('dispatcher-console-btn')?.addEventListener('click', () => {
    const w = window.open('pages/dispatcher-console.html', '_blank');
    if (w) w.opener = null;
  });

  document.querySelectorAll('.nav-tab').forEach((tab) => {
    tab.addEventListener('click', function () {
      if (this.id === 'crm-modules-trigger') return;
      const label = this.textContent.trim().toLowerCase();
      const map = { teams: 'teams', leads: 'leads', accounts: 'accounts', contacts: 'contacts', opportunities: 'opportunities', cases: 'cases', workorders: 'workorders' };
      for (const [k, v] of Object.entries(map)) {
        if (label.startsWith(k.substring(0, 5))) { openWorkspaceList(v); break; }
      }
    });
  });

  document.getElementById('obj-views')?.addEventListener('click', function (e) {
    if (e.target.classList.contains('obj-view-tab')) {
      this.querySelectorAll('.obj-view-tab').forEach((t) => t.classList.remove('active'));
      e.target.classList.add('active');
    }
  });

  document.getElementById('new-btn')?.addEventListener('click', async function () {
    const active = document.querySelector('.page.active')?.id || '';
    if (active === 'page-leads' || active === 'page-lead-detail' || active === 'page-lead-new') { openNewLead(); return; }
    if (active === 'page-accounts' || active === 'page-account-detail' || active === 'page-account-new') { openNewAccount(); return; }
    if (active === 'page-cases' || active === 'page-case-detail') { openNewCase(); return; }
    if (active === 'page-workorders' || active === 'page-workorder-detail') { await openNewWorkOrder(); return; }
    if (active === 'page-teams') { showToast({ type: 'info', title: 'Prototype', body: 'New Team is not wired in this build.' }); return; }
    showToast({ type: 'error', title: 'Not implemented', body: 'Only “New Lead” is wired in this prototype.' });
  });

  setupWorkOrdersListViewFilter();
  setupCrmModulesDropdown();
}

function setupCrmModulesDropdown() {
  const wrap = document.getElementById('crm-modules-wrap');
  const trigger = document.getElementById('crm-modules-trigger');
  const menu = document.getElementById('crm-modules-menu');
  const labelEl = document.getElementById('crm-modules-current-label');
  if (!wrap || !trigger || !menu) return;

  const getModuleLabel = (page) => objMeta[page]?.label || page;
  const setSelectedModule = (page) => {
    if (!page) return;
    if (labelEl) labelEl.textContent = getModuleLabel(page);
    menu.querySelectorAll('.crm-modules-item').forEach((item) => {
      item.classList.toggle('is-selected', item.getAttribute('data-page') === page);
    });
  };

  const setOpen = (open) => {
    trigger.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
  };

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shouldOpen = trigger.getAttribute('aria-expanded') !== 'true';
    setOpen(shouldOpen);
  });

  menu.addEventListener('click', (e) => {
    const item = e.target.closest?.('.crm-modules-item');
    if (!item) return;
    e.preventDefault();
    e.stopPropagation();
    const page = item.getAttribute('data-page') || '';
    const label = (item.textContent || '').trim();
    if (page) {
      setSelectedModule(page);
      openWorkspaceList(page);
      setOpen(false);
      return;
    }
    showToast({ type: 'info', title: 'Module not wired yet', body: `${label} screen is not connected in this prototype.` });
    setOpen(false);
  });

  document.addEventListener('click', (e) => {
    if (menu.hidden) return;
    if (!wrap.contains(e.target)) setOpen(false);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  setSelectedModule('leads');
}

function setupWorkOrdersListViewFilter() {
  const page = document.getElementById('page-workorders');
  const btn = document.getElementById('workorders-listview-btn');
  const menu = document.getElementById('workorders-listview-menu');
  const searchInput = document.getElementById('workorders-listview-search-input');
  const labelEl = document.getElementById('workorders-listview-label');
  const countEl = document.getElementById('workorders-listview-count');
  if (!page || !btn || !menu || !labelEl || !countEl) return;

  const tableRows = Array.from(page.querySelectorAll('table.data-table tbody tr'));
  const items = Array.from(menu.querySelectorAll('.workorders-listview-item'));
  if (!tableRows.length || !items.length) return;

  const getDef = (id) => {
    if (id === 'recent') return { header: 'Recently Viewed', match: (tr) => tr.dataset.isRecentlyViewed === '1' };
    if (id === 'all') return { header: 'All Work Orders', match: () => true };
    // Cities: Calgary/Toronto/Vancouver
    return { header: id, match: (tr) => tr.dataset.city === id };
  };

  const setMenuOpen = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    if (open) menu.hidden = false;
    else menu.hidden = true;
  };

  const applyFilter = (filterId) => {
    const def = getDef(filterId);
    let visibleCount = 0;

    tableRows.forEach((tr) => {
      const keep = def.match(tr);
      tr.style.display = keep ? '' : 'none';
      if (keep) visibleCount += 1;
    });

    labelEl.textContent = def.header;
    countEl.textContent = String(visibleCount);

    items.forEach((it) => {
      const isActive = it.getAttribute('data-filter') === filterId;
      it.style.fontWeight = isActive ? '900' : '400';
    });
  };

  let selectedFilter = 'recent';
  applyFilter(selectedFilter);

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = btn.getAttribute('aria-expanded') !== 'true';
    setMenuOpen(open);
    if (open) searchInput?.focus();
  });

  menu.addEventListener('click', (e) => {
    const item = e.target.closest?.('.workorders-listview-item');
    if (!item) return;
    e.stopPropagation();
    const filterId = item.getAttribute('data-filter') || 'recent';
    selectedFilter = filterId;
    applyFilter(filterId);
    setMenuOpen(false);
  });

  document.addEventListener('click', (e) => {
    // Only close when clicking outside the header/menu.
    const within = menu.contains(e.target) || btn.contains(e.target);
    if (!within) setMenuOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    setMenuOpen(false);
  });

  searchInput?.addEventListener('input', () => {
    const q = (searchInput.value || '').trim().toLowerCase();
    items.forEach((it) => {
      const text = it.textContent.trim().toLowerCase();
      it.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

function exposeGlobalsForOnclick() {
  Object.assign(window, {
    // Router / workspace
    openWorkspace,
    openWorkspaceList,
    openAccountInTab,
    openContactInTab,
    openLeadInTab,
    openCaseInTab,
    openWorkOrderInTab,
    openServiceAppointmentInTab,
    showPage,
    showLeadDetail,
    showContactDetail,
    objMeta,
    setAccountDetailTab,
    setCaseRightTab,
    setWorkOrderTab,
    assignCaseToMe,
    toggleOppView,

    // Forms / modals
    openNewCase,
    closeNewCaseModal,
    saveNewCase,
    openCaseEditModal,
    closeCaseEditModal,
    saveCaseEditModal,
    openCaseStatusModal,
    closeCaseStatusModal,
    saveCaseStatusModal,
    openNewLead,
    cancelNewLead,
    saveNewLead,
    openNewAccount,
    cancelNewAccount,
    onAccountRecordTypeChange,
    saveNewAccount,
    closeNewWorkOrderModal,
    saveNewWorkOrder,
    openWorkOrderEditMode,
    cancelWorkOrderEditMode,
    saveWorkOrderEdits,
    nwoContinueFromType,
    nwoBackToType,
    nwoApptMoveRight,
    nwoApptMoveLeft,
  });
}

async function bootstrap() {
  // Expose first so inline onclick handlers in loaded HTML are available immediately.
  exposeGlobalsForOnclick();
  await loadAllPages();
  initWorkspaceTabs();
  initCollapsibles();
  initAppLauncher();
  initGlobalSearch();
  wireStaticHandlers();
}

bootstrap().catch((err) => {
  console.error('App bootstrap failed', err);
  showToast({ type: 'error', title: 'App failed to load', body: 'Check console for details.' });
});

