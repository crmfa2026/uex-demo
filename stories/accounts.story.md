# User stories: Accounts — All Accounts list, account detail (Details + all record tabs)

Follows `tasks/product-owner.md`. Anchored to `pages/accounts.html`, `pages/account-detail.html`, `js/router.js` (`openAccountInTab`, `showAccountDetail`, `setAccountDetailTab`), `js/app.js` (object view tabs, `#new-btn`).

---

## Epic summary / title

**Accounts workspace: open All Accounts, browse and open a record, and use account detail tabs (Details through Payment Methods).**

## Story type

User stories (functional + UX); prototype assumptions noted under Scope.

---

## Story 1 — All Accounts list (`#obj-views` → All Accounts, `#page-accounts`)

### Description

**As a** CRM user working accounts,
**I want** the Accounts workspace to show the **All Accounts** list with search, filters, counts, and row actions,
**So that** I can find accounts and open a record to work it.

### Context

- Accounts are company-level records; the list matches Salesforce-style list views (`objMeta.accounts.views` in `router.js`: All Accounts, My Accounts, Recently Viewed).
- The default list title and table are implemented in `pages/accounts.html` as **All Accounts** with a numeric badge (e.g. 18).

### Scope

| In scope | Out of scope |
|----------|----------------|
| Global nav → Accounts (`openWorkspaceList('accounts')`), object header with view tabs including **All Accounts** (`.obj-view-tab.active`) | View tabs **My Accounts** / **Recently Viewed** changing query results (prototype only toggles `.active` on click; no data switch) |
| List: title + count, **Import**, search placeholder “Search accounts…”, filters **All Types** / **All Industries** / **All Owners** | Functional import, server-backed search/filter |
| Table: checkbox column, Account name (link row), Type badge, Industry, Phone, Contacts count, Open WOs, Owner, Last activity, row actions | Bulk actions beyond selection UI, real-time last activity sync |
| Row click → `openAccountInTab(accountId)` opens account detail in workspace | Permissions, field-level security |

### DOM / UI anchors

- Object views: `div#obj-views` → `div.obj-view-tab` (first tab **All Accounts** when Accounts workspace is active — content driven by `router.js` `setWorkspaceObject`).
- List page: `#page-accounts`, `pages/accounts.html`.
- Row: `onclick="openAccountInTab('…')"` (e.g. `acme`, `fieldpro`).

### Acceptance criteria

1. **Given** the user opens Accounts from global navigation, **when** the Accounts workspace loads, **then** the object header shows view tabs and the first tab **All Accounts** is visually active (`.obj-view-tab.active`).
2. **Given** the All Accounts list is shown, **when** the user reads the header region, **then** the title **All Accounts** appears with a list count (`span.list-count`) and an **Import** control is visible.
3. **Given** the list is visible, **when** the user inspects the toolbar, **then** a search field with placeholder **Search accounts…** and filter buttons **All Types**, **All Industries**, **All Owners** are present (`pages/accounts.html`).
4. **Given** the table is visible, **when** the user scans columns, **then** headers include Account name, Type, Industry, Phone, Contacts, Open WOs, Owner, Last activity (plus selection and actions columns as implemented).
5. **Given** a data row, **when** the user clicks the row (outside checkbox stopPropagation), **then** `openAccountInTab` runs and the account detail opens under the Accounts workspace tab group (`router.js`).
6. **Given** a row checkbox, **when** the user toggles it, **then** the row click does not fire for that interaction (`event.stopPropagation()` on checkbox).

### QA test matrix (Story 1)

| ID | Type | Scenario |
|----|------|----------|
| A1 | Positive | Nav to Accounts → All Accounts active, list visible |
| A2 | Positive | Click row → account detail tab opens |
| A3 | Edge | Click checkbox only → row navigation does not fire |
| A4 | Negative | My Accounts tab click → (prototype) visual active only; list title still All Accounts unless implemented |

---

## Story 2 — Account detail: header, key fields, and **Details** tab (`#page-account-detail`, `#acc-tab-details`)

### Description

**As a** user reviewing an account,
**I want** to see the record header, compact key metrics, and the **Details** tab with all information sections,
**So that** I understand the account profile and operational flags at a glance.

### Context

- Opening an account runs `showAccountDetail(accountId)` which hydrates dynamic fields from `accountRecords` in `router.js` and shows `#page-account-detail`; default sub-tab is **Details** (`setAccountDetailTab('details')`).
- **Details** includes collapsible sections with **Expand all** / **Collapse all** (`data-collapsible-scope`, `js/components/collapsible.js`).

### Scope

| In scope | Out of scope |
|----------|----------------|
| Record header: avatar, **Account** label, title `#acc-record-title`, subtitle `#acc-record-sub`, actions **New contact**, **New case**, **Edit**, **New WO** | Persisting edits; modal flows unless already wired elsewhere |
| Key fields: Type, Industry, Annual revenue, Open work orders, Owner (`#acc-kf-*`) | Revenue calculation rules |
| **Details** sections and fields as in `pages/account-detail.html` (see field inventory below) | Every legacy field populated from API in prototype |

### Field inventory — Details tab (from `pages/account-detail.html`)

**Account Information:** Account Name (`#acc-side-name`), Account Record Type, Alert Manual Enabled, Parent Account, Alert Manual Text, Service Territory 1–3, Halt Job Creation, Refuse Service, Refuse Service Reason.

**Account Frequency Type:** One Time Account, Recurring Account, Active One Time Account, Active Recurring Account, Inactive Onetime Account, Inactive Recurring Account, Active Both OneTime and Recurring, Prospective Account (checkbox-style display).

**Primary Contact Information:** Primary Contact Name, Address, Mobile, Email, City, Province, Postal Code.

**Legacy Contact Info:** Customer ID, Note ID, Barter Description, Customer Status, Mobile Phone 2, Home Phone 2, Other Phone 2, Other Phone 3.

**System Information:** Created By, Last Modified By (user + timestamp).

### DOM / UI anchors

- Page: `#page-account-detail`.
- Details tab button: `#acc-tab-btn-details`, `setAccountDetailTab('details')`.
- Panel: `#acc-tab-details`.

### Acceptance criteria

1. **Given** an account is opened from the list, **when** the detail page renders, **then** `#acc-record-title` and `#acc-record-sub` reflect the selected account (`showAccountDetail`).
2. **Given** the header, **when** the user views key fields, **then** Type (`#acc-kf-type`), Industry (`#acc-kf-industry`), Annual revenue (`#acc-kf-revenue`), Open work orders (`#acc-kf-open-wos`), Owner (`#acc-kf-owner`) show values consistent with `accountRecords` for that id.
3. **Given** the **Details** tab is active, **when** the user views **Account Information**, **then** all labeled fields listed in the field inventory are visible (empty fields may show muted/blank per design).
4. **Given** **Details**, **when** the user uses **Expand all** / **Collapse all**, **then** collapsible sections respond without losing tab selection.
5. **Given** **System Information**, **when** the user reads audit fields, **then** Created By and Last Modified By show user and timestamp text as in markup.
6. **Given** an unknown tab id passed to `setAccountDetailTab`, **when** the router normalizes, **then** **Details** is shown (`setAccountDetailTab` falls back to `details`).

### QA test matrix (Story 2)

| ID | Type | Scenario |
|----|------|----------|
| D1 | Positive | Open account → Details active, header + key fields populated |
| D2 | Positive | Expand all / Collapse all on Details sections |
| D3 | Edge | Invalid tab name via API/console → defaults to Details |
| D4 | Regression | Account Name in Details (`#acc-side-name`) matches title |

---

## Story 3 — Account detail: record tabs (Contacts → Payment Methods)

### Description

**As a** user working an account end-to-end,
**I want** to switch among **Contacts**, **Cases**, **Work Orders**, **Cancelled Jobs**, **Customer Satisfaction**, **Invoices**, and **Payment Methods**,
**So that** I can review related records without leaving the account.

### Context

- Tab ids supported by `setAccountDetailTab`: `details`, `contacts`, `cases`, `workorders`, `cancelled-jobs`, `customer-satisfaction`, `invoices`, `payment-methods` (`router.js`).
- Each tab has a button `#acc-tab-btn-{id}` and panel `#acc-tab-{id}`; inactive panels use `display:none`.

### Scope

| In scope | Out of scope |
|----------|----------------|
| Tab strip `role="tablist"` / `role="tab"` / `aria-selected` updates | Full keyboard roving tabindex (verify against product a11y spec) |
| **Contacts:** related table (Contact Name, IsPrimary, Email, Mobile, Other Phone), **New contact**, aside **Account details** summary | Contact create save |
| **Cases:** related table (Case #, Subject, Status, Priority, Open WOs), **New case**, aside | Case resolution workflow |
| **Work Orders:** table columns WO Number, Status, Type, Agent, Scheduled, SLA due; **New WO**; aside **Work order summary** | WO scheduling engine |
| **Cancelled Jobs / Customer Satisfaction / Invoices / Payment Methods:** list headers, counts, empty states as marked up | Payment processing |

### DOM / UI anchors

- Tabs: `#acc-tab-btn-contacts` … `#acc-tab-btn-payment-methods`.
- Panels: `#acc-tab-contacts`, `#acc-tab-cases`, `#acc-tab-workorders`, `#acc-tab-cancelled-jobs`, `#acc-tab-customer-satisfaction`, `#acc-tab-invoices`, `#acc-tab-payment-methods`.

### Acceptance criteria

1. **Given** account detail is open, **when** the user clicks **Contacts** (`#acc-tab-btn-contacts`), **then** `#acc-tab-contacts` is visible, other tab panels are hidden, and the tab’s `aria-selected` is true for Contacts only.
2. **Given** **Contacts**, **when** the user clicks a contact row, **then** `openContactInTab('contact-albi-paul')` runs as implemented (account context preserves tab group per `router.js`).
3. **Given** **Cases**, **when** the user clicks a case row, **then** `openCaseInTab` runs with the case id shown in markup.
4. **Given** **Work Orders**, **when** the user views the summary aside, **then** Account, Open work orders, and Next scheduled (`#acc-wo-side-account`, `#acc-wo-side-open`, `#acc-wo-side-next`) reflect `accountRecords` hydration for the open account.
5. **Given** **Cancelled Jobs**, **when** there are zero rows, **then** the empty message **No cancelled jobs for this account.** is shown.
6. **Given** **Customer Satisfaction**, **when** no data, **then** **No customer satisfaction records available.** is shown.
7. **Given** **Invoices** / **Payment Methods**, **when** no data, **then** respective empty messages appear (`pages/account-detail.html`).
8. **Given** the user switches tabs in any order, **when** returning to **Details**, **then** `#acc-tab-details` displays and scroll position resets per `window.scrollTo(0, 0)` in `setAccountDetailTab`.

### QA test matrix (Story 3)

| ID | Type | Scenario |
|----|------|----------|
| T1 | Positive | Click each of 8 tabs → correct panel visible, one `aria-selected="true"` |
| T2 | Positive | Contacts → row → contact opens (account context) |
| T3 | Positive | Cases → row → case detail opens |
| T4 | Edge | Rapid tab switching → no mixed visible panels |
| T5 | Negative | Empty related tabs show documented empty copy |

---

## Cross-cutting assumptions (prototype)

- **Persistence:** Data is client mock (`accountRecords`, static HTML); no requirement for API persistence in acceptance criteria unless backend is added.
- **Object view tabs (My Accounts / Recently Viewed):** Click updates active styling only; **All Accounts** list content is unchanged unless a future story implements filtering.

---

## JIRA metadata (suggested)

- **Labels:** `accounts`, `list-view`, `account-detail`, `tabs`, `field-service` (if team uses it).
- **Components:** CRM UI / Accounts.
- **Story points:** Story 1: S; Story 2: M (field coverage); Story 3: M (tab + related lists).

---

*Version: 1.0 — aligned to Field Agent CRM prototype HTML/JS.*
