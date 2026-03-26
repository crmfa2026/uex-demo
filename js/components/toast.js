export function showToast({ type = 'success', title = '', body = '' } = {}) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    el.innerHTML = `<div class="toast-title" id="toast-title"></div><div class="toast-body" id="toast-body"></div>`;
    document.body.appendChild(el);
  }

  el.classList.remove('success', 'error');
  el.classList.add(type === 'error' ? 'error' : 'success');
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-body').textContent = body;

  el.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove('show'), 3200);
}

