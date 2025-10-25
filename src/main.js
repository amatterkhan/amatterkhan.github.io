import '@/styles/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

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
    faFilter
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
    faFilter
)

const app = createApp(App)

app.use(router)

// Register Font Awesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)

// Enable dark mode for terminal theme
document.documentElement.classList.add('dark')

app.mount('#app')
