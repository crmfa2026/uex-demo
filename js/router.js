import { showToast } from './components/toast.js';

export const objMeta = {
  leads: { icon: 'person', label: 'Leads', views: ['All Leads', 'My Leads', 'Recently Viewed', 'New This Week'], newLabel: 'New Lead' },
  accounts: { icon: 'building', label: 'Accounts', views: ['All Accounts', 'My Accounts', 'Recently Viewed'], newLabel: 'New Account' },
  contacts: { icon: 'person', label: 'Contacts', views: ['All Contacts', 'My Contacts', 'Recently Viewed'], newLabel: 'New Contact' },
  opportunities: { icon: 'diamond', label: 'Opportunities', views: ['All Opportunities', 'My Pipeline', 'Closing This Quarter'], newLabel: 'New Opportunity' },
  workorders: { icon: 'truck', label: 'Work Orders', views: ['Recently Viewed', 'My Work Orders'], newLabel: 'New Work Order' },
  cases: { icon: 'file', label: 'Cases', views: ['All Cases', 'My Open Cases', 'Escalated', 'Recently Closed'], newLabel: 'New Case' },
};

const DEBUG_NAV = true;
const dlog = (...args) => { if (DEBUG_NAV) console.log('[NAV]', ...args); };

window.addEventListener('error', (e) => dlog('window.error', e.message, e.error));
window.addEventListener('unhandledrejection', (e) => dlog('unhandledrejection', e.reason));

export function showPage(name) {
  dlog('showPage()', name);
  document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
  const next = document.getElementById('page-' + name);
  if (!next) {
    dlog('showPage() missing element', 'page-' + name);
    return;
  }
  next.classList.add('active');

  document.querySelectorAll('.nav-tab').forEach((t) => t.classList.remove('active'));
  const base = name.replace('-detail', '').replace('lead', 'leads').replace('account', 'accounts').replace('case', 'cases');
  document.querySelectorAll('.nav-tab').forEach((t) => {
    if (t.textContent.trim().toLowerCase().startsWith(base.replace('ies', 'y'))) t.classList.add('active');
  });

  const rootName = name.replace('-detail', '');
  const meta = objMeta[rootName] || objMeta[base];
  if (meta) {
    document.getElementById('obj-name-display').textContent = meta.label;
    const viewsEl = document.getElementById('obj-views');
    viewsEl.innerHTML = meta.views.map((v, i) => `<div class="obj-view-tab${i === 0 ? ' active' : ''}">${v}</div>`).join('');
    const newBtnLabel = document.getElementById('new-btn-label');
    if (newBtnLabel) newBtnLabel.textContent = meta.newLabel;
  }

  window.scrollTo(0, 0);
}

export function showLeadDetail() { showPage('lead-detail'); }

export const accountRecords = {
  acme: {
    name: 'Acme Corp',
    typeBadgeHtml: '<span class="badge badge-customer">Customer</span>',
    typeText: 'Customer',
    industry: 'Field Services',
    location: 'London, UK',
    phone: '+44 20 7946 0800',
    website: 'acmecorp.com',
    revenueShort: '£2.4M',
    revenueLong: '£2,400,000',
    owner: 'Mike Rodriguez',
    openWos: 3,
    woSummary: { total: 3, open: 2, next: 'Today 15:30' },
  },
  fieldpro: {
    name: 'FieldPro Services',
    typeBadgeHtml: '<span class="badge badge-customer">Customer</span>',
    typeText: 'Customer',
    industry: 'Facilities Mgmt',
    location: 'Mumbai, IN',
    phone: '+91 22 6600 1200',
    website: 'fieldproservices.in',
    revenueShort: '₹7.8Cr',
    revenueLong: '₹78,000,000',
    owner: 'Me',
    openWos: 0,
    woSummary: { total: 1, open: 0, next: '—' },
  },
  techflow: {
    name: 'TechFlow Inc',
    typeBadgeHtml: '<span class="badge badge-prospect">Prospect</span>',
    typeText: 'Prospect',
    industry: 'Technology',
    location: 'San Francisco, US',
    phone: '+1 415 900 2200',
    website: 'techflow.io',
    revenueShort: '$12.9M',
    revenueLong: '$12,900,000',
    owner: 'Ravi Singh',
    openWos: 1,
    woSummary: { total: 1, open: 1, next: 'Tomorrow 09:00' },
  },
};

export const caseRecords = {
  'CASE-00041': {
    caseNumber: '00074374',
    subject: 'RE: Service Reminder February 24, 2026',
    status: 'Closed',
    priority: 'Medium',
    accountName: 'Jean & Mike Kovich',
    contactName: 'Jean & Mike Kovich',
    contactEmail: 'mjk...@shaw.ca',
    contactPhone: '—',
    description: 'I will be out in the morning of February 24, so I want you to come in the afternoon.',
  },
  'CASE-00039': {
    caseNumber: '00016321',
    subject: 'Home Cleaning Booking - Vancouver - 2024-01-29',
    status: 'Closed',
    priority: 'Medium',
    accountName: 'SafeGuard FM',
    contactName: 'Nina Okafor',
    contactEmail: 'n.okafor@safeguard.ng',
    contactPhone: '+234 803 000 1234',
    description: 'Customer asked to reschedule cleaning. Please confirm available slots.',
  },
};

export const workOrderRecords = {
  'WO-00941877': {
    number: '00941877',
    subject: 'test sfsdf',
    checklist: 'Complete Home Cleaning',
    serviceDescription: 'One-time',
    product: '—',
    team: '—',
    status: 'Canceled',
    date: '31/12/2024',
    frequency: 'One-time',
    hours: '5.00',
    rate: '79.00',
    cost: '$395.00',
    account: 'test sfsdf',
  },
  'WO-00965084': {
    number: '00965084',
    subject: '—',
    checklist: 'Maintenance',
    serviceDescription: 'One-time',
    product: '—',
    team: '—',
    status: 'Completed',
    date: '22/01/2024',
    frequency: 'One-time',
    hours: '3.00',
    rate: '79.00',
    cost: '$237.00',
    account: 'Darren Wong',
  },
  'WO-00980528': {
    number: '00980528',
    subject: 'Maintenance Paul Albi: February 12, 2026',
    checklist: 'Maintenance',
    serviceDescription: 'One-time',
    product: '—',
    team: '—',
    status: 'Completed',
    date: '12/02/2026',
    frequency: 'One-time',
    hours: '5.00',
    rate: '79.00',
    cost: '$395.00',
    account: 'Paul Albi',
  },
};

export const serviceAppointmentRecords = {
  'SA-943473': {
    number: 'SA-973672',
    title: 'Sandra Laronde',
    parentRecord: '00972073',
    status: 'Canceled',
    frequency: 'Bi-weekly',
    hours: '4.50',
    durationTof3: '1hr 30min',
    duration: '90.00',
    backendReminder: '9:00:00 a.m.',
    cancellationDate: '18/08/2025',
    cancelledBy: 'OnlineBooking Engine',
    address: '96 Borden Street, Toronto ON M5S2N1, Canada',
    territory: 'Toronto',
  },
};

// ─────────────────────────────────────────────
// Workspace tabs (router-like behavior)
// ─────────────────────────────────────────────
let workspaceTabs = [];
let activeWorkspaceTabId = null;
let _tabSeq = 1;

function getWorkspaceTabEl() {
  return document.getElementById('worktabs-scroll');
}

function routeKey(route = {}) {
  return `${route?.page || ''}:${route?.id || ''}`;
}

function defaultTitleForRoute(route = {}) {
  const p = route?.page || 'leads';
  if (p === 'account-detail') return 'Account';
  if (p === 'case-detail') return 'Case';
  if (p === 'workorder-detail') return 'Work Order';
  if (p === 'serviceappointment-detail') return 'Service Appointment';
  return objMeta[p]?.label || String(p);
}

function createWorkspaceTab(route, { title } = {}) {
  const id = `tab-${_tabSeq++}`;
  const key = routeKey(route);
  const t = { id, key, route, title: title || defaultTitleForRoute(route) };
  workspaceTabs.push(t);
  return t;
}

function renderWorkspaceTabs() {
  const host = getWorkspaceTabEl();
  if (!host) return;

  host.innerHTML = workspaceTabs.map((t) => {
    const isActive = t.id === activeWorkspaceTabId;
    return `
      <div class="worktab${isActive ? ' active' : ''}" data-tab-id="${t.id}">
        <div class="worktab-title">${t.title}</div>
        <button class="worktab-close" type="button" aria-label="Close" data-tab-close="${t.id}">
          <svg viewBox="0 0 16 16" fill="currentColor"><path d="M3.7 3.7a1 1 0 011.4 0L8 6.6l2.9-2.9a1 1 0 111.4 1.4L9.4 8l2.9 2.9a1 1 0 11-1.4 1.4L8 9.4l-2.9 2.9a1 1 0 11-1.4-1.4L6.6 8 3.7 5.1a1 1 0 010-1.4z"/></svg>
        </button>
      </div>
    `;
  }).join('');
}

function navigateRoute(route) {
  const p = route?.page || 'leads';
  if (p === 'account-detail') { showAccountDetail(route?.id || 'acme'); return; }
  if (p === 'case-detail') { showCaseDetail(route?.id || 'CASE-00041'); return; }
  if (p === 'workorder-detail') { showWorkOrderDetail(route?.id || 'WO-00941877'); return; }
  if (p === 'serviceappointment-detail') { showServiceAppointmentDetail(route?.id || 'SA-943473'); return; }
  showPage(p);
}

export function activateWorkspaceTab(tabId) {
  const t = workspaceTabs.find((x) => x.id === tabId);
  if (!t) return;
  activeWorkspaceTabId = t.id;
  renderWorkspaceTabs();
  navigateRoute(t.route);
}

export function closeWorkspaceTab(tabId) {
  const idx = workspaceTabs.findIndex((x) => x.id === tabId);
  if (idx < 0) return;
  const wasActive = workspaceTabs[idx].id === activeWorkspaceTabId;
  workspaceTabs.splice(idx, 1);

  if (!workspaceTabs.length) {
    const fallback = createWorkspaceTab({ page: 'leads' }, { title: 'Leads' });
    activeWorkspaceTabId = fallback.id;
    renderWorkspaceTabs();
    navigateRoute(fallback.route);
    return;
  }

  if (wasActive) {
    const next = workspaceTabs[Math.min(idx, workspaceTabs.length - 1)];
    activeWorkspaceTabId = next.id;
    renderWorkspaceTabs();
    navigateRoute(next.route);
  } else {
    renderWorkspaceTabs();
  }
}

export function openWorkspace(route, { title, reuseIfExists = true } = {}) {
  const key = routeKey(route);
  if (reuseIfExists) {
    const existing = workspaceTabs.find((t) => t.key === key);
    if (existing) {
      if (title) existing.title = title;
      activateWorkspaceTab(existing.id);
      return;
    }
  }
  const t = createWorkspaceTab(route, { title });
  activateWorkspaceTab(t.id);
}

export function openWorkspaceList(page) {
  openWorkspace({ page }, { title: objMeta[page]?.label || defaultTitleForRoute({ page }) });
}

export function openAccountInTab(accountId) {
  const a = accountRecords[accountId] || accountRecords.acme;
  openWorkspace({ page: 'account-detail', id: accountId }, { title: a?.name || 'Account', reuseIfExists: true });
}

export function openCaseInTab(caseId) {
  openWorkspace({ page: 'case-detail', id: caseId }, { title: String(caseId || 'Case'), reuseIfExists: true });
}

export function openWorkOrderInTab(workOrderId) {
  const wo = workOrderRecords[workOrderId] || workOrderRecords['WO-00941877'];
  const title = wo?.subject && wo.subject !== '—' ? wo.subject : `Work Order ${wo?.number || ''}`.trim();
  openWorkspace({ page: 'workorder-detail', id: workOrderId }, { title, reuseIfExists: true });
}

export function openServiceAppointmentInTab(serviceAppointmentId) {
  const sa = serviceAppointmentRecords[serviceAppointmentId] || serviceAppointmentRecords['SA-943473'];
  const title = sa?.title || String(serviceAppointmentId || 'Service Appointment');
  openWorkspace({ page: 'serviceappointment-detail', id: serviceAppointmentId }, { title, reuseIfExists: true });
}

export function initWorkspaceTabs() {
  const host = getWorkspaceTabEl();
  if (!host) return;

  host.addEventListener('click', (e) => {
    const closeBtn = e.target.closest?.('[data-tab-close]');
    if (closeBtn) {
      e.stopPropagation();
      closeWorkspaceTab(closeBtn.getAttribute('data-tab-close'));
      return;
    }
    const tabEl = e.target.closest?.('.worktab[data-tab-id]');
    if (tabEl) activateWorkspaceTab(tabEl.getAttribute('data-tab-id'));
  });

  if (!workspaceTabs.length) {
    const first = createWorkspaceTab({ page: 'leads' }, { title: 'Leads' });
    activeWorkspaceTabId = first.id;
    renderWorkspaceTabs();
  }
}

// ─────────────────────────────────────────────
// Detail renderers
// ─────────────────────────────────────────────
export function setAccountDetailTab(tab) {
  const tabs = ['details', 'contracts', 'cases', 'opportunities', 'workorders'];
  const safeTab = tabs.includes(tab) ? tab : 'details';

  tabs.forEach((t) => {
    const btn = document.getElementById(`acc-tab-btn-${t}`);
    const panel = document.getElementById(`acc-tab-${t}`);
    const isActive = t === safeTab;
    if (btn) { btn.classList.toggle('active', isActive); btn.setAttribute('aria-selected', String(isActive)); }
    if (panel) panel.style.display = isActive ? '' : 'none';
  });

  window.scrollTo(0, 0);
}

export function showAccountDetail(accountId = 'acme') {
  const a = accountRecords[accountId] || accountRecords.acme;

  const titleEl = document.getElementById('acc-record-title');
  if (titleEl) titleEl.textContent = a.name;
  const subEl = document.getElementById('acc-record-sub');
  if (subEl) subEl.textContent = `${a.typeText} · ${a.industry} · ${a.location}`;

  const kfType = document.getElementById('acc-kf-type');
  if (kfType) kfType.innerHTML = a.typeBadgeHtml;
  const kfInd = document.getElementById('acc-kf-industry');
  if (kfInd) kfInd.textContent = a.industry;
  const kfRev = document.getElementById('acc-kf-revenue');
  if (kfRev) kfRev.textContent = a.revenueShort;
  const kfWos = document.getElementById('acc-kf-open-wos');
  if (kfWos) kfWos.textContent = String(a.openWos);
  const kfOwner = document.getElementById('acc-kf-owner');
  if (kfOwner) kfOwner.textContent = a.owner;

  const sideName = document.getElementById('acc-side-name');
  if (sideName) sideName.textContent = a.name;
  const sideType = document.getElementById('acc-side-type');
  if (sideType) sideType.innerHTML = a.typeBadgeHtml;
  const sideIndustry = document.getElementById('acc-side-industry');
  if (sideIndustry) sideIndustry.textContent = a.industry;
  const sidePhone = document.getElementById('acc-side-phone');
  if (sidePhone) sidePhone.textContent = a.phone;
  const sideWebsite = document.getElementById('acc-side-website');
  if (sideWebsite) sideWebsite.textContent = a.website;
  const sideRevenue = document.getElementById('acc-side-revenue');
  if (sideRevenue) sideRevenue.textContent = a.revenueLong;
  const sideAddress = document.getElementById('acc-side-address');
  if (sideAddress) sideAddress.textContent = a.location;
  const sideOwner = document.getElementById('acc-side-owner');
  if (sideOwner) sideOwner.textContent = a.owner;

  const mirrorText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const mirrorHtml = (id, v) => { const el = document.getElementById(id); if (el) el.innerHTML = v; };
  mirrorText('acc-side-name-ct', a.name);
  mirrorHtml('acc-side-type-ct', a.typeBadgeHtml);
  mirrorText('acc-side-industry-ct', a.industry);
  mirrorText('acc-side-owner-ct', a.owner);
  mirrorText('acc-side-name-cases', a.name);
  mirrorHtml('acc-side-type-cases', a.typeBadgeHtml);
  mirrorText('acc-side-industry-cases', a.industry);
  mirrorText('acc-side-owner-cases', a.owner);
  mirrorText('acc-side-name-opps', a.name);
  mirrorHtml('acc-side-type-opps', a.typeBadgeHtml);
  mirrorText('acc-side-industry-opps', a.industry);
  mirrorText('acc-side-owner-opps', a.owner);

  const woSideAccount = document.getElementById('acc-wo-side-account');
  if (woSideAccount) woSideAccount.textContent = a.name;
  const woCount = document.getElementById('acc-wo-count');
  if (woCount) woCount.textContent = String(a.woSummary?.total ?? 0);
  const woSideOpen = document.getElementById('acc-wo-side-open');
  if (woSideOpen) woSideOpen.textContent = String(a.woSummary?.open ?? 0);
  const woSideNext = document.getElementById('acc-wo-side-next');
  if (woSideNext) woSideNext.textContent = a.woSummary?.next ?? '—';

  showPage('account-detail');
  setAccountDetailTab('details');
}

export function setCaseRightTab(tab) {
  const btnDetails = document.getElementById('case-tab-btn-details');
  const btnEmail = document.getElementById('case-tab-btn-email');
  const btnJobs = document.getElementById('case-tab-btn-jobs');
  const panelDetails = document.getElementById('case-tab-details');
  const panelEmail = document.getElementById('case-tab-email');
  const panelJobs = document.getElementById('case-tab-jobs');

  const setActive = (btn, on) => { if (btn) { btn.classList.toggle('active', on); btn.setAttribute('aria-selected', String(on)); } };
  setActive(btnDetails, tab === 'details');
  setActive(btnEmail, tab === 'email');
  setActive(btnJobs, tab === 'jobs');

  if (panelDetails) panelDetails.style.display = tab === 'details' ? '' : 'none';
  if (panelEmail) panelEmail.style.display = tab === 'email' ? '' : 'none';
  if (panelJobs) panelJobs.style.display = tab === 'jobs' ? '' : 'none';
}

function renderCaseDetail(caseId = 'CASE-00041') {
  const c = caseRecords[caseId] || caseRecords['CASE-00041'];
  if (!c) return;

  const title = document.getElementById('case-title');
  if (title) title.textContent = c.subject;
  const sub = document.getElementById('case-sub');
  if (sub) sub.textContent = `Priority ${c.priority} · Status ${c.status} · Case Number ${c.caseNumber}`;

  const cn = document.getElementById('case-contact-name');
  if (cn) cn.textContent = c.contactName;
  const an = document.getElementById('case-account-name');
  if (an) an.textContent = c.accountName;
  const ce = document.getElementById('case-contact-email');
  if (ce) ce.textContent = c.contactEmail;
  const cp = document.getElementById('case-contact-phone');
  if (cp) cp.textContent = c.contactPhone;

  const subj = document.getElementById('case-detail-subject');
  if (subj) subj.textContent = c.subject;
  const st = document.getElementById('case-detail-status');
  if (st) st.textContent = c.status;
  const desc = document.getElementById('case-detail-description');
  if (desc) desc.textContent = c.description;
}

export function showCaseDetail(caseId = 'CASE-00041') {
  renderCaseDetail(caseId);
  showPage('case-detail');
  setCaseRightTab('details');
}

export function assignCaseToMe() {
  showToast({ type: 'success', title: 'Assigned', body: 'You are now the case owner (prototype).' });
  const banner = document.getElementById('case-owner-banner');
  if (banner) banner.style.display = 'none';
}

export function showServiceAppointmentDetail(serviceAppointmentId = 'SA-943473') {
  const sa = serviceAppointmentRecords[serviceAppointmentId] || serviceAppointmentRecords['SA-943473'];
  if (!sa) return;
  const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setText('sa-title', sa.title);
  setText('sa-sub', `Appointment Number ${sa.number}`);
  setText('sa-kf-parent', sa.parentRecord);
  setText('sa-parent', sa.parentRecord);
  setText('sa-kf-number', sa.number);
  setText('sa-d-status', sa.status);
  setText('sa-d-frequency', sa.frequency);
  setText('sa-d-hours', sa.hours);
  setText('sa-d-dur-tof3', sa.durationTof3);
  setText('sa-d-duration', sa.duration);
  setText('sa-d-backend-reminder', sa.backendReminder);
  setText('sa-c-date', sa.cancellationDate);
  setText('sa-c-by', sa.cancelledBy);
  setText('sa-addr', sa.address);
  setText('sa-territory', sa.territory);
  showPage('serviceappointment-detail');
}

// ─────────────────────────────────────────────
// Opportunities view toggle (used by onclick)
// ─────────────────────────────────────────────
export function toggleOppView(view) {
  const tableEl = document.getElementById('opp-table-view');
  const boardEl = document.getElementById('opp-board-view');
  const tableBtn = document.getElementById('opp-view-table');
  const boardBtn = document.getElementById('opp-view-board');

  if (!tableEl || !boardEl || !tableBtn || !boardBtn) return;

  if (view === 'board') {
    tableEl.style.display = 'none';
    boardEl.style.display = 'block';
    boardBtn.style.background = 'var(--sf-blue-bg)';
    boardBtn.style.color = 'var(--sf-blue)';
    boardBtn.style.borderColor = 'var(--sf-blue)';
    tableBtn.style.background = '';
    tableBtn.style.color = '';
    tableBtn.style.borderColor = '';
  } else {
    tableEl.style.display = 'block';
    boardEl.style.display = 'none';
    tableBtn.style.background = 'var(--sf-blue-bg)';
    tableBtn.style.color = 'var(--sf-blue)';
    tableBtn.style.borderColor = 'var(--sf-blue)';
    boardBtn.style.background = '';
    boardBtn.style.color = '';
    boardBtn.style.borderColor = '';
  }
}

// ─────────────────────────────────────────────
// Work Order detail (used by workspace router)
// ─────────────────────────────────────────────
export function setWorkOrderTab(tab) {
  const map = {
    details: 'wo-tab-details',
    'service-appointments': 'wo-tab-service-appointments',
    products: 'wo-tab-products',
    team: 'wo-tab-team',
    invoice: 'wo-tab-invoice',
    notes: 'wo-tab-notes',
  };
  const btns = {
    details: 'wo-tab-btn-details',
    'service-appointments': 'wo-tab-btn-sa',
    products: 'wo-tab-btn-products',
    team: 'wo-tab-btn-team',
    invoice: 'wo-tab-btn-invoice',
    notes: 'wo-tab-btn-notes',
  };
  Object.entries(btns).forEach(([k, id]) => {
    const el = document.getElementById(id);
    if (el) { el.classList.toggle('active', k === tab); el.setAttribute('aria-selected', String(k === tab)); }
  });
  Object.entries(map).forEach(([k, id]) => {
    const panel = document.getElementById(id);
    if (panel) panel.style.display = k === tab ? '' : 'none';
  });
  window.scrollTo(0, 0);
}

export function showWorkOrderDetail(workOrderId = 'WO-00941877') {
  const wo = workOrderRecords[workOrderId] || workOrderRecords['WO-00941877'];
  if (!wo) return;

  const title = document.getElementById('wo-title');
  if (title) title.textContent = wo.subject && wo.subject !== '—' ? wo.subject : wo.account;
  const sub = document.getElementById('wo-sub');
  if (sub) sub.textContent = `Work Order Number ${wo.number}`;

  const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setText('wo-kf-checklist', wo.checklist);
  setText('wo-kf-service', wo.serviceDescription);
  setText('wo-kf-product', wo.product);
  setText('wo-kf-number', wo.number);
  setText('wo-kf-team', wo.team);

  setText('wo-d-service', wo.serviceDescription);
  setText('wo-d-date', wo.date);
  setText('wo-d-frequency', wo.frequency);
  setText('wo-d-status', wo.status);
  setText('wo-d-hours', wo.hours);
  setText('wo-d-rate', wo.rate);
  setText('wo-d-cost', wo.cost);

  showPage('workorder-detail');
  setWorkOrderTab('details');
}

