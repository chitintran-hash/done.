/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // FlashGroup Master Color System (Final Rebrand)
        'cobalt': '#3155FF',
        'cobalt-hover': '#2444DC',
        'cobalt-active': '#1C35B8',
        'cobalt-soft': '#EEF1FF',

        'lime': '#C7F000',
        'lime-hover': '#B6DC00',
        'lime-soft': '#F5FBD9',

        'pink': '#FF4FA3',
        'pink-soft': '#FFF0F7',

        'violet': '#7B3FF2',
        'violet-soft': '#F3EEFF',

        'silver': '#C4CCD8',
        'black': '#0C0D10',

        'page': '#F6F7FC',
        'surface': '#FFFFFF',
        'text-main': '#0C0D10',
        'text-muted': '#596273',
        'border-ui': '#E4E8F0',
        'input-border': '#C4CCD8',

        // Functional aliases
        'primary': '#3155FF',
        'primary-hover': '#2444DC',
        'primary-active': '#1C35B8',
        'highlight': '#C7F000',
        'highlight-hover': '#B6DC00',

        // Map marker semantic tokens
        'marker-user': '#3155FF',
        'marker-room': '#3155FF',
        'marker-pickup': '#C7F000',
        'marker-supplier': '#7B3FF2',
        'marker-demand': '#EF4444',

        // Semantic states
        'status-success': '#C7F000',
        'status-warning': '#F59E0B',
        'status-error': '#EF4444',

        // Legacy compatibility mappings mapped to Final Palette
        'fg-night': '#3155FF',
        'fg-blue': '#3155FF',
        'fg-lime': '#C7F000',
        'fg-violet': '#7B3FF2',
        'fg-sky': '#EEF1FF',
        'fg-bg': '#F6F7FC',
        'fg-bg-soft': '#EEF1FF',
        'fg-surface': '#FFFFFF',
        'fg-text': '#0C0D10',
        'fg-text-secondary': '#596273',
        'fg-border': '#E4E8F0',
        'fg-tint-lime': '#F5FBD9',
        'fg-tint-violet': '#F3EEFF',
        'fg-tint-sky': '#EEF1FF',
      },
      boxShadow: {
        'card': '0 6px 24px rgba(12, 13, 16, 0.06)',
        'hover': '0 12px 32px rgba(49, 85, 255, 0.12)',
        'card-hover': '0 12px 32px rgba(49, 85, 255, 0.12)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(120deg, #2444DC 0%, #3155FF 60%, #6336D6 100%)',
        'cta-gradient': 'linear-gradient(135deg, #3155FF 0%, #2444DC 100%)',
        'secondary-gradient': 'linear-gradient(135deg, #7B3FF2 0%, #3155FF 50%, #C7F000 100%)',
        'lime-gradient': 'linear-gradient(135deg, #C7F000 0%, #F5FBD9 100%)',
        'voucher-gradient': 'linear-gradient(135deg, #FF4FA3 0%, #7B3FF2 100%)',
        'progress-gradient': 'linear-gradient(90deg, #3155FF 0%, #C7F000 100%)',
        'progress-almost': 'linear-gradient(90deg, #3155FF 0%, #C7F000 100%)',
        'footer-gradient': 'linear-gradient(135deg, #0C0D10 0%, #0C0D10 100%)',
        'highlight-card-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #F5FBD9 100%)',
        'warm-card-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #EEF1FF 100%)',
        'accent-gradient': 'linear-gradient(135deg, #FF4FA3 0%, #7B3FF2 100%)',
        'trust-gradient': 'linear-gradient(135deg, #FFFFFF 0%, #F6F7FC 100%)',
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
