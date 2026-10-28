/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm Premium Visual Identity (PHASE 10 Corrective Refinement)
        'charcoal': '#211A22',
        'deep-plum': '#3A2438',
        'plum': '#68415F',
        'dusty-rose': '#C77C86',
        'soft-coral': '#E8957B',
        'apricot': '#F3B37A',
        'cream': '#FFF8F1',
        'warm-white': '#FFFCF8',
        'soft-lavender': '#F2E8F0',
        'brand-text': '#352B32',
        'muted-text': '#756871',
        'brand-border': '#EADFE4',

        // Map marker semantic tokens
        'marker-user': '#7C6FE6',
        'marker-room': '#A15C78',
        'marker-pickup': '#E58E72',
        'marker-supplier': '#C58B52',
        'marker-demand': '#D85E69',

        // Semantic states (Green ONLY for success)
        'status-success': '#10B981',
        'status-warning': '#F59E0B',
        'status-error': '#EF4444',

        // Compatibility mappings
        'brand-navy': '#211A22',
        'deep-navy': '#3A2438',
        'cobalt-blue': '#68415F',
        'electric-blue': '#C77C86',
        'brand-cyan': '#E8957B',
        'brand-indigo': '#68415F',
        'brand-violet': '#A15C78',
        'coral-accent': '#E8957B',
        'warm-bg': '#FFF8F1',
        'light-bg': '#FFFCF8',
        'neutral-text': '#352B32',
        'light-border': '#EADFE4',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #3A2438 0%, #68415F 45%, #C77C86 75%, #F3B37A 100%)',
        'cta-gradient': 'linear-gradient(135deg, #68415F 0%, #C77C86 100%)',
        'plum-gradient': 'linear-gradient(135deg, #3A2438 0%, #68415F 100%)',
        'coral-gradient': 'linear-gradient(135deg, #E8957B 0%, #F3B37A 100%)',
        'footer-gradient': 'linear-gradient(135deg, #171116 0%, #211A22 50%, #2C1E29 100%)',
        'highlight-card-gradient': 'linear-gradient(135deg, #FFF8F1 0%, #F2E8F0 100%)',
        'warm-card-gradient': 'linear-gradient(135deg, #FFF8F1 0%, #FFF1EC 100%)',
        'accent-gradient': 'linear-gradient(135deg, #68415F 0%, #C77C86 100%)',
        'trust-gradient': 'linear-gradient(135deg, #FFFCF8 0%, #F2E8F0 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.75' },
        },
      },
      scale: {
        '98': '.98',
      },
    },
  },
  plugins: [],
}
