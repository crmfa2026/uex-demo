# User Story: Leads workspace — list, New Lead, validation, and Cancel

## Summary / Title

Leads workspace: navigate to list, create lead from New Lead, and cancel without saving

## Story type

User story (functional + UX)

## Description

**As a** sales or field rep using the CRM,
**I want** to open the Leads area from global navigation, open the New Lead screen from the object header, complete or abandon creation, and return to the All Leads list,
**So that** I can capture new pipeline records quickly and align with a Salesforce-style lead workflow (list → create → list or next lead).

## Context (Salesforce-aligned)

- Leads are pre-opportunity records; standard practice is required Last Name and Company (matches prototype: `pages/lead-new.html`, validation in `js/pages/forms.js` → `saveNewLead`).
- Lead Status follows a path (e.g. New → Working → Qualified); Converted is typically reached via conversion, not casual edits. Create form exposes New / Working / Qualified / Disqualified.
- Cancel must not persist a created lead; reopening New Lead uses a clean form via `resetNewLeadForm` on `openNewLead`.

## Scope

| In scope | Out of scope (separate stories) |
|----------|----------------------------------|
| Global Leads tab → Leads list (`openWorkspaceList('leads')`) | Lead Convert (Account/Contact/Opportunity) |
| + New Lead → New Lead screen (`#new-btn`, `#page-lead-new`) | Duplicate detection / matching rules |
| Form: required fields, Save, Save & New, Cancel | Server-side persistence, real list refresh |
| Return to list after Save (not Save & New) and on Cancel | Email deliverability, assignment rules, queues |

## DOM / UI anchors (reference)

- Global nav: `nav.global-nav` → `button.nav-tab` (Leads) — `onclick="openWorkspaceList('leads')"`.
- Object action: `div.object-header` → `#new-btn` → `#new-btn-label` (text: New Lead).
- New Lead page: `#page-lead-new`; Cancel: `button.btn.btn-neutral.btn-sm` — `onclick="cancelNewLead()"`.
- List: `#page-leads` — `pages/leads.html`.

## Acceptance criteria

### A. Leads workspace entry (global nav)

1. **Given** the user is anywhere in the app, **when** they click the global nav control labeled Leads (`button.nav-tab`, `openWorkspaceList('leads')`), **then** the Leads workspace is shown and the default list view (e.g. All Leads) is available.

2. **Given** the Leads workspace is active, **when** the user views the list region, **then** the list shows a title (e.g. All Leads), record count, search, filters, and a table with columns per design (Name, Company, Status, Score, Email, Source, Owner, Created, actions).

3. **Given** the Leads list is visible, **when** the user clicks a lead row, **then** lead detail opens per existing routing (`openLeadInTab` / workspace tabs).

### B. New Lead entry (object header)

4. **Given** the user is on the Leads list or lead-related pages as implemented (`page-leads`, `page-lead-detail`, or `page-lead-new`), **when** they click + New Lead (`#new-btn` / `#new-btn-label`), **then** the New Lead screen (`#page-lead-new`) is displayed.

5. **Given** the New Lead screen is open, **when** the page loads, **then** focus moves to Last Name (`openNewLead`), the form shows Lead information and Address information, and required fields are marked with *.

6. **Given** the New Lead form, **when** the user inspects defaults, **then** Lead Status defaults appropriately (e.g. New) as implemented.

### C. Validation (positive / negative)

7. **Positive — Save:** **Given** required Last Name and Company are filled, **when** the user clicks Save, **then** a success confirmation is shown (toast: Lead created with name and company), invalid state is cleared on those fields, and the user is returned to the Leads list (`showPage('leads')`).

8. **Positive — Save & New:** **Given** required fields are valid, **when** the user clicks Save & New, **then** success feedback is shown, the form resets for another entry, focus returns to Last Name, and the user remains on New Lead.

9. **Negative — missing Last Name:** **Given** Company is filled and Last Name is empty, **when** the user clicks Save or Save & New, **then** Last Name shows validation, an error toast appears (Review required fields), and no success navigation occurs.

10. **Negative — missing Company:** **Given** Last Name is filled and Company is empty, **when** the user saves, **then** Company shows validation, error toast appears, focus moves to Company per implementation.

11. **Negative — both empty:** **Given** both required fields are empty or whitespace-only, **when** the user saves, **then** both fields show invalid state, toast appears, focus follows implementation (e.g. Last Name first).

12. **Whitespace:** **Given** the user enters only spaces in Last Name or Company, **when** they save, **then** those values are treated as empty after trim and validation behaves as in 9–11.

### D. Cancel

13. **Given** the user is on New Lead, **when** they click Cancel (`cancelNewLead()`), **then** the app navigates to the Leads list without showing a success Lead created toast.

14. **Given** the user entered data, **when** they click Cancel, **then** that draft is not saved as a created lead; the next New Lead open presents a clean form (`resetNewLeadForm` on `openNewLead`).

### E. Form submit behavior

15. **Given** the New Lead form, **when** the user submits via Enter where the form default maps to Save (`onsubmit` → `saveNewLead({ andNew: false })`), **then** behavior matches clicking Save (validation and navigation).

### F. Cross-cutting / QA

16. **Accessibility (smoke):** Required fields have labels and error association (`ff-error`, `is-invalid`); primary actions are keyboard-reachable where applicable.

17. **Regression:** New Lead label on `#new-btn` appears in Leads context per router (`newLabel: 'New Lead'`).

18. **Optional fields:** First Name, Email, Lead Source, Address, etc. do not block Save when required fields are valid.

## QA test matrix

| ID | Type | Scenario |
|----|------|----------|
| T1 | Positive | Nav to Leads → list visible, count and columns |
| T2 | Positive | New Lead → fill Last + Company → Save → toast + back to list |
| T3 | Positive | New Lead → Save & New → toast → form empty, still on New Lead |
| T4 | Negative | Save with empty Last Name |
| T5 | Negative | Save with empty Company |
| T6 | Negative | Save with both empty |
| T7 | Negative | Whitespace-only in required fields |
| T8 | Positive | Cancel from New Lead → list, no create toast |
| T9 | Positive | Cancel after partial entry → reopen New Lead → clean form |

## Suggested JIRA fields

- **Component:** Leads / Workspace / UI
- **Labels:** `leads`, `create`, `navigation`, `validation`
