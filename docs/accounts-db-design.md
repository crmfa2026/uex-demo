# Database design — Accounts module (list + detail + related entities)

Supporting the UI in `pages/accounts.html` and `pages/account-detail.html`. Logical relational model for a future backend; naming is illustrative (adjust to your conventions: `snake_case`, schemas, multi-tenancy).

---

## 1. Design goals

- Store **account** core attributes and **field-service–specific** flags shown on the Details tab.
- Support **list views** (All / My / Recently viewed) via `owner_id`, activity timestamps, and optional **list view** or **saved filter** tables later.
- Model **related entities** referenced by account detail tabs: contacts, cases, work orders, cancelled jobs, CSAT, invoices, payment methods.

---

## 2. Entity relationship overview

```text
users ──< accounts (owner_id)
accounts ──< accounts (parent_account_id), optional self-reference
accounts ──< contacts
accounts ──< cases
accounts ──< work_orders
accounts ──< cancelled_jobs
accounts ──< customer_satisfaction_records
accounts ──< invoices
accounts ──< payment_methods
lookup: account_types, industries, account_record_types (optional normalization)
```

---

## 3. Core tables

### 3.1 `users`

| Column | Type | Notes |
|--------|------|--------|
| `id` | UUID / BIGSERIAL PK | |
| `display_name` | VARCHAR(255) | Shown as Owner, Created By, Last Modified By |
| `email` | VARCHAR(320) | Optional login id |
| `created_at` | TIMESTAMPTZ | |

### 3.2 `accounts`

Maps to list columns and detail/header fields. Adjust nullable rules per business.

| Column | Type | Notes |
|--------|------|--------|
| `id` | UUID / BIGSERIAL PK | |
| `name` | VARCHAR(255) NOT NULL | Account Name; unique per org if required |
| `account_record_type_id` | FK → `account_record_types` | e.g. Consumer Account |
| `account_type_id` | FK → `account_types` | Customer / Prospect / Partner (matches badges) |
| `industry_id` | FK → `industries` OR VARCHAR | Field Services, Technology, … |
| `phone` | VARCHAR(50) | List + legacy phones elsewhere |
| `annual_revenue_cents` | BIGINT NULL | Store money in minor units; UI formats £/$/₹ |
| `currency_code` | CHAR(3) | ISO 4217 |
| `billing_city` | VARCHAR(120) | Can split to full billing address table |
| `billing_country` | VARCHAR(120) | Used in subtitle “City, Country” |
| `owner_id` | FK → `users` NOT NULL | My Accounts filter |
| `parent_account_id` | FK → `accounts` NULL | Parent Account |

**Operational / field-service flags (Details — Account Information & frequency)**

| Column | Type | Notes |
|--------|------|--------|
| `alert_manual_enabled` | BOOLEAN | |
| `alert_manual_text` | TEXT | |
| `service_territory_1` | VARCHAR(255) | Or FK if territories are master data |
| `service_territory_2` | VARCHAR(255) | |
| `service_territory_3` | VARCHAR(255) | |
| `halt_job_creation` | BOOLEAN | |
| `refuse_service` | BOOLEAN | |
| `refuse_service_reason` | TEXT | |

**Account frequency type (mutually exclusive sets may be enforced in app layer)**

| Column | Type | Notes |
|--------|------|--------|
| `is_one_time_account` | BOOLEAN | |
| `is_recurring_account` | BOOLEAN | |
| `is_active_one_time` | BOOLEAN | |
| `is_active_recurring` | BOOLEAN | |
| `is_inactive_onetime` | BOOLEAN | |
| `is_inactive_recurring` | BOOLEAN | |
| `is_active_both_one_time_and_recurring` | BOOLEAN | |
| `is_prospective_account` | BOOLEAN | |

**Primary contact (denormalized snapshot or FK)**

| Column | Type | Notes |
|--------|------|--------|
| `primary_contact_id` | FK → `contacts` NULL | Preferred if contact is a first-class record |
| *or* embedded columns | various | Name, address, mobile, email, city, province, postal — duplicate if legacy requirement |

**Legacy contact info**

| Column | Type | Notes |
|--------|------|--------|
| `legacy_customer_id` | VARCHAR(64) | Customer ID |
| `legacy_note_id` | VARCHAR(64) | Note ID |
| `barter_description` | TEXT | |
| `customer_status` | VARCHAR(120) | |
| `mobile_phone_2` | VARCHAR(50) | |
| `home_phone_2` | VARCHAR(50) | |
| `other_phone_2` | VARCHAR(50) | |
| `other_phone_3` | VARCHAR(50) | |

**Audit**

| Column | Type | Notes |
|--------|------|--------|
| `created_by_id` | FK → `users` | |
| `created_at` | TIMESTAMPTZ | |
| `updated_by_id` | FK → `users` | |
| `updated_at` | TIMESTAMPTZ | |
| `last_activity_at` | TIMESTAMPTZ | **Last activity** on list |

**Soft delete (optional)**

| `deleted_at` | TIMESTAMPTZ NULL | |

---

### 3.3 Lookup tables (optional but recommended)

**`account_types`:** `id`, `code` (CUSTOMER, PROSPECT, PARTNER), `label`, `sort_order`.

**`industries`:** `id`, `label`.

**`account_record_types`:** `id`, `label` (e.g. Consumer Account).

---

## 4. Related tables (account detail tabs)

### 4.1 `contacts`

| Column | Type | Notes |
|--------|------|--------|
| `id` | PK | |
| `account_id` | FK → `accounts` NOT NULL | |
| `full_name` | VARCHAR(255) | |
| `email` | VARCHAR(320) | |
| `mobile` | VARCHAR(50) | |
| `other_phone` | VARCHAR(50) | |
| `is_primary` | BOOLEAN | IsPrimary column |

Indexes: `(account_id)`, `(account_id, is_primary)`.

---

### 4.2 `cases`

| Column | Type | Notes |
|--------|------|--------|
| `id` | PK | |
| `account_id` | FK → `accounts` | |
| `case_number` | VARCHAR(32) UNIQUE | Display CASE-… |
| `subject` | VARCHAR(500) | |
| `status` | VARCHAR(50) | Open, Resolved, … |
| `priority` | VARCHAR(50) | |
| `open_work_orders_count` | INT | Denormalized or computed view |

---

### 4.3 `work_orders`

| Column | Type | Notes |
|--------|------|--------|
| `id` | PK | |
| `account_id` | FK → `accounts` | |
| `wo_number` | VARCHAR(64) | WO-2026-… |
| `status` | VARCHAR(50) | Completed, Dispatched, Pending |
| `type` | VARCHAR(80) | Preventive, Repair, … |
| `agent_id` | FK → `users` NULL | Unassigned allowed |
| `scheduled_at` | TIMESTAMPTZ NULL | |
| `sla_due_at` | TIMESTAMPTZ NULL | |

**Aggregates for account header/summary (computed or materialized):**

- Open WOs: `COUNT(*)` WHERE status IN (open states).
- Next scheduled: `MIN(scheduled_at)` for open/future WOs.

---

### 4.4 `cancelled_jobs`

| Column | Type | Notes |
|--------|------|--------|
| `id` | PK | |
| `account_id` | FK → `accounts` | |
| `cancelled_at` | TIMESTAMPTZ | |
| `reason` | TEXT | If product adds it later |

---

### 4.5 `customer_satisfaction_records`

| Column | Type | Notes |
|--------|------|--------|
| `id` | PK | |
| `account_id` | FK → `accounts` | |
| `survey_date` | DATE | |
| `score` | SMALLINT | Or NPS / CSAT scale |
| `comments` | TEXT | |

---

### 4.6 `invoices`

| Column | Type | Notes |
|--------|------|--------|
| `id` | PK | |
| `account_id` | FK → `accounts` | |
| `invoice_number` | VARCHAR(64) | |
| `amount_cents` | BIGINT | |
| `status` | VARCHAR(50) | Paid, Open |
| `issued_at` | DATE | |

---

### 4.7 `payment_methods`

| Column | Type | Notes |
|--------|------|--------|
| `id` | PK | |
| `account_id` | FK → `accounts` | |
| `type` | VARCHAR(50) | Card, ACH, … |
| `last_four` | VARCHAR(4) | If card |
| `is_default` | BOOLEAN | |
| `token_ref` | VARCHAR(255) | PCI: store token only |

---

## 5. List view queries (All / My / Recently viewed)

| View | Suggested filter |
|------|------------------|
| **All Accounts** | `WHERE deleted_at IS NULL` (+ org/tenant) |
| **My Accounts** | `WHERE owner_id = :current_user_id` |
| **Recently Viewed** | Join `user_recently_viewed_accounts(user_id, account_id, viewed_at)` or audit log; `ORDER BY viewed_at DESC` |

**List column derivations**

| UI column | Source |
|-----------|--------|
| Contacts | `COUNT` from `contacts` WHERE `account_id` |
| Open WOs | `COUNT` from `work_orders` in open statuses |
| Last activity | `last_activity_at` on `accounts` (updated by interactions) or `GREATEST` of child `updated_at` |

---

## 6. Indexes (minimum)

- `accounts(owner_id)`, `accounts(parent_account_id)`, `accounts(last_activity_at DESC)`.
- `contacts(account_id)`, `cases(account_id)`, `work_orders(account_id)`, etc.
- Full-text or trigram on `accounts.name` if search is DB-backed.

---

## 7. Multi-tenancy (if applicable)

Add `organization_id` (or `tenant_id`) to `accounts` and all related tables; scope every query and unique constraint (e.g. `name` unique per org).

---

## 8. Prototype gap note

The prototype hydrates a subset of fields from `accountRecords` in `js/router.js`; static HTML holds additional Detail fields. This schema includes both so a backend can eventually serve one coherent `Account` DTO plus related collections per tab.
