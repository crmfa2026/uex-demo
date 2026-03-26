export function initCollapsibles() {
  document.addEventListener('click', (e) => {
    const header = e.target.closest?.('.js-collapsible .section-card-header');
    if (!header) return;
    const card = header.closest('.js-collapsible');
    if (!card) return;
    card.classList.toggle('is-collapsed');
  });
}

