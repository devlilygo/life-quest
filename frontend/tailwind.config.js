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
          '0%, 100%': { boxShadow: 'none',                  backgroundColor: 'white' },
          '45%':      { boxShadow: '0 0 0 3px #6ee7b7',    backgroundColor: '#ecfdf5' },
        },
        'flash-purple': {
          '0%, 100%': { boxShadow: 'none',                  backgroundColor: 'white' },
          '45%':      { boxShadow: '0 0 0 3px #c4b5fd',    backgroundColor: '#f5f3ff' },
        },
        'toast-in': {
          '0%':   { opacity: '0', transform: 'translateX(16px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateX(0)  scale(1)' },
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
      },
      animation: {
        'slide-in':     'slide-in 0.25s ease-out both',
        'float-up':     'float-up 0.85s ease-out forwards',
        'flash-green':  'flash-green 0.7s ease-in-out',
        'flash-purple': 'flash-purple 0.7s ease-in-out',
        'toast-in':     'toast-in 0.22s ease-out',
        'pop':          'pop 0.22s ease-in-out',
        'fade-in':      'fade-in 0.5s ease-out',
      },
    },
  },
  plugins: [],
}
