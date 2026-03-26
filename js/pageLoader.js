const ROUTES = [
  "leads",
  "accounts",
  "contacts",
  "opportunities",
  "cases",
  "workorders",
  "lead-detail",
  "lead-new",
  "account-detail",
  "account-new",
  "case-detail",
  "workorder-detail",
  "serviceappointment-detail",
];

async function fetchPage(route) {
  const res = await fetch(`pages/${route}.html`);
  if (!res.ok) throw new Error(`Failed loading page partial: ${route}`);
  return res.text();
}

export async function loadAllPages(rootId = "pages-root") {
  const root = document.getElementById(rootId);
  if (!root) throw new Error(`Missing #${rootId} mount node`);

  const parts = await Promise.all(ROUTES.map(fetchPage));
  root.innerHTML = parts.join("\n");
}
