import '@/styles/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useTheme } from '@/composables/useTheme'

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import {
    faCalendarDays,
    faEllipsis,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faDownload,
    faCode,
    faExternalLinkAlt,
    faMagnifyingGlass,
    faXmark,
    faThumbTack,
    faFilter,
    faPalette,
    faArrowLeft,
    faHashtag,
    faSun,
    faMoon,
    faBars,
    faTimes,
    faFileLines,
    faStar
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Add icons to the library
library.add(
    faGithub,
    faLinkedin,
    faEllipsis,
    faCalendarDays,
    faEnvelope,
    faPhone,
    faMapMarkerAlt,
    faDownload,
    faCode,
    faExternalLinkAlt,
    faMagnifyingGlass,
    faXmark,
    faThumbTack,
    faFilter,
    faPalette,
    faArrowLeft,
    faHashtag,
    faSun,
    faMoon,
    faBars,
    faTimes,
    faFileLines,
    faStar
)

// Initialize theme before mounting app
const { currentTheme, applyTheme } = useTheme()
applyTheme(currentTheme.value)

const app = createApp(App)

app.use(router)

// Register Font Awesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)

// Enable dark mode for terminal theme
document.documentElement.classList.add('dark')

// Restore path from 404 redirect
router.isReady().then(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const redirectPath = urlParams.get('redirect') || sessionStorage.getItem('redirectPath')
  
  if (redirectPath && redirectPath !== window.location.pathname) {
    sessionStorage.removeItem('redirectPath')
    router.push(redirectPath).catch(() => {})
  }
})

app.mount('#app')
