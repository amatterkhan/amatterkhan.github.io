import { ref, watch } from 'vue'

const themes = {
  'matrix': {
    name: 'Matrix Green',
    colors: {
      primary: '#00ff00',
      accent: '#00ffff',
      yellow: '#ffff00',
      background: '#0a0a0a',
      backgroundSecondary: '#1a1a1a',
      backgroundTertiary: '#2a2a2a',
      text: '#00ff00',
      textSecondary: '#ffffff',
      textTertiary: '#cccccc',
      textMuted: '#888888',
      textContent: '#b8f5b8',
      textHighlight: '#00ffff',
      textSubtle: '#66ff66',
      textAccent: '#39ff14'
    }
  },
  'amber': {
    name: 'Amber Classic',
    colors: {
      primary: '#ffb000',
      accent: '#ff8c00',
      yellow: '#ffd700',
      background: '#0a0a0a',
      backgroundSecondary: '#1a1200',
      backgroundTertiary: '#2a1f00',
      text: '#ffb000',
      textSecondary: '#ffd700',
      textTertiary: '#cc8800',
      textMuted: '#996600',
      textContent: '#ffcc80',
      textHighlight: '#ffd700',
      textSubtle: '#e6a83a',
      textAccent: '#ff8c00'
    }
  },
  'ibm': {
    name: 'IBM Blue',
    colors: {
      primary: '#00d4ff',
      accent: '#5af78e',
      yellow: '#ff6ac1',
      background: '#0a0e27',
      backgroundSecondary: '#15192e',
      backgroundTertiary: '#1f2437',
      text: '#00d4ff',
      textSecondary: '#ffffff',
      textTertiary: '#8bb9fe',
      textMuted: '#4a6fa5',
      textContent: '#a8d5ff',
      textHighlight: '#5af78e',
      textSubtle: '#6eb8ff',
      textAccent: '#ff6ac1'
    }
  },
  'dracula': {
    name: 'Dracula',
    colors: {
      primary: '#50fa7b',
      accent: '#bd93f9',
      yellow: '#f1fa8c',
      background: '#282a36',
      backgroundSecondary: '#1e1f29',
      backgroundTertiary: '#3e4153',
      text: '#50fa7b',
      textSecondary: '#f8f8f2',
      textTertiary: '#8be9fd',
      textMuted: '#6272a4',
      textContent: '#a3f7bf',
      textHighlight: '#bd93f9',
      textSubtle: '#69fb9a',
      textAccent: '#8be9fd'
    }
  },
  'cyberpunk': {
    name: 'Cyberpunk',
    colors: {
      primary: '#ff006e',
      accent: '#8338ec',
      yellow: '#fb5607',
      background: '#0d0221',
      backgroundSecondary: '#1a0933',
      backgroundTertiary: '#2d1b4e',
      text: '#ff006e',
      textSecondary: '#ffffff',
      textTertiary: '#00f5ff',
      textMuted: '#7209b7',
      textContent: '#ff6bb5',
      textHighlight: '#8338ec',
      textSubtle: '#ff3385',
      textAccent: '#00f5ff'
    }
  },
  'gruvbox': {
    name: 'Gruvbox Dark',
    colors: {
      primary: '#b8bb26',
      accent: '#fabd2f',
      yellow: '#fe8019',
      background: '#282828',
      backgroundSecondary: '#1d2021',
      backgroundTertiary: '#3c3836',
      text: '#b8bb26',
      textSecondary: '#ebdbb2',
      textTertiary: '#8ec07c',
      textMuted: '#928374',
      textContent: '#d5c4a1',
      textHighlight: '#fabd2f',
      textSubtle: '#a9b665',
      textAccent: '#8ec07c'
    }
  },
  'nord': {
    name: 'Nord',
    colors: {
      primary: '#88c0d0',
      accent: '#81a1c1',
      yellow: '#ebcb8b',
      background: '#2e3440',
      backgroundSecondary: '#242933',
      backgroundTertiary: '#3b4252',
      text: '#88c0d0',
      textSecondary: '#eceff4',
      textTertiary: '#a3be8c',
      textMuted: '#4c566a',
      textContent: '#d8dee9',
      textHighlight: '#81a1c1',
      textSubtle: '#8fbcbb',
      textAccent: '#a3be8c'
    }
  }
}

const currentTheme = ref(localStorage.getItem('terminal-theme') || 'nord')

const applyTheme = (themeName) => {
  const theme = themes[themeName]
  if (!theme) return

  const root = document.documentElement
  const colors = theme.colors

  // Core colors
  root.style.setProperty('--color-primary', colors.primary)
  root.style.setProperty('--color-primary-hover', colors.accent)
  root.style.setProperty('--color-accent', colors.accent)
  root.style.setProperty('--color-warning', colors.yellow)
  root.style.setProperty('--color-error', '#ff0000')
  
  // Backgrounds
  root.style.setProperty('--color-bg-primary', colors.background)
  root.style.setProperty('--color-bg-secondary', colors.backgroundSecondary)
  root.style.setProperty('--color-bg-tertiary', colors.backgroundTertiary)
  root.style.setProperty('--color-bg-quaternary', colors.backgroundTertiary)
  
  // Text colors
  root.style.setProperty('--color-text-primary', colors.text)
  root.style.setProperty('--color-text-secondary', colors.textSecondary)
  root.style.setProperty('--color-text-tertiary', colors.textTertiary)
  root.style.setProperty('--color-text-quaternary', colors.textMuted)
  root.style.setProperty('--color-text-cyan', colors.textTertiary)
  root.style.setProperty('--color-text-yellow', colors.yellow)
  root.style.setProperty('--color-text-muted', colors.textMuted)
  root.style.setProperty('--color-text-content', colors.textContent)
  root.style.setProperty('--color-text-highlight', colors.textHighlight)
  root.style.setProperty('--color-text-subtle', colors.textSubtle)
  root.style.setProperty('--color-text-accent', colors.textAccent)
  
  // Borders
  root.style.setProperty('--color-border-primary', colors.primary)
  root.style.setProperty('--color-border-secondary', colors.accent)
  root.style.setProperty('--color-border-muted', `${colors.primary}4d`)
  
  // Component colors
  root.style.setProperty('--color-nav-bg', `${colors.background}f2`)
  root.style.setProperty('--color-card-bg', colors.backgroundSecondary)
  root.style.setProperty('--color-dropdown-bg', colors.backgroundTertiary)
  root.style.setProperty('--color-sticky-bg', `${colors.background}e6`)
  
  // Interactive
  root.style.setProperty('--color-icon-hover', colors.accent)
  root.style.setProperty('--color-link-hover', colors.accent)
  root.style.setProperty('--color-cursor', colors.primary)
  root.style.setProperty('--color-selection', `${colors.primary}4d`)
  
  // Update body and html backgrounds
  document.body.style.backgroundColor = colors.background
  document.documentElement.style.backgroundColor = colors.background
}

watch(currentTheme, (newTheme) => {
  localStorage.setItem('terminal-theme', newTheme)
  applyTheme(newTheme)
})

export function useTheme() {
  return {
    themes,
    currentTheme,
    setTheme: (themeName) => {
      if (themes[themeName]) {
        currentTheme.value = themeName
      }
    },
    applyTheme
  }
}

