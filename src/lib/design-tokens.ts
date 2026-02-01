// CBW Coffee Design System - Design Tokens
// The single source of truth for all design decisions

export const designTokens = {
  // Color System
  colors: {
    // Primary Accent — Yellow Gold
    primary: {
      50: '#FEF9E7',
      100: '#FDF2C9',
      200: '#FAE494',
      300: '#F7D55E',
      400: '#F5C842', // Main brand accent
      500: '#E8B430',
      600: '#D4A020',
      700: '#B8870F',
      800: '#8C6508',
      900: '#604504'
    },

    // Brand Browns
    brown: {
      50: '#FAF5F0',
      100: '#F0E6D8',
      200: '#DCC9A8',
      300: '#C4A87A',
      400: '#A0785A',
      500: '#6B4226',
      600: '#4F3018',
      700: '#3B2A1A', // Logo, headings
      800: '#2A1E12',
      900: '#1A120A'
    },

    // Neutral — Warm whites and grays
    neutral: {
      0: '#FFFFFF',
      50: '#FAFAF8', // Page backgrounds
      100: '#F5F5F2',
      200: '#E8E8E4',
      300: '#D4D4D0',
      400: '#A3A3A0',
      500: '#6B6B6B', // Body text secondary
      600: '#4B4B4B',
      700: '#333333',
      800: '#1A1A1A', // Body text primary
      900: '#0F0F0F',
      950: '#080808'
    },
    
    // Semantic Colors
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d'
    },
    
    warning: {
      50: '#fffbeb', 
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309'
    },
    
    danger: {
      50: '#fef2f2',
      500: '#ef4444', 
      600: '#dc2626',
      700: '#b91c1c'
    },
    
    info: {
      50: '#f0f9ff',
      500: '#06b6d4',
      600: '#0891b2', 
      700: '#0e7490'
    }
  },

  // Typography Scale - 4 scales
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace']
    },
    
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px  
      base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
      '5xl': ['3rem', { lineHeight: '1' }],           // 48px
      '6xl': ['3.75rem', { lineHeight: '1' }]         // 60px
    },
    
    fontWeight: {
      normal: '400',
      medium: '500', 
      semibold: '600',
      bold: '700'
    },
    
    letterSpacing: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em'
    }
  },

  // Spacing System - 8px grid
  spacing: {
    px: '1px',
    0: '0px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px  
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem'       // 384px
  },

  // Border Radius
  borderRadius: {
    none: '0px',
    xs: '0.125rem',   // 2px
    sm: '0.25rem',    // 4px  
    base: '0.375rem', // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    full: '9999px'
  },

  // Shadow System
  boxShadow: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    base: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    md: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    lg: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    xl: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
  },

  // Animation & Motion
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms', 
      slow: '500ms',
      slower: '750ms'
    },
    
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)', 
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },

  // Interactive States
  states: {
    hover: 'hover',
    focus: 'focus', 
    active: 'active',
    disabled: 'disabled',
    loading: 'loading'
  },

  // Breakpoints for Responsive Design
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Z-Index Scale
  zIndex: {
    hide: '-1',
    auto: 'auto',
    base: '0',
    dropdown: '10',
    sticky: '20',
    fixed: '30', 
    modal: '40',
    popover: '50',
    tooltip: '60',
    toast: '70'
  }
} as const

// Type exports for TypeScript
export type ColorScale = keyof typeof designTokens.colors
export type ColorShade = keyof typeof designTokens.colors.primary
export type FontSize = keyof typeof designTokens.typography.fontSize
export type Spacing = keyof typeof designTokens.spacing