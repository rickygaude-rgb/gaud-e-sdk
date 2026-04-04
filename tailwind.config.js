/**
 * Tailwind CSS Configuration for GAUD-E SDK
 * Design tokens and component styling for UI components
 */

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './examples/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        // GAUD-E Brand Colors
        'gaud-blue': '#0066ff',
        'gaud-navy': '#0033cc',
        'gaud-accent': '#00d4ff',
        'gaud-success': '#00cc66',
        'gaud-warning': '#ffcc00',
        'gaud-danger': '#ff3333',

        // Semantic colors for BIM
        'structure': '#8b7355',
        'architecture': '#d4a574',
        'mep': '#5a8fc4',
        'landscape': '#3d7c2a',
      },

      spacing: {
        '128': '32rem',
        '144': '36rem',
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },

      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          'Monaco',
          '"Cascadia Code"',
          '"Roboto Mono"',
          'Consolas',
          'monospace',
        ],
      },

      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'base': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'full': '9999px',
      },

      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },

      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },

      keyframes: {
        'bim-load': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(-2px)', opacity: '0.7' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
    },
  },

  plugins: [
    /**
     * Custom BIM component utilities
     */
    function ({ addComponents, theme }) {
      const bimComponents = {
        '.bim-card': {
          '@apply bg-white rounded-lg shadow p-6 border border-gray-100': {},
        },
        '.bim-button': {
          '@apply px-4 py-2 rounded font-medium transition-colors': {},
        },
        '.bim-button-primary': {
          '@apply bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800': {},
        },
        '.bim-button-secondary': {
          '@apply bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400': {},
        },
        '.bim-input': {
          '@apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent':
            {},
        },
        '.bim-label': {
          '@apply block text-sm font-medium text-gray-700 mb-2': {},
        },
        '.bim-status': {
          '@apply inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium': {},
        },
        '.bim-status-pending': {
          '@apply bg-gray-200 text-gray-800': {},
        },
        '.bim-status-active': {
          '@apply bg-blue-200 text-blue-900 animate-pulse': {},
        },
        '.bim-status-success': {
          '@apply bg-green-200 text-green-900': {},
        },
        '.bim-status-error': {
          '@apply bg-red-200 text-red-900': {},
        },
        '.bim-panel': {
          '@apply bg-white rounded-lg shadow-lg border border-gray-200': {},
        },
        '.bim-grid': {
          '@apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6': {},
        },
      };

      addComponents(bimComponents);
    },
  ],

  safelist: [
    // BIM render modes
    'bg-structure',
    'bg-architecture',
    'bg-mep',
    'bg-landscape',

    // Status variants
    'bim-status-pending',
    'bim-status-active',
    'bim-status-success',
    'bim-status-error',

    // Responsive
    'lg:col-span-1',
    'lg:col-span-2',
    'lg:col-span-3',
  ],
};
