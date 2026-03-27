import { initAppLauncher } from './components/appLauncher.js';
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
  onAccountRecordTypeChange,
  openNewAccount,
  openNewCase,
  openNewLead,
  openNewWorkOrder,
  saveNewAccount,
  saveNewCase,
  saveNewLead,
} from './pages/forms.js';

function wireStaticHandlers() {
  document.querySelectorAll('.nav-tab').forEach((tab) => {
    tab.addEventListener('click', function () {
      const label = this.textContent.trim().toLowerCase();
      const map = { leads: 'leads', accounts: 'accounts', contacts: 'contacts', opportunities: 'opportunities', cases: 'cases', workorders: 'workorders' };
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

  document.getElementById('new-btn')?.addEventListener('click', function () {
    const active = document.querySelector('.page.active')?.id || '';
    if (active === 'page-leads' || active === 'page-lead-detail' || active === 'page-lead-new') { openNewLead(); return; }
    if (active === 'page-accounts' || active === 'page-account-detail' || active === 'page-account-new') { openNewAccount(); return; }
    if (active === 'page-cases' || active === 'page-case-detail') { openNewCase(); return; }
    if (active === 'page-workorders' || active === 'page-workorder-detail') { openNewWorkOrder(); return; }
    showToast({ type: 'error', title: 'Not implemented', body: 'Only “New Lead” is wired in this prototype.' });
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
    openNewLead,
    cancelNewLead,
    saveNewLead,
    openNewAccount,
    cancelNewAccount,
    onAccountRecordTypeChange,
    saveNewAccount,
  });
}

async function bootstrap() {
  // Expose first so inline onclick handlers in loaded HTML are available immediately.
  exposeGlobalsForOnclick();
  await loadAllPages();
  initWorkspaceTabs();
  initCollapsibles();
  initAppLauncher();
  wireStaticHandlers();
}

bootstrap().catch((err) => {
  console.error('App bootstrap failed', err);
  showToast({ type: 'error', title: 'App failed to load', body: 'Check console for details.' });
});

