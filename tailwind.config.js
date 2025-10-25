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
        'terminal-green': 'var(--color-text-primary)',
        'terminal-cyan': 'var(--color-text-cyan)',
        'terminal-yellow': 'var(--color-text-yellow)',
        'terminal-red': 'var(--color-error)',
        'terminal-content': 'var(--color-text-content)',
        'terminal-highlight': 'var(--color-text-highlight)',
        'terminal-subtle': 'var(--color-text-subtle)',
        'terminal-accent': 'var(--color-text-accent)',
        'terminal-bg': 'var(--color-bg-primary)',
        'terminal-bg-secondary': 'var(--color-bg-secondary)',
        'terminal-bg-tertiary': 'var(--color-bg-tertiary)',
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
