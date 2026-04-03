# User stories: Work Orders — list, detail tabs, read-only section edit, and inline edit

Follows `@tasks/product-owner.md`. Anchored to `pages/workorders.html`, `pages/workorder-detail.html`, `pages/new-work-order.html`, and JS handlers in `js/app.js`, `js/router.js`, and `js/pages/forms.js`.

---

## Epic summary / title
**Work Orders workspace: open the Work Orders list, open a record detail page, use section-level Edit to enter an inline edit mode with a sticky Save/Cancel footer, and create a new Work Order via the New Work Order modal.**

## Story type
User stories (functional + UX); prototype behavior explicitly called out under Scope.

---

## Story 1 — Work Orders workspace list (`#page-workorders`)

### Description
**As a** CRM user working service work orders,  
**I want** the Work Orders list to show searchable/filterable rows and let me open a record,  
**So that** I can navigate to the Work Order details quickly.

### Context
- The Work Orders workspace renders `pages/workorders.html` under `div#page-workorders`.
- Filtering is implemented client-side in `js/app.js` (`setupWorkOrdersListViewFilter`) by toggling row `style.display` based on:
  - pinned list filters in `#workorders-listview-menu` (`data-filter` values like `recent`, `all`, and cities such as `Calgary`)
  - search input `#workorders-listview-search-input` matching `tr.textContent`.

### Scope
| In scope | Out of scope |
|----------|--------------|
| List header: `#workorders-listview-btn` (dropdown), `#workorders-listview-label`, `#workorders-listview-count`, and search `input#workorders-listview-search-input` | Server-backed search/filter, pagination |
| Filter menu items (Recently Viewed + All Work Orders + City filters) | Filter persistence across navigation |
| Table: checkbox column with `event.stopPropagation()`, and clickable row opens record in a workspace tab (`openWorkOrderInTab`) | Bulk selection/actions |
| **New** button opens New Work Order modal (`openNewWorkOrder()`) | Creating persisted records |

### DOM / UI anchors
- Page: `#page-workorders`
- Filter: `#workorders-listview-btn`, `#workorders-listview-menu`, `#workorders-listview-search-input`, `#workorders-listview-label`, `#workorders-listview-count`
- Rows: `table.data-table tbody tr[onclick="openWorkOrderInTab('…')"]`
- New action: `button` with `onclick="openNewWorkOrder()"`

### Acceptance criteria
1. **Given** the Work Orders page is open, **when** the user clicks the list view button (`#workorders-listview-btn`), **then** the dropdown menu (`#workorders-listview-menu`) toggles `aria-hidden` and visibility (`hidden` toggles).
2. **Given** a filter is selected (e.g. `data-filter="recent"` or `data-filter="Calgary"`), **when** the filter is applied, **then** rows update visibility via `tr.style.display` and `#workorders-listview-count` updates to the number of visible rows.
3. **Given** the user types into `#workorders-listview-search-input`, **when** the input changes, **then** only rows whose `tr.textContent` includes the query (case-insensitive) remain visible.
4. **Given** the table row is visible, **when** the user clicks the row (outside the checkbox), **then** `openWorkOrderInTab(workOrderId)` runs and opens `page-workorder-detail` inside the workspace tab group.
5. **Given** the user clicks the row checkbox, **when** the checkbox is toggled, **then** the row navigation does not trigger (`event.stopPropagation()` works on the checkbox).
6. **Given** the user clicks **New** on the Work Orders list, **when** the click is executed, **then** the New Work Order modal overlay is opened (see Story 5).

### QA test matrix (Story 1)
| ID | Type | Scenario |
|----|------|----------|
| W1 | Positive | Nav to Work Orders list → default “Recently Viewed” filter applied |
| W2 | Positive | Select “Calgary” filter → only matching rows visible; count updates |
| W3 | Positive | Type search query → matching rows visible; count updates indirectly by filter visibility |
| W4 | Edge | Click checkbox only → no record opens |
| W5 | Positive | Click row → Work Order detail tab opens |
| W6 | Positive | Click **New** → New Work Order modal opens |

---

## Story 2 — Work Order detail page: tabs and read-only hydration (`#page-workorder-detail`)

### Description
**As a** user reviewing a Work Order,  
**I want** the Work Order detail page to show a properly populated header, a Details tab, and additional tabs,  
**So that** I can navigate related information without leaving the record.

### Context
- Opening a Work Order uses `showWorkOrderDetail(workOrderId)` in `js/router.js`.
- The Details tab uses `setWorkOrderTab(tab)` to toggle tab buttons and show/hide panels (`#wo-tab-details`, `#wo-tab-service-appointments`, etc.).

### Scope
| In scope | Out of scope |
|----------|--------------|
| Header: `#wo-kicker`, `#wo-title`, `#wo-sub` | Follow action persistence |
| Key fields: `#wo-kf-checklist`, `#wo-kf-service`, `#wo-kf-product`, `#wo-kf-number`, `#wo-kf-team` | Field derivation rules beyond prototype mappings |
| Tabs: Details, Service Appointment, Products, Team Preference, Invoice, Notes, Files & History | Non-Details tabs full CRUD (prototype-only placeholders) |
| Details tab: read-only display of fields and collapsible sections | Editing (Story 4) |

### DOM / UI anchors
- Page: `#page-workorder-detail`
- Tabs:
  - Button ids: `#wo-tab-btn-details`, `#wo-tab-btn-sa`, `#wo-tab-btn-products`, `#wo-tab-btn-team`, `#wo-tab-btn-invoice`, `#wo-tab-btn-notes`
  - Panels: `#wo-tab-details`, `#wo-tab-service-appointments`, `#wo-tab-products`, `#wo-tab-team`, `#wo-tab-invoice`, `#wo-tab-notes`
- Hydration targets in `showWorkOrderDetail`:
  - `#wo-d-service`, `#wo-d-date`, `#wo-d-frequency`, `#wo-d-status`, `#wo-d-hours`, `#wo-d-rate`, `#wo-d-cost`, `#wo-d-checklist`, `#wo-d-checklist-link`, `#wo-d-product`

### Acceptance criteria
1. **Given** a Work Order is opened from the list, **when** `showWorkOrderDetail(workOrderId)` runs, **then** the header fields reflect the selected record (`#wo-title`, `#wo-sub`) using `workOrderRecords`.
2. **Given** Work Order detail is rendered, **when** the user loads the page, **then** Details tab is active by default (`setWorkOrderTab('details')`) and `#wo-tab-details` is visible while other panels are hidden.
3. **Given** the user clicks each tab button in any order, **when** the click occurs, **then** only the corresponding panel is shown and the correct button has `aria-selected="true"` / `.active`.
4. **Given** the Details tab is shown, **when** the user checks key fields in Details, **then** values are populated from the prototype record (`#wo-d-service`, `#wo-d-date`, etc. and checklist/product fields including `#wo-d-checklist-link`).
5. **Given** the user reloads/opens another Work Order record, **when** the detail page shows, **then** Values update consistently to match the new record id.

### QA test matrix (Story 2)
| ID | Type | Scenario |
|----|------|----------|
| Dv1 | Positive | Open Work Order from list → Details tab visible and active |
| Dv2 | Positive | Click Service Appointment tab → correct panel visible |
| Dv3 | Positive | Click Notes tab → correct panel visible; Details hidden |
| Dv4 | Edge | Rapid tab switching → no mixed visible panels |
| Dv5 | Regression | Open different Work Order id → Details values change |

---

## Story 3 — Work Order details read-only: section-level Edit entry points

### Description
**As a** user scrolling through Work Order details,  
**I want** an Edit button visible on each read-only collapsible section header,  
**So that** I can jump into editing any section without relying on the top-level Edit button.

### Context
- Read-only mode renders `div#wo-details-readonly`.
- Each section-card header includes an `Edit` button (`button.wo-row-edit-btn`) that calls `openWorkOrderEditMode()` and uses `event.stopPropagation()` so the collapsible container does not toggle.

### Scope
| In scope | Out of scope |
|----------|--------------|
| Presence of Edit buttons on each main Details section header (Cost…, Cancellation, Property, Access…, Notes…, Checklist & Add-ons) | Editing only the specific section (prototype enters full details edit mode) |
| Edit button does not collapse the section when clicked | Preventing any collapse via keyboard specifics |

### DOM / UI anchors
- Read-only container: `#wo-details-readonly`
- Edit buttons: `.wo-row-edit-btn` in each `.js-collapsible .section-card-header`
- Edit entry handler: `onclick="openWorkOrderEditMode()"`

### Acceptance criteria
1. **Given** Work Order detail is in read-only mode, **when** the user inspects each section header, **then** an `Edit` button is visible on every implemented section card.
2. **Given** the user clicks the `Edit` button on a section header, **when** the click happens, **then** the app enters inline edit mode (`#wo-details-readonly` hidden; `#wo-details-edit` visible).
3. **Given** a section is either expanded or collapsed, **when** the user clicks the section-level `Edit` button, **then** the collapsible section does not toggle (i.e. expanded stays expanded and collapsed stays collapsed).
4. **Given** the user clicks Edit buttons on different sections, **when** edits mode is already open, **then** the app still maintains edit mode and does not navigate away from the Details tab.

### QA test matrix (Story 3)
| ID | Type | Scenario |
|----|------|----------|
| E1 | Positive | Read-only mode: verify Edit button exists on each section header |
| E2 | Positive | Click Cost section Edit → edit mode opens |
| E3 | Edge | Click Edit repeatedly on different sections → no navigation; edit mode stays |
| E4 | Negative | Click header area (not Edit) → section toggles as collapsible behavior (baseline) |

---

## Story 4 — Work Order details inline edit mode: sticky footer, Save/Cancel, and validation

### Description
**As a** user editing a Work Order,  
**I want** a sticky Save/Cancel footer visible while I scroll through the embedded edit form,  
**So that** I can complete changes and exit edit mode safely.

### Context
- Inline edit mode uses `openWorkOrderEditMode()` from `js/pages/forms.js`.
- The edit UI embeds the New Work Order modal form into `#wo-edit-form-host`.
- Sticky actions are rendered in `pages/workorder-detail.html` as `div.wo-edit-sticky-footer` inside `#wo-details-edit`.
- Save/cancel handlers:
  - `Save` → `saveWorkOrderEdits()`
  - `Cancel` → `cancelWorkOrderEditMode()` (calls `exitWorkOrderEditMode` with rerender).

### Scope
| In scope | Out of scope |
|----------|--------------|
| Enter edit mode from:
  - top-level header Edit button
  - any read-only section header Edit button | Editing every field in the New Work Order form |
| Sticky footer remains visible while scrolling in edit mode | Backend persistence |
| Cancel exits edit mode and restores read-only values to the prior record state | Complex server-side validation |
| Save updates prototype Work Order record and exits edit mode | Editing outside the mapped subset of fields |

### Mapped fields (prototype)
Save updates the following read-only fields from the edit form (subset):
- `#wo-d-service` ← `#nwo-service-desc`
- `#wo-d-date` ← `#nwo-initial-date`
- `#wo-d-frequency` ← `#nwo-frequency`
- `#wo-d-status` ← `#nwo-status`
- `#wo-d-hours` ← `#nwo-est-hours`
- `#wo-d-rate` ← `#nwo-rate`
- `#wo-d-cost` ← `#nwo-est-cost` (normalized to include `$`)
- `#wo-d-checklist` and `#wo-d-checklist-link` ← `#nwo-checklist-link`
- `#wo-d-product` ← `#nwo-product-ck`
- key fields in header are re-rendered in `showWorkOrderDetail`

### Acceptance criteria
1. **Given** Work Order detail is in read-only mode, **when** the user clicks header `Edit` or a section `Edit` button, **then**:
   - `#wo-details-readonly` becomes hidden
   - `#wo-details-edit` becomes visible
   - the embedded edit form appears in `#wo-edit-form-host`.
2. **Given** edit mode is open, **when** the user scrolls down the page, **then** the sticky footer (`#wo-details-edit .wo-edit-sticky-footer`) remains visible and the `Save` / `Cancel` buttons stay reachable.
3. **Given** the user clicks `Cancel`, **when** the action completes, **then** the page returns to read-only mode and read-only values match the original record values before editing.
4. **Given** the user clicks `Save` with `#nwo-service-desc` empty or whitespace-only, **when** validation runs, **then**:
   - an error toast appears with title `Review required fields`
   - `#ff-nwo-service-desc` receives class `is-invalid`
   - focus moves to `#nwo-service-desc`
   - the read-only fields do not change.
5. **Given** the user clicks `Save` with a non-empty `#nwo-service-desc`, **when** save completes, **then**:
   - a success toast appears with title `Work Order updated`
   - the app exits edit mode back to read-only
   - Details values update to reflect the edited subset (e.g. service description/date/frequency/status/cost/checklist/product).
6. **Given** edits were saved, **when** the user re-enters edit mode, **then** the edit form is prefilled from the updated in-memory `workOrderRecords` state.
7. **Prototype boundary:** **Given** this is a prototype, **when** saving, **then** no server persistence is required; expected behavior is in-memory record updates + UI rerender.

### QA test matrix (Story 4)
| ID | Type | Scenario |
|----|------|----------|
| IE1 | Positive | Click Edit → edit mode opens; sticky footer visible |
| IE2 | Positive | Scroll down while editing → Save/Cancel still visible |
| IE3 | Positive | Edit fields → Save → toast + values updated; back to read-only |
| IE4 | Negative | Clear `#nwo-service-desc` → Save → error toast; no update |
| IE5 | Positive | Edit fields → Cancel → no changes; read-only values restored |
| IE6 | Regression | Re-open edit mode after Cancel/Save → form prefilled correctly |

---

## Story 5 — New Work Order modal (open, required validation, Save/Save & New, Cancel)

### Description
**As a** CRM user,  
**I want** to create a new Work Order from the Work Orders list,  
**So that** I can capture work order information using the New Work Order form flow (type → form → save/cancel).

### Context
- Opening modal uses `openNewWorkOrder()` in `js/pages/forms.js`.
- Modal is injected from `pages/new-work-order.html` on first use via `ensureNewWorkOrderOverlay()`.
- Required validation exists in `saveNewWorkOrder()` and only enforces `#nwo-service-desc`.

### Scope
| In scope | Out of scope |
|----------|--------------|
| New button on Work Orders list opens modal (`#new-work-order-overlay`) | Backend persistence / record creation |
| Type selection (one-time vs regular) + Continue reveals form panel | Full data model mapping for every field |
| Validation: `#nwo-service-desc` required (trimmed) | Cross-field validation rules beyond prototype |
| Save closes modal; Save & New resets form and keeps modal open | Importing dropdown values from backend |
| Cancel closes modal without saving | Undo after close |

### DOM / UI anchors
- Overlay: `#new-work-order-overlay`
- Close (X): `button.al-close` with `onclick="closeNewWorkOrderModal()"`
- Cancel (footer): button with `onclick="closeNewWorkOrderModal()"`
- Type panel: `#nwo-panel-type` and Continue button `onclick="nwoContinueFromType()"`
- Form panel: `#nwo-panel-form` and Service Description input `#nwo-service-desc`
- Required validation wrapper: `#ff-nwo-service-desc` (class `is-invalid`)
- Save buttons:
  - `onclick="saveNewWorkOrder({ andNew: true })"`
  - `onclick="saveNewWorkOrder({ andNew: false })"`

### Acceptance criteria
1. **Given** user is on `#page-workorders`, **when** they click **New**, **then** `openNewWorkOrder()` opens `#new-work-order-overlay` and shows the type panel (`#nwo-panel-type`), with the form panel hidden.
2. **Given** the modal is open, **when** the user selects a type and clicks Continue (`nwoContinueFromType()`), **then** `#nwo-panel-form` becomes visible and the focus moves into the form (service description is focused by implementation).
3. **Given** `#nwo-service-desc` is empty or whitespace-only, **when** the user clicks Save or Save & New, **then**:
   - error toast appears with title `Review required fields`
   - `#ff-nwo-service-desc` receives class `is-invalid`
   - focus moves to `#nwo-service-desc`
   - overlay remains open (no “saved” toast).
4. **Given** `#nwo-service-desc` is non-empty, **when** the user clicks Save (`andNew:false`), **then**:
   - success toast appears with title `Work Order saved` and body containing `(prototype — no record created)`
   - modal closes (`closeNewWorkOrderModal()` behavior).
5. **Given** `#nwo-service-desc` is non-empty, **when** the user clicks Save & New (`andNew:true`), **then**:
   - success toast appears
   - the form resets for a new entry and focus returns to `#nwo-service-desc`.
6. **Given** the user clicks Cancel, **when** Cancel runs, **then** the modal closes and no success toast is shown.
7. **Prototype boundary:** **Given** this is a prototype, **when** saving new work orders, **then** no persisted record is required; expected behavior is toast + modal state change.

### QA test matrix (Story 5)
| ID | Type | Scenario |
|----|------|----------|
| N1 | Positive | Click **New** → modal opens; type panel visible |
| N2 | Positive | Click Continue → form panel visible; service desc focused |
| N3 | Negative | Save with empty `#nwo-service-desc` → validation toast + focus |
| N4 | Positive | Save → toast + modal closes |
| N5 | Positive | Save & New → toast + form reset; focus returns |
| N6 | Positive | Cancel → modal closes; no saved toast |

---

## Suggested JIRA metadata (applies to these stories)
- Labels: `workorders`, `list-view`, `navigation`, `validation`, `edit`, `prototype`
- Components: `CRM UI / Work Orders`
- Story points (rough):
  - Story 1: S
  - Story 2: M
  - Story 3: S
  - Story 4: M
  - Story 5: M

---

*Version: 1.0 — aligned to Field Agent CRM prototype HTML/JS.*

