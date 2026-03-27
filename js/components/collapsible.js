export function initCollapsibles() {
  const saPage = document.getElementById('page-serviceappointment-detail');
  const saCards = saPage?.querySelectorAll('.js-collapsible');
  const accountDetailScope = document.querySelector('#acc-tab-details[data-collapsible-scope]');
  const accountCards = accountDetailScope?.querySelectorAll('.js-collapsible');

  // Keep service appointment detail sections collapsed on first render.
  saCards?.forEach((card) => card.classList.add('is-collapsed'));
  // Keep account detail sections collapsed on first render.
  accountCards?.forEach((card) => card.classList.add('is-collapsed'));

  document.addEventListener('click', (e) => {
    const expandAllBtn = e.target.closest?.('.js-expand-all-sections');
    if (expandAllBtn) {
      const container = expandAllBtn.closest('[data-collapsible-scope]');
      container?.querySelectorAll('.js-collapsible').forEach((card) => card.classList.remove('is-collapsed'));
      return;
    }

    const collapseAllBtn = e.target.closest?.('.js-collapse-all-sections');
    if (collapseAllBtn) {
      const container = collapseAllBtn.closest('[data-collapsible-scope]');
      container?.querySelectorAll('.js-collapsible').forEach((card) => card.classList.add('is-collapsed'));
      return;
    }

    const header = e.target.closest?.('.js-collapsible .section-card-header');
    if (!header) return;
    const card = header.closest('.js-collapsible');
    if (!card) return;
    card.classList.toggle('is-collapsed');
  });
}

