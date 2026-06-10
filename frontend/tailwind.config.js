/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      keyframes: {
        'slide-in': {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float-up': {
          '0%':   { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-52px) scale(1.25)' },
        },
        'flash-green': {
          '0%, 100%': { boxShadow: 'none',                                              backgroundColor: '#1e293b' },
          '45%':      { boxShadow: '0 0 0 2px #34d399, 0 0 24px #34d39940',            backgroundColor: '#0d2e20' },
        },
        'flash-purple': {
          '0%, 100%': { boxShadow: 'none',                                              backgroundColor: '#1e293b' },
          '45%':      { boxShadow: '0 0 0 2px #a78bfa, 0 0 24px #a78bfa40',            backgroundColor: '#1c1040' },
        },
        'toast-in': {
          '0%':   { opacity: '0', transform: 'translateX(16px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        'pop': {
          '0%':   { transform: 'scale(1)' },
          '45%':  { transform: 'scale(1.18)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px #f59e0b30' },
          '50%':      { boxShadow: '0 0 20px #f59e0b60' },
        },
      },
      animation: {
        'slide-in':     'slide-in 0.25s ease-out both',
        'float-up':     'float-up 0.85s ease-out forwards',
        'flash-green':  'flash-green 0.7s ease-in-out',
        'flash-purple': 'flash-purple 0.7s ease-in-out',
        'toast-in':     'toast-in 0.22s ease-out',
        'pop':          'pop 0.22s ease-in-out',
        'fade-in':      'fade-in 0.5s ease-out',
        'glow-pulse':   'glow-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
