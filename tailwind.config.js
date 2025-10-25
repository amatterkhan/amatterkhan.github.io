/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'terminal': ['JetBrains Mono', 'Share Tech Mono', 'Courier New', 'monospace'],
        'mono': ['JetBrains Mono', 'Share Tech Mono', 'Courier New', 'monospace'],
      },
      colors: {
        'terminal-green': '#00ff00',
        'terminal-cyan': '#00ffff',
        'terminal-yellow': '#ffff00',
        'terminal-red': '#ff0000',
        'terminal-bg': '#0a0a0a',
        'terminal-bg-secondary': '#1a1a1a',
        'terminal-bg-tertiary': '#2a2a2a',
      },
      textShadow: {
        'terminal': '0 0 5px #00ff00',
        'terminal-cyan': '0 0 5px #00ffff',
      },
      boxShadow: {
        'terminal': '0 0 10px rgba(0, 255, 0, 0.3)',
        'terminal-glow': '0 0 20px rgba(0, 255, 0, 0.2)',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px'
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
}
