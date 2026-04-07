function setActiveTab(tabId) {
  const tabCleaning = document.getElementById('cp-tab-cleaning');
  const tabBooking = document.getElementById('cp-tab-booking');
  const panelCleaning = document.getElementById('cp-panel-cleaning');
  const panelBooking = document.getElementById('cp-panel-booking');
  if (!tabCleaning || !tabBooking || !panelCleaning || !panelBooking) return;

  const isCleaning = tabId === 'cleaning';

  tabCleaning.classList.toggle('is-active', isCleaning);
  tabBooking.classList.toggle('is-active', !isCleaning);

  tabCleaning.setAttribute('aria-selected', isCleaning ? 'true' : 'false');
  tabBooking.setAttribute('aria-selected', !isCleaning ? 'true' : 'false');

  panelCleaning.classList.toggle('is-active', isCleaning);
  panelBooking.classList.toggle('is-active', !isCleaning);
}

function initTabs() {
  document.getElementById('cp-tab-cleaning')?.addEventListener('click', () => setActiveTab('cleaning'));
  document.getElementById('cp-tab-booking')?.addEventListener('click', () => setActiveTab('booking'));
  document.getElementById('cp-continue-booking')?.addEventListener('click', () => setActiveTab('booking'));
}

function initToggles() {
  document.querySelectorAll('.cp-toggle').forEach((group) => {
    group.addEventListener('click', (e) => {
      const btn = e.target.closest?.('.cp-toggle-btn');
      if (!btn) return;
      group.querySelectorAll('.cp-toggle-btn').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });
}

function initAddons() {
  document.querySelectorAll('.cp-addon').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('is-selected');
    });
  });
}

function initHelpAccordion() {
  document.querySelectorAll('.cp-help-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });
}

initTabs();
initToggles();
initAddons();
initHelpAccordion();
