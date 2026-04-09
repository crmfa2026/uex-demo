/** @type {import('tailwindcss').Config} */

// =============================================================================
// SALESFORCE FSL — Tailwind Extension Config
// Maps design tokens → Tailwind utility classes.
//
// Usage examples:
//   bg-sf-brand         text-sf-muted        border-sf-border
//   bg-sf-success       text-sf-error         h-sf-row
//   bg-sf-gantt-travel  text-sf-nav-inverse   shadow-sf-md
// =============================================================================

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {

      // -----------------------------------------------------------------------
      // COLORS — reference CSS variables so they stay in sync with tokens.css
      // -----------------------------------------------------------------------
      colors: {
        sf: {
          // Brand
          brand:          'var(--sf-brand)',
          'brand-dark':   'var(--sf-brand-dark)',
          'brand-light':  'var(--sf-brand-light)',
          navy:           'var(--sf-navy)',
          'navy-light':   'var(--sf-navy-light)',

          // Surfaces
          'bg-page':      'var(--sf-bg-page)',
          'bg-surface':   'var(--sf-bg-surface)',
          'bg-subtle':    'var(--sf-bg-subtle)',

          // Borders
          border:         'var(--sf-border)',
          'border-medium':'var(--sf-border-medium)',
          'border-strong':'var(--sf-border-strong)',

          // Text
          'text-primary':     'var(--sf-text-primary)',
          'text-secondary':   'var(--sf-text-secondary)',
          'text-muted':       'var(--sf-text-muted)',
          'text-placeholder': 'var(--sf-text-placeholder)',
          'text-inverse':     'var(--sf-text-inverse)',
          'text-link':        'var(--sf-text-link)',

          // Semantic
          success:        'var(--sf-success)',
          'success-bg':   'var(--sf-success-bg)',
          'success-dark': 'var(--sf-success-dark)',
          warning:        'var(--sf-warning)',
          'warning-bg':   'var(--sf-warning-bg)',
          'warning-strong':'var(--sf-warning-strong)',
          error:          'var(--sf-error)',
          'error-bg':     'var(--sf-error-bg)',
          info:           'var(--sf-info)',
          'info-bg':      'var(--sf-info-bg)',

          // Gantt-specific
          'gantt-appt':     'var(--sf-gantt-appointment)',
          'gantt-travel':   'var(--sf-gantt-travel)',
          'gantt-violation':'var(--sf-gantt-violation)',
          'gantt-off':      'var(--sf-gantt-off-hours)',

          // Avatars
          'avatar-bg':    'var(--sf-avatar-bg)',
          'avatar-text':  'var(--sf-avatar-text)',

          // Interactive
          'hover-bg':     'var(--sf-hover-bg)',
          'selected-bg':  'var(--sf-selected-bg)',
        }
      },

      // -----------------------------------------------------------------------
      // FONT FAMILY
      // -----------------------------------------------------------------------
      fontFamily: {
        sf: 'var(--sf-font-family)',
        'sf-mono': 'var(--sf-font-mono)',
      },

      // -----------------------------------------------------------------------
      // FONT SIZES — matching SF Lightning's compact scale
      // -----------------------------------------------------------------------
      fontSize: {
        'sf-xs':   ['var(--sf-text-xs)',   { lineHeight: '1rem' }],
        'sf-sm':   ['var(--sf-text-sm)',   { lineHeight: '1.25rem' }],
        'sf-base': ['var(--sf-text-base)', { lineHeight: '1.5rem' }],
        'sf-md':   ['var(--sf-text-md)',   { lineHeight: '1.5rem' }],
        'sf-lg':   ['var(--sf-text-lg)',   { lineHeight: '1.75rem' }],
        'sf-xl':   ['var(--sf-text-xl)',   { lineHeight: '2rem' }],
        'sf-2xl':  ['var(--sf-text-2xl)',  { lineHeight: '2.25rem' }],
      },

      // -----------------------------------------------------------------------
      // BORDER RADIUS
      // -----------------------------------------------------------------------
      borderRadius: {
        'sf-sm':   'var(--sf-radius-sm)',
        'sf-md':   'var(--sf-radius-md)',
        'sf-lg':   'var(--sf-radius-lg)',
        'sf-xl':   'var(--sf-radius-xl)',
        'sf-full': 'var(--sf-radius-full)',
      },

      // -----------------------------------------------------------------------
      // SPACING — SF 4px grid
      // -----------------------------------------------------------------------
      spacing: {
        'sf-1':  'var(--sf-space-1)',
        'sf-2':  'var(--sf-space-2)',
        'sf-3':  'var(--sf-space-3)',
        'sf-4':  'var(--sf-space-4)',
        'sf-5':  'var(--sf-space-5)',
        'sf-6':  'var(--sf-space-6)',
        'sf-8':  'var(--sf-space-8)',
        'sf-10': 'var(--sf-space-10)',
        'sf-12': 'var(--sf-space-12)',
      },

      // -----------------------------------------------------------------------
      // HEIGHTS — named component heights for consistency
      // -----------------------------------------------------------------------
      height: {
        'sf-input':        'var(--sf-input-height)',
        'sf-input-lg':     'var(--sf-input-height-lg)',
        'sf-button':       'var(--sf-button-height)',
        'sf-topnav':       'var(--sf-topnav-height)',
        'sf-subnav':       'var(--sf-subnav-height)',
        'sf-row':          'var(--sf-list-row-height)',
        'sf-gantt-row':    'var(--sf-gantt-row-height)',
        'sf-gantt-header': 'var(--sf-gantt-header-height)',
      },

      // -----------------------------------------------------------------------
      // BOX SHADOWS
      // -----------------------------------------------------------------------
      boxShadow: {
        'sf-sm':    'var(--sf-shadow-sm)',
        'sf-md':    'var(--sf-shadow-md)',
        'sf-lg':    'var(--sf-shadow-lg)',
        'sf-focus': 'var(--sf-focus-ring)',
      },

      // -----------------------------------------------------------------------
      // TRANSITIONS
      // -----------------------------------------------------------------------
      transitionDuration: {
        'sf-fast': '100ms',
        'sf-base': '200ms',
        'sf-slow': '350ms',
      },
    },
  },
  plugins: [],
}
