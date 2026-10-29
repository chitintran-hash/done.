/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // FlashGroup Master Color System
        'fg-night': '#000181',        // Night Skies - Primary Dark / Headings / Footer / Structure
        'fg-blue': '#006EE9',         // Blue Raspberry - Primary CTA / Interactivity / Links
        'fg-lime': '#D0FFA4',         // Powdered Lime - Price Unlock / Group Success / Positive Badges
        'fg-violet': '#E8A0FF',       // Violet - Secondary Accent / Social / Referral / Community
        'fg-sky': '#83E7FF',          // Sunny Skies - FlashMap / Logistics / Info / Location

        // Neutrals
        'fg-bg': '#FCFCF7',           // Main Background
        'fg-bg-soft': '#F6F7FB',      // Secondary Background
        'fg-surface': '#FFFFFF',      // Card / Surface
        'fg-text': '#000181',         // Primary Text
        'fg-text-secondary': '#53536A', // Secondary Text
        'fg-border': '#E6E6EE',       // Border

        // Section Background Tints
        'fg-tint-lime': '#F4FFE8',    // Lime Section Tint
        'fg-tint-violet': '#FAF0FF',  // Violet Section Tint
        'fg-tint-sky': '#EFFBFF',     // Sky Section Tint

        // Map marker semantic tokens
        'marker-user': '#006EE9',
        'marker-room': '#E8A0FF',
        'marker-pickup': '#83E7FF',
        'marker-supplier': '#D0FFA4',
        'marker-demand': '#EF4444',

        // Semantic states
        'status-success': '#D0FFA4',
        'status-warning': '#F59E0B',
        'status-error': '#EF4444',

        // Backward compatibility mappings (Seamlessly adapts existing components to new palette)
        'charcoal': '#000181',
        'deep-plum': '#000181',
        'plum': '#006EE9',
        'dusty-rose': '#E8A0FF',
        'soft-coral': '#83E7FF',
        'apricot': '#D0FFA4',
        'cream': '#FCFCF7',
        'warm-white': '#FFFFFF',
        'soft-lavender': '#FAF0FF',
        'brand-text': '#000181',
        'muted-text': '#53536A',
        'brand-border': '#E6E6EE',
        'brand-navy': '#000181',
        'deep-navy': '#000181',
        'cobalt-blue': '#006EE9',
        'electric-blue': '#83E7FF',
        'brand-cyan': '#83E7FF',
        'brand-indigo': '#000181',
        'brand-violet': '#E8A0FF',
        'coral-accent': '#83E7FF',
        'warm-bg': '#FCFCF7',
        'light-bg': '#F6F7FB',
        'neutral-text': '#000181',
        'light-border': '#E6E6EE',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #000181 0%, #003CCB 40%, #006EE9 70%, #83E7FF 100%)',
        'cta-gradient': 'linear-gradient(135deg, #006EE9 0%, #000181 100%)',
        'secondary-gradient': 'linear-gradient(135deg, #E8A0FF 0%, #83E7FF 50%, #D0FFA4 100%)',
        'lime-gradient': 'linear-gradient(135deg, #D0FFA4 0%, #E9FFD6 100%)',
        'voucher-gradient': 'linear-gradient(135deg, #E8A0FF 0%, #83E7FF 100%)',
        'progress-gradient': 'linear-gradient(90deg, #006EE9 0%, #83E7FF 100%)',
        'progress-almost': 'linear-gradient(90deg, #83E7FF 0%, #D0FFA4 100%)',
        'footer-gradient': 'linear-gradient(135deg, #000181 0%, #000181 100%)',
        'highlight-card-gradient': 'linear-gradient(135deg, #FCFCF7 0%, #FAF0FF 100%)',
        'warm-card-gradient': 'linear-gradient(135deg, #FCFCF7 0%, #EFFBFF 100%)',
        'accent-gradient': 'linear-gradient(135deg, #E8A0FF 0%, #83E7FF 100%)',
        'trust-gradient': 'linear-gradient(135deg, #FCFCF7 0%, #F6F7FB 100%)',
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
