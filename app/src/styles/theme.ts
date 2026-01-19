// EduSync Design Tokens
// Institutional, accessible, quietly premium

export const colors = {
  // Primary palette - Muted blue for trust
  primary: {
    50: '#f0f4f8',
    100: '#d9e2ec',
    200: '#bcccdc',
    300: '#9fb3c8',
    400: '#829ab1',
    500: '#627d98', // Primary action
    600: '#486581',
    700: '#334e68',
    800: '#243b53',
    900: '#102a43',
  },
  
  // Neutral palette - Slate for text/backgrounds
  neutral: {
    0: '#ffffff',
    50: '#f8fafc',   // Page background
    100: '#f1f5f9',  // Card background alt
    200: '#e2e8f0',  // Borders
    300: '#cbd5e1',  // Disabled
    400: '#94a3b8',  // Placeholder
    500: '#64748b',  // Secondary text
    600: '#475569',  // Body text
    700: '#334155',  // Headings
    800: '#1e293b',  // Primary text
    900: '#0f172a',  // High emphasis
  },
  
  // Semantic colors - Muted, not alarming
  success: '#059669',  // Emerald-600
  warning: '#d97706',  // Amber-600
  error: '#dc2626',    // Red-600
  info: '#0284c7',     // Sky-600
};

export const typography = {
  // Font stack - System fonts for performance
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace'],
  },
  
  // Type scale
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px - Metadata
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px - Body small
    base: ['1rem', { lineHeight: '1.625rem' }],   // 16px - Body
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px - Section heading
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px - Card title
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px - Page title
  },
};

export const spacing = {
  // Consistent spacing scale
  page: '1.5rem',      // 24px - Page padding
  section: '2rem',     // 32px - Between sections
  card: '1.25rem',     // 20px - Card padding
  inline: '0.75rem',   // 12px - Inline elements
  tight: '0.5rem',     // 8px - Tight spacing
};

export const elevation = {
  // Subtle shadows only
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px - Inputs, small elements
  DEFAULT: '0.5rem', // 8px - Cards, buttons
  lg: '0.75rem',   // 12px - Large cards only
};
