import { showToast } from '../components/toast.js';
import { showPage, showWorkOrderDetail, workOrderRecords, setWorkOrderTab } from '../router.js';
import { NWO_DROPDOWN_OPTIONS } from '../constants/newWorkOrderDropdownOptions.js';

let nwoInjectPromise = null;
let nwoEscapeBound = false;

const NWO_APPT_DEFAULTS = ['Time Preference', 'Add ons', 'Notes to Cleaning team', 'Access Issues'];

function resetNwoApptLists() {
  const av = document.getElementById('nwo-appt-available');
  const ch = document.getElementById('nwo-appt-chosen');
  if (!av || !ch) return;
  ch.innerHTML = '';
  av.innerHTML = NWO_APPT_DEFAULTS.map((t) => `<option>${t}</option>`).join('');
}

function bindNwoEscapeOnce() {
  if (nwoEscapeBound) return;
  nwoEscapeBound = true;
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const o = document.getElementById('new-work-order-overlay');
    if (!o?.classList.contains('show')) return;
    closeNewWorkOrderModal();
  });
}

async function ensureNewWorkOrderOverlay() {
  if (document.getElementById('new-work-order-overlay')) {
    bindNwoEscapeOnce();
    return;
  }
  if (!nwoInjectPromise) {
    nwoInjectPromise = fetch('pages/new-work-order.html')
      .then(async (res) => {
        if (!res.ok) throw new Error(`Failed to load new-work-order.html (${res.status})`);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const el = doc.getElementById('new-work-order-overlay');
        if (!el) throw new Error('new-work-order-overlay not found in pages/new-work-order.html');
        const clone = el.cloneNode(true);
        clone.classList.remove('show');
        clone.setAttribute('aria-hidden', 'true');
        document.body.appendChild(clone);
        clone.addEventListener('click', (e) => {
          if (e.target === clone) closeNewWorkOrderModal();
        });
        bindNwoEscapeOnce();
      })
      .catch((err) => {
        nwoInjectPromise = null;
        throw err;
      });
  }
  await nwoInjectPromise;
}

function resetWorkOrderFormFields() {
  const panel = document.getElementById('nwo-panel-form');
  if (!panel) return;
  panel.querySelectorAll('input[type="checkbox"]').forEach((el) => { el.checked = false; });
  panel.querySelectorAll('textarea, input:not([type="checkbox"])').forEach((el) => { el.value = ''; });
  panel.querySelectorAll('select').forEach((el) => { el.selectedIndex = 0; });
  // Keep the same default as the screenshot for status dropdown.
  const st = document.getElementById('nwo-status');
  if (st && [...st.options].some((o) => o.value === 'New')) st.value = 'New';
  document.getElementById('ff-nwo-service-desc')?.classList.remove('is-invalid');
  resetNwoApptLists();
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setSelectOptionsWithNone(selectEl, items, { noneLabel = '--None--' } = {}) {
  if (!selectEl) return;
  const noneOpt = `<option value="">${escapeHtml(noneLabel)}</option>`;
  const opts = (items || [])
    .map((x) => {
      if (x && typeof x === 'object') {
        const v = String(x.value ?? '');
        const label = String(x.label ?? x.value ?? '');
        return `<option value="${escapeHtml(v)}">${escapeHtml(label)}</option>`;
      }
      const v = String(x);
      return `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`;
    })
    .join('');
  selectEl.innerHTML = noneOpt + opts;
}

function populateNewWorkOrderDropdownsOnce() {
  const overlay = document.getElementById('new-work-order-overlay');
  if (!overlay || overlay.dataset.nwoDropdowns === '1') return;

  setSelectOptionsWithNone(document.getElementById('nwo-frequency'), NWO_DROPDOWN_OPTIONS.frequency);
  setSelectOptionsWithNone(document.getElementById('nwo-status'), NWO_DROPDOWN_OPTIONS.status);
  setSelectOptionsWithNone(document.getElementById('nwo-can-reason'), NWO_DROPDOWN_OPTIONS.cancellationReason);
  setSelectOptionsWithNone(document.getElementById('nwo-can-charge'), NWO_DROPDOWN_OPTIONS.cancellationCharge);

  setSelectOptionsWithNone(document.getElementById('nwo-hard-floor'), NWO_DROPDOWN_OPTIONS.yesNo);
  setSelectOptionsWithNone(document.getElementById('nwo-pets'), NWO_DROPDOWN_OPTIONS.yesNo);
  setSelectOptionsWithNone(document.getElementById('nwo-parking'), NWO_DROPDOWN_OPTIONS.parking);
  setSelectOptionsWithNone(document.getElementById('nwo-garbage'), NWO_DROPDOWN_OPTIONS.garbageDisposal);

  // Billing & payment
  setSelectOptionsWithNone(document.getElementById('nwo-tax1-type'), NWO_DROPDOWN_OPTIONS.taxTypes);
  setSelectOptionsWithNone(document.getElementById('nwo-tax2-type'), NWO_DROPDOWN_OPTIONS.taxTypes);
  setSelectOptionsWithNone(document.getElementById('nwo-tax3-type'), NWO_DROPDOWN_OPTIONS.taxTypes);
  setSelectOptionsWithNone(document.getElementById('nwo-pay-type'), NWO_DROPDOWN_OPTIONS.paymentTypes);
  setSelectOptionsWithNone(document.getElementById('nwo-pay-recur'), NWO_DROPDOWN_OPTIONS.paymentRecurrence);

  // Information section
  setSelectOptionsWithNone(document.getElementById('nwo-reg-freq'), NWO_DROPDOWN_OPTIONS.regularCleaningFrequency);
  setSelectOptionsWithNone(document.getElementById('nwo-time-pref'), NWO_DROPDOWN_OPTIONS.emailTimePreferences);

  // Picklists that were present in the shared HTML snippet.
  setSelectOptionsWithNone(document.getElementById('nwo-dish-amt'), NWO_DROPDOWN_OPTIONS.dishesAmount);
  setSelectOptionsWithNone(document.getElementById('nwo-laundry-opt'), NWO_DROPDOWN_OPTIONS.laundryOptions);

  overlay.querySelectorAll('select[id^="nwo-freq-"]').forEach((el) => {
    // Disinfection frequency uses more descriptive labels in the source HTML.
    const id = el.getAttribute('id') || '';
    if (id === 'nwo-freq-13') {
      setSelectOptionsWithNone(el, NWO_DROPDOWN_OPTIONS.disinfectionFrequencyDetailed);
    } else {
      setSelectOptionsWithNone(el, NWO_DROPDOWN_OPTIONS.checklistFrequencyBasic);
    }
  });

  overlay.dataset.nwoDropdowns = '1';
}

export function closeNewWorkOrderModal() {
  const overlay = document.getElementById('new-work-order-overlay');
  if (!overlay) return;
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
}

export function nwoContinueFromType() {
  const kind = document.querySelector('#new-work-order-overlay input[name="nwo-kind"]:checked')?.value || 'onetime';
  const title = document.getElementById('nwo-dialog-title');
  const panelType = document.getElementById('nwo-panel-type');
  const panelForm = document.getElementById('nwo-panel-form');
  if (title) title.textContent = kind === 'regular' ? 'New Work Order: Regular WO' : 'New Work Order: One-Time WO';

  const dateLabel = document.getElementById('nwo-label-date');
  const mpLabel = document.getElementById('nwo-label-mp');
  const costLabel = document.getElementById('nwo-label-cost');
  if (kind === 'regular') {
    if (dateLabel && dateLabel.firstChild?.nodeType === Node.TEXT_NODE) dateLabel.firstChild.textContent = 'Suggested Maintenance Date ';
    if (mpLabel) mpLabel.textContent = 'Maintenance Plan';
    if (costLabel && costLabel.firstChild?.nodeType === Node.TEXT_NODE) costLabel.firstChild.textContent = 'Estimated Regular Cost ';
  } else {
    if (dateLabel && dateLabel.firstChild?.nodeType === Node.TEXT_NODE) dateLabel.firstChild.textContent = 'Initial/One-time Date ';
    if (mpLabel) mpLabel.textContent = 'Initial WO MP';
    if (costLabel && costLabel.firstChild?.nodeType === Node.TEXT_NODE) costLabel.firstChild.textContent = 'Estimated One-time Cost ';
  }

  panelType?.setAttribute('hidden', '');
  panelForm?.removeAttribute('hidden');
  setTimeout(() => document.getElementById('nwo-service-desc')?.focus(), 0);
}

export function nwoBackToType() {
  document.getElementById('nwo-panel-type')?.removeAttribute('hidden');
  document.getElementById('nwo-panel-form')?.setAttribute('hidden', '');
  const title = document.getElementById('nwo-dialog-title');
  if (title) title.textContent = 'New Work Order';
}

export function nwoApptMoveRight() {
  moveNwoListOptions('nwo-appt-available', 'nwo-appt-chosen');
}

export function nwoApptMoveLeft() {
  moveNwoListOptions('nwo-appt-chosen', 'nwo-appt-available');
}

function moveNwoListOptions(fromId, toId) {
  const from = document.getElementById(fromId);
  const to = document.getElementById(toId);
  if (!from || !to) return;
  [...from.selectedOptions].forEach((o) => to.appendChild(o));
}

export function saveNewWorkOrder({ andNew } = { andNew: false }) {
  const svc = (document.getElementById('nwo-service-desc')?.value || '').trim();
  document.getElementById('ff-nwo-service-desc')?.classList.toggle('is-invalid', !svc);
  if (!svc) {
    showToast({ type: 'error', title: 'Review required fields', body: 'Enter Service Description before saving.' });
    document.getElementById('nwo-service-desc')?.focus();
    return;
  }
  showToast({ type: 'success', title: 'Work Order saved', body: `${svc} (prototype — no record created)` });
  if (andNew) {
    resetWorkOrderFormFields();
    setTimeout(() => document.getElementById('nwo-service-desc')?.focus(), 0);
    return;
  }
  closeNewWorkOrderModal();
}

function getCurrentWorkOrderId() {
  const page = document.getElementById('page-workorder-detail');
  return page?.dataset?.workOrderId || 'WO-00941877';
}

function getNwoModalEl() {
  // During inline edit, the modal is re-parented into `#wo-edit-form-host`.
  const hostModal = document.querySelector('#wo-edit-form-host .modal--nwo');
  if (hostModal) return hostModal;
  return document.querySelector('#new-work-order-overlay .modal--nwo');
}

function stripMoneyInput(s) {
  // Keep digits/decimal but drop `$` and commas.
  return String(s || '')
    .trim()
    .replace(/[$,]/g, '');
}

function normalizeMoneyForRecord(s) {
  const raw = stripMoneyInput(s);
  if (!raw) return '—';
  return s && String(s).trim().startsWith('$') ? String(s).trim() : `$${raw}`;
}

function setNwoFormModeForKind(kind) {
  const title = document.getElementById('nwo-dialog-title');
  const panelType = document.getElementById('nwo-panel-type');
  const panelForm = document.getElementById('nwo-panel-form');
  if (title) title.textContent = kind === 'regular' ? 'Edit Work Order: Regular WO' : 'Edit Work Order: One-Time WO';

  const dateLabel = document.getElementById('nwo-label-date');
  const mpLabel = document.getElementById('nwo-label-mp');
  const costLabel = document.getElementById('nwo-label-cost');

  if (kind === 'regular') {
    if (dateLabel && dateLabel.firstChild?.nodeType === Node.TEXT_NODE) dateLabel.firstChild.textContent = 'Suggested Maintenance Date ';
    if (mpLabel) mpLabel.textContent = 'Maintenance Plan';
    if (costLabel && costLabel.firstChild?.nodeType === Node.TEXT_NODE) costLabel.firstChild.textContent = 'Estimated Regular Cost ';
  } else {
    if (dateLabel && dateLabel.firstChild?.nodeType === Node.TEXT_NODE) dateLabel.firstChild.textContent = 'Initial/One-time Date ';
    if (mpLabel) mpLabel.textContent = 'Initial WO MP';
    if (costLabel && costLabel.firstChild?.nodeType === Node.TEXT_NODE) costLabel.firstChild.textContent = 'Estimated One-time Cost ';
  }

  // Hide type choice; show the actual form.
  panelType?.setAttribute('hidden', '');
  panelForm?.removeAttribute('hidden');
}

function prefillNewWorkOrderFormFromRecord(wo) {
  if (!wo) return;

  // Choose form type based on frequency (prototype heuristic).
  const kind = wo.frequency && String(wo.frequency).toLowerCase().includes('one') ? 'onetime' : 'regular';
  const radio = document.querySelector(`input[name="nwo-kind"][value="${kind}"]`);
  if (radio) radio.checked = true;
  setNwoFormModeForKind(kind);

  const setVal = (id, v) => {
    const el = document.getElementById(id);
    if (!el || v === undefined || v === null) return;
    el.value = String(v);
  };
  const setSelectVal = (id, v) => {
    const el = document.getElementById(id);
    if (!el || v === undefined || v === null) return;
    el.value = String(v);
  };

  setVal('nwo-service-desc', wo.serviceDescription);
  setVal('nwo-initial-date', wo.date);
  setSelectVal('nwo-frequency', wo.frequency);
  setSelectVal('nwo-status', wo.status);
  setVal('nwo-est-hours', wo.hours);
  setVal('nwo-rate', wo.rate);
  setVal('nwo-est-cost', stripMoneyInput(wo.cost));

  setVal('nwo-checklist-link', wo.checklist);
  setVal('nwo-product-ck', wo.product);
  setVal('nwo-info-account', wo.account);
}

function exitWorkOrderEditMode({ rerender = true } = {}) {
  const workOrderId = getCurrentWorkOrderId();
  const overlay = document.getElementById('new-work-order-overlay');
  const host = document.getElementById('wo-edit-form-host');
  if (!overlay || !host) {
    if (rerender) showWorkOrderDetail(workOrderId);
    return;
  }

  const modal = getNwoModalEl();
  if (modal) {
    overlay.appendChild(modal);

    // Restore modal inline overrides.
    if (modal.dataset.origMaxHeight !== undefined) {
      modal.style.maxHeight = modal.dataset.origMaxHeight;
      delete modal.dataset.origMaxHeight;
    }
    if (modal.dataset.origOverflow !== undefined) {
      modal.style.overflow = modal.dataset.origOverflow;
      delete modal.dataset.origOverflow;
    }
    if (modal.dataset.origWidth !== undefined) {
      modal.style.width = modal.dataset.origWidth;
      delete modal.dataset.origWidth;
    }

    const closeBtn = modal.querySelector('.modal-header .al-close');
    const footer = modal.querySelector('.modal-footer');
    if (closeBtn && closeBtn.dataset.origDisplay !== undefined) {
      closeBtn.style.display = closeBtn.dataset.origDisplay;
      delete closeBtn.dataset.origDisplay;
    } else if (closeBtn) {
      closeBtn.style.display = '';
    }
    if (footer) {
      if (footer.dataset.origDisplay !== undefined) {
        footer.style.display = footer.dataset.origDisplay;
        delete footer.dataset.origDisplay;
      }

      // Restore inline edit footer controls back to New Work Order defaults.
      const buttons = Array.from(footer.querySelectorAll('button[type="button"]'));
      const cancelBtn = buttons.find((b) => b.textContent.trim() === 'Cancel');
      const saveNewBtn = buttons.find((b) => b.textContent.trim() === 'Save & New');
      const saveBtn = buttons.find((b) => b.textContent.trim() === 'Save');

      if (cancelBtn) {
        if (cancelBtn.dataset.origOnclick !== undefined) {
          cancelBtn.setAttribute('onclick', cancelBtn.dataset.origOnclick);
          delete cancelBtn.dataset.origOnclick;
        } else {
          cancelBtn.setAttribute('onclick', 'closeNewWorkOrderModal()');
        }
      }

      if (saveBtn) {
        if (saveBtn.dataset.origOnclick !== undefined) {
          saveBtn.setAttribute('onclick', saveBtn.dataset.origOnclick);
          delete saveBtn.dataset.origOnclick;
        } else {
          saveBtn.setAttribute('onclick', 'saveNewWorkOrder({ andNew: false })');
        }
      }

      if (saveNewBtn) {
        if (saveNewBtn.dataset.origDisplay !== undefined) {
          saveNewBtn.style.display = saveNewBtn.dataset.origDisplay;
          delete saveNewBtn.dataset.origDisplay;
        } else {
          saveNewBtn.style.display = '';
        }
      }
    }
  }

  const editWrap = document.getElementById('wo-details-edit');
  const readonlyWrap = document.getElementById('wo-details-readonly');
  if (editWrap) editWrap.style.display = 'none';
  if (readonlyWrap) readonlyWrap.style.display = '';

  if (rerender) showWorkOrderDetail(workOrderId);
}

export async function openWorkOrderEditMode() {
  const workOrderId = getCurrentWorkOrderId();
  const wo = workOrderRecords[workOrderId] || workOrderRecords['WO-00941877'];
  if (!wo) return;

  const editWrap = document.getElementById('wo-details-edit');
  const readonlyWrap = document.getElementById('wo-details-readonly');
  const host = document.getElementById('wo-edit-form-host');
  if (!editWrap || !readonlyWrap || !host) return;

  // Ensure the details tab is visible; avoid forcing scroll-to-top when already on Details.
  const detailsBtn = document.getElementById('wo-tab-btn-details');
  if (!detailsBtn?.classList.contains('active')) setWorkOrderTab('details');

  try {
    await ensureNewWorkOrderOverlay();
  } catch (err) {
    console.error(err);
    showToast({ type: 'error', title: 'Could not open edit form', body: 'Ensure pages/new-work-order.html exists.' });
    return;
  }

  populateNewWorkOrderDropdownsOnce();
  resetWorkOrderFormFields();

  // Modal gets re-parented so all field IDs remain unique in the DOM.
  const injectedOverlay = document.getElementById('new-work-order-overlay');
  const modalFromOverlay = injectedOverlay?.querySelector('.modal--nwo');
  if (modalFromOverlay && modalFromOverlay.parentElement !== host) host.appendChild(modalFromOverlay);

  const modal = getNwoModalEl();
  if (modal) {
    // When embedded inline, we want the surrounding page to scroll (so the page-level sticky
    // footer stays visible). Override modal's internal scroll behavior.
    if (modal.dataset.origMaxHeight === undefined) modal.dataset.origMaxHeight = modal.style.maxHeight;
    if (modal.dataset.origOverflow === undefined) modal.dataset.origOverflow = modal.style.overflow;
    if (modal.dataset.origWidth === undefined) modal.dataset.origWidth = modal.style.width;
    modal.style.maxHeight = 'none';
    modal.style.overflow = 'visible';
    modal.style.width = '100%';

    const closeBtn = modal.querySelector('.modal-header .al-close');
    if (closeBtn) {
      if (closeBtn.dataset.origDisplay === undefined) closeBtn.dataset.origDisplay = closeBtn.style.display;
      closeBtn.style.display = 'none';
    }

    // Reuse the modal footer buttons for inline edit.
    const footer = modal.querySelector('.modal-footer');
    if (footer) {
      if (footer.dataset.origDisplay === undefined) footer.dataset.origDisplay = footer.style.display;
      footer.style.display = 'none';

      const buttons = Array.from(footer.querySelectorAll('button[type="button"]'));
      const cancelBtn = buttons.find((b) => b.textContent.trim() === 'Cancel');
      const saveNewBtn = buttons.find((b) => b.textContent.trim() === 'Save & New');
      const saveBtn = buttons.find((b) => b.textContent.trim() === 'Save');

      if (cancelBtn) {
        if (cancelBtn.dataset.origOnclick === undefined) cancelBtn.dataset.origOnclick = cancelBtn.getAttribute('onclick') || '';
        cancelBtn.setAttribute('onclick', 'cancelWorkOrderEditMode()');
      }
      if (saveBtn) {
        if (saveBtn.dataset.origOnclick === undefined) saveBtn.dataset.origOnclick = saveBtn.getAttribute('onclick') || '';
        saveBtn.setAttribute('onclick', 'saveWorkOrderEdits()');
      }
      if (saveNewBtn) {
        if (saveNewBtn.dataset.origDisplay === undefined) saveNewBtn.dataset.origDisplay = saveNewBtn.style.display;
        saveNewBtn.style.display = 'none';
      }
    }
  }

  prefillNewWorkOrderFormFromRecord(wo);

  // Swap UI.
  readonlyWrap.style.display = 'none';
  editWrap.style.display = '';
  setTimeout(() => document.getElementById('nwo-service-desc')?.focus(), 0);
}

export function cancelWorkOrderEditMode() {
  exitWorkOrderEditMode({ rerender: true });
}

export function saveWorkOrderEdits() {
  const workOrderId = getCurrentWorkOrderId();
  const wo = workOrderRecords[workOrderId];
  if (!wo) return;

  const svc = (document.getElementById('nwo-service-desc')?.value || '').trim();
  document.getElementById('ff-nwo-service-desc')?.classList.toggle('is-invalid', !svc);
  if (!svc) {
    showToast({ type: 'error', title: 'Review required fields', body: 'Enter Service Description before saving.' });
    document.getElementById('nwo-service-desc')?.focus();
    return;
  }

  const updated = {
    serviceDescription: svc,
    date: (document.getElementById('nwo-initial-date')?.value || '').trim(),
    frequency: (document.getElementById('nwo-frequency')?.value || '').trim(),
    status: (document.getElementById('nwo-status')?.value || '').trim(),
    hours: (document.getElementById('nwo-est-hours')?.value || '').trim(),
    rate: (document.getElementById('nwo-rate')?.value || '').trim(),
    cost: normalizeMoneyForRecord(document.getElementById('nwo-est-cost')?.value || ''),
    checklist: (document.getElementById('nwo-checklist-link')?.value || '').trim(),
    product: (document.getElementById('nwo-product-ck')?.value || '').trim() || '—',
    account: (document.getElementById('nwo-info-account')?.value || '').trim(),
  };

  Object.assign(wo, updated);
  showToast({ type: 'success', title: 'Work Order updated', body: 'Changes saved to the prototype record.' });

  // Exit edit mode and rerender read-only fields.
  exitWorkOrderEditMode({ rerender: true });
}

export async function openNewWorkOrder() {
  try {
    await ensureNewWorkOrderOverlay();
  } catch (err) {
    console.error(err);
    showToast({ type: 'error', title: 'Could not open form', body: 'Ensure the app is served over HTTP and pages/new-work-order.html exists.' });
    return;
  }
  const overlay = document.getElementById('new-work-order-overlay');
  if (!overlay) return;

  populateNewWorkOrderDropdownsOnce();
  nwoBackToType();
  resetWorkOrderFormFields();
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => overlay.querySelector('input[name="nwo-kind"]')?.focus(), 0);
}

export function openNewCase(prefill = {}) {
  const overlay = document.getElementById('new-case-overlay');
  if (!overlay) return;
  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');

  document.getElementById('nc-subject') && (document.getElementById('nc-subject').value = prefill.subject || '');
  document.getElementById('nc-description') && (document.getElementById('nc-description').value = prefill.description || '');
  document.getElementById('nc-account') && (document.getElementById('nc-account').value = prefill.account || '');
  document.getElementById('nc-contact') && (document.getElementById('nc-contact').value = prefill.contact || '');
  document.getElementById('nc-territory') && (document.getElementById('nc-territory').value = prefill.territory || '');
  document.getElementById('nc-appointment') && (document.getElementById('nc-appointment').value = prefill.appointment || '');
  document.getElementById('nc-origin') && (document.getElementById('nc-origin').value = prefill.origin || '');
  document.getElementById('nc-status') && (document.getElementById('nc-status').value = prefill.status || 'New');
  document.getElementById('nc-priority') && (document.getElementById('nc-priority').value = prefill.priority || 'Medium');

  document.getElementById('ff-nc-subject')?.classList.remove('is-invalid');
  document.getElementById('ff-nc-origin')?.classList.remove('is-invalid');

  setTimeout(() => document.getElementById('nc-subject')?.focus(), 0);
}

export function closeNewCaseModal() {
  const overlay = document.getElementById('new-case-overlay');
  if (!overlay) return;
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
}

export function saveNewCase({ andNew } = { andNew: false }) {
  const subject = (document.getElementById('nc-subject')?.value || '').trim();
  const origin = (document.getElementById('nc-origin')?.value || '').trim();

  document.getElementById('ff-nc-subject')?.classList.toggle('is-invalid', !subject);
  document.getElementById('ff-nc-origin')?.classList.toggle('is-invalid', !origin);

  if (!subject || !origin) {
    showToast({ type: 'error', title: 'Review required fields', body: 'Complete the required fields before saving.' });
    (subject ? document.getElementById('nc-origin') : document.getElementById('nc-subject'))?.focus();
    return;
  }

  showToast({ type: 'success', title: 'Case created', body: subject });

  if (andNew) {
    openNewCase({ origin });
    return;
  }

  closeNewCaseModal();
}

export function openNewLead(prefill = {}) {
  showPage('lead-new');
  resetNewLeadForm(prefill);
  setTimeout(() => document.getElementById('nl-last-name')?.focus(), 0);
}

export function cancelNewLead() {
  showPage('leads');
}

export function resetNewLeadForm(prefill = {}) {
  const form = document.getElementById('new-lead-form');
  form?.reset();
  ['ff-lastname', 'ff-company'].forEach((id) => document.getElementById(id)?.classList.remove('is-invalid'));

  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el && v !== undefined) el.value = v;
  };
  set('nl-salutation', prefill.salutation);
  set('nl-first-name', prefill.firstName);
  set('nl-last-name', prefill.lastName);
  set('nl-company', prefill.company);
  set('nl-title', prefill.title);
  set('nl-status', prefill.status);
  set('nl-source', prefill.source);
  set('nl-industry', prefill.industry);
  set('nl-phone', prefill.phone);
  set('nl-email', prefill.email);
  set('nl-website', prefill.website);
  set('nl-rating', prefill.rating);
  set('nl-description', prefill.description);
  set('nl-street', prefill.street);
  set('nl-city', prefill.city);
  set('nl-state', prefill.state);
  set('nl-postal', prefill.postal);
  set('nl-country', prefill.country);
}

export function saveNewLead({ andNew } = { andNew: false }) {
  const lastName = (document.getElementById('nl-last-name')?.value || '').trim();
  const company = (document.getElementById('nl-company')?.value || '').trim();

  const ffLast = document.getElementById('ff-lastname');
  const ffCo = document.getElementById('ff-company');
  ffLast?.classList.toggle('is-invalid', !lastName);
  ffCo?.classList.toggle('is-invalid', !company);

  if (!lastName || !company) {
    showToast({ type: 'error', title: 'Review required fields', body: 'Complete the required fields before saving.' });
    (lastName ? document.getElementById('nl-company') : document.getElementById('nl-last-name'))?.focus();
    return;
  }

  const firstName = (document.getElementById('nl-first-name')?.value || '').trim();
  const fullName = `${firstName ? firstName + ' ' : ''}${lastName}`.trim();

  showToast({ type: 'success', title: 'Lead created', body: `${fullName} • ${company}` });

  if (andNew) {
    resetNewLeadForm({ status: document.getElementById('nl-status')?.value || 'New' });
    setTimeout(() => document.getElementById('nl-last-name')?.focus(), 0);
    return;
  }

  showPage('leads');
}

export function openNewAccount(prefill = {}) {
  showPage('account-new');
  resetNewAccountForm(prefill);
  setTimeout(() => {
    const rt = document.getElementById('na-record-type')?.value || 'person';
    const focusId = rt === 'business' ? 'na-account-name' : 'na-last-name';
    document.getElementById(focusId)?.focus();
  }, 0);
}

export function cancelNewAccount() {
  showPage('accounts');
}

export function onAccountRecordTypeChange() {
  const rt = document.getElementById('na-record-type')?.value || 'person';
  const isPerson = rt === 'person';

  const titleEl = document.getElementById('na-title');
  if (titleEl) titleEl.textContent = `New Account: ${isPerson ? 'Person Account' : 'Business Account'}`;

  const show = (id, v) => { const el = document.getElementById(id); if (el) el.style.display = v ? '' : 'none'; };
  ['ff-na-salutation', 'ff-na-first', 'ff-na-middle', 'ff-na-last', 'ff-na-suffix'].forEach((id) => show(id, isPerson));
  show('ff-na-service-territory', isPerson);

  show('ff-na-account-name', !isPerson);
  show('ff-na-type', !isPerson);

  document.getElementById('ff-na-last')?.classList.remove('is-invalid');
  document.getElementById('ff-na-account-name')?.classList.remove('is-invalid');
}

export function resetNewAccountForm(prefill = {}) {
  const form = document.getElementById('new-account-form');
  form?.reset();
  document.getElementById('ff-na-last')?.classList.remove('is-invalid');
  document.getElementById('ff-na-account-name')?.classList.remove('is-invalid');

  const set = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined) el.value = v; };
  set('na-record-type', prefill.recordType);
  set('na-owner', prefill.owner);
  set('na-salutation', prefill.salutation);
  set('na-first-name', prefill.firstName);
  set('na-middle-name', prefill.middleName);
  set('na-last-name', prefill.lastName);
  set('na-suffix', prefill.suffix);
  set('na-service-territory', prefill.serviceTerritory);
  set('na-account-name', prefill.accountName);
  set('na-type', prefill.type);
  set('na-phone', prefill.phone);
  set('na-email', prefill.email);
  set('na-mobile', prefill.mobile);
  set('na-description', prefill.description);
  set('na-mobile-2', prefill.mobile2);
  set('na-home-2', prefill.home2);
  set('na-other-2', prefill.other2);
  set('na-mobile-3', prefill.mobile3);
  set('na-work-phone', prefill.workPhone);
  set('na-override-contact', prefill.overrideContact);
  set('na-is-primary', prefill.isPrimary);
  set('na-key-code', prefill.keyCode);
  set('na-primary-contact-email', prefill.primaryContactEmail);
  set('na-hear-other', prefill.hearOther);
  set('na-dnc', prefill.doNotCall);
  set('na-account-source', prefill.accountSource);
  set('na-email-opt-out', prefill.emailOptOut);
  set('na-preferred-day', prefill.preferredDay);
  set('na-street-name', prefill.streetName);
  set('na-street-number', prefill.streetNumber);
  set('na-billing-street', prefill.billingStreet);
  set('na-billing-city', prefill.billingCity);
  set('na-billing-state', prefill.billingState);
  set('na-billing-postal', prefill.billingPostal);
  set('na-billing-country', prefill.billingCountry);

  if (!document.getElementById('na-record-type')?.value) document.getElementById('na-record-type').value = 'person';
  onAccountRecordTypeChange();
}

export function saveNewAccount({ andNew } = { andNew: false }) {
  const rt = document.getElementById('na-record-type')?.value || 'person';
  const isPerson = rt === 'person';

  const lastName = (document.getElementById('na-last-name')?.value || '').trim();
  const accountName = (document.getElementById('na-account-name')?.value || '').trim();

  const ffLast = document.getElementById('ff-na-last');
  const ffName = document.getElementById('ff-na-account-name');

  if (isPerson) {
    ffLast?.classList.toggle('is-invalid', !lastName);
    ffName?.classList.remove('is-invalid');
    if (!lastName) {
      showToast({ type: 'error', title: 'Review required fields', body: 'Complete the required fields before saving.' });
      document.getElementById('na-last-name')?.focus();
      return;
    }
  } else {
    ffName?.classList.toggle('is-invalid', !accountName);
    ffLast?.classList.remove('is-invalid');
    if (!accountName) {
      showToast({ type: 'error', title: 'Review required fields', body: 'Complete the required fields before saving.' });
      document.getElementById('na-account-name')?.focus();
      return;
    }
  }

  const firstName = (document.getElementById('na-first-name')?.value || '').trim();
  const displayName = isPerson ? `${firstName ? firstName + ' ' : ''}${lastName}`.trim() : accountName;

  showToast({ type: 'success', title: 'Account created', body: `${displayName}${isPerson ? ' • Person Account' : ''}` });

  if (andNew) {
    resetNewAccountForm({ recordType: rt });
    setTimeout(() => (isPerson ? document.getElementById('na-last-name') : document.getElementById('na-account-name'))?.focus(), 0);
    return;
  }

  showPage('accounts');
}

