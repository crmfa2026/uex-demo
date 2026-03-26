import { showToast } from '../components/toast.js';
import { showPage } from '../router.js';

export function openNewWorkOrder() {
  showToast({ type: 'success', title: 'New Work Order', body: 'Work Order create screen can be added next.' });
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

