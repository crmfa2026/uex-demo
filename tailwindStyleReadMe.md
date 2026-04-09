# CRM Field Agent — Design System

Salesforce FSL-equivalent design tokens and component classes for the Next.js frontend.

## File Structure

```
src/styles/
  tokens.css          ← ALL design tokens as CSS variables (single source of truth)
  globals.css         ← @tailwind directives + @layer components (pre-built classes)

tailwind.config.js    ← Maps tokens → Tailwind sf-* utility classes

.cursor/rules/
  design-system.mdc   ← Cursor AI context (auto-injected during code generation)
```

## Setup (one-time)

### 1. Copy files into your Next.js project

```bash
cp src/styles/tokens.css   your-project/src/styles/tokens.css
cp src/styles/globals.css  your-project/src/app/globals.css
cp tailwind.config.js      your-project/tailwind.config.js
cp .cursor/rules/design-system.mdc  your-project/.cursor/rules/design-system.mdc
```

### 2. Import in your root layout

```tsx
// src/app/layout.tsx
import '@/styles/tokens.css'
import './globals.css'
```

> **Note:** If globals.css already has `@import './tokens.css'` you only need the globals.css import.

### 3. Confirm Tailwind content paths in tailwind.config.js match your project structure

---

## How to use

### Option A — Tailwind classes (preferred for JSX)
```jsx
<button className="sf-btn-primary">Schedule</button>
<span className="sf-badge-success">Completed</span>
<div className="bg-sf-bg-surface border border-sf-border rounded-sf-lg p-sf-4">
```

### Option B — CSS variables (for custom CSS / inline styles)
```jsx
<div style={{ background: 'var(--sf-gantt-appointment)', color: 'var(--sf-gantt-appt-border)' }}>
```

### Option C — Pre-built component classes
All `sf-*` classes in `globals.css` are available globally without importing anything extra:
```jsx
<input className="sf-input" />
<table className="sf-table">...</table>
<nav className="sf-topnav">...</nav>
```

---

## Adding new tokens

1. Add the CSS variable to `src/styles/tokens.css` under the appropriate section
2. Add the Tailwind mapping to `tailwind.config.js` under `theme.extend.colors.sf` (or spacing/sizing)
3. Update `.cursor/rules/design-system.mdc` quick reference table
4. Optionally add a component class to `globals.css` under `@layer components`

---

## Cursor AI integration

The `.cursor/rules/design-system.mdc` file is automatically picked up by Cursor.
When you ask Cursor to generate a component, it will:
- Use `sf-*` Tailwind classes instead of hardcoded colors
- Reference pre-built component classes (`sf-btn-primary`, `sf-badge-success`, etc.)
- Follow the spacing grid and typography scale

**Tip:** Start your Cursor prompt with:
> "Using our SF design system, create a..."
