<template>
  <div class="terminal-layout w-full h-screen bg-terminal-bg text-terminal-green font-terminal flex flex-col">
    <!-- Terminal Header with Tabs -->
    <div class="terminal-header bg-terminal-bg-secondary border-b border-terminal-green w-full flex-shrink-0">
      <!-- Terminal Window Controls -->
      <div class="flex items-center justify-between p-3 sm:p-4 border-b border-terminal-green w-full">
        <div class="flex items-center space-x-2 sm:space-x-2">
          <div class="w-2 h-2 sm:w-3 sm:h-3 bg-terminal-red rounded-full"></div>
          <div class="w-2 h-2 sm:w-3 sm:h-3 bg-terminal-yellow rounded-full"></div>
          <div class="w-2 h-2 sm:w-3 sm:h-3 bg-terminal-green rounded-full"></div>
          <span class="hidden sm:inline ml-4 text-terminal-green text-sm">{{ currentPrompt }}</span>
          <span class="hidden sm:inline terminal-cursor">_</span>
        </div>
        <div class="flex items-center gap-2 sm:gap-4">
          <ThemeSwitcher />
          <div class="text-xs sm:text-sm text-terminal-green opacity-75">
            {{ currentTime }}
          </div>
        </div>
      </div>
      
      <!-- Desktop Navigation Tabs -->
      <nav class="hidden sm:flex w-full">
        <router-link
          v-for="tab in tabs"
          :key="tab.name"
          :to="tab.path"
          :class="[
            'terminal-tab flex-1 px-4 py-3 border-r border-terminal-green transition-all duration-200 text-center text-base',
            $route.name === tab.name ? 'active bg-terminal-bg text-terminal-green' : 'bg-terminal-bg-secondary text-terminal-green hover:bg-terminal-bg-tertiary hover:text-terminal-cyan'
          ]"
        >
          <div class="flex items-center justify-center space-x-2">
            <span class="text-terminal-green">></span>
            <span class="font-terminal">{{ tab.label }}</span>
          </div>
        </router-link>
      </nav>

      <!-- Mobile Navigation - Hamburger Menu -->
      <div class="sm:hidden">
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="w-full flex items-center justify-between p-3 border-b border-terminal-green bg-terminal-bg-secondary hover:bg-terminal-bg-tertiary transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <div class="flex items-center gap-2">
            <span class="text-terminal-green text-sm font-terminal">{{ mobilePrompt }}</span>
            <span class="terminal-cursor">_</span>
          </div>
          <font-awesome-icon 
            :icon="['fas', mobileMenuOpen ? 'times' : 'bars']" 
            class="text-terminal-green text-lg"
          />
        </button>
        <!-- Mobile Menu Dropdown -->
        <div
          v-if="mobileMenuOpen"
          class="bg-terminal-bg-secondary border-b border-terminal-green"
        >
          <router-link
            v-for="tab in tabs"
            :key="tab.name"
            :to="tab.path"
            @click="mobileMenuOpen = false"
            :class="[
              'block px-4 py-3 border-b border-terminal-green/50 transition-all duration-200',
              $route.name === tab.name ? 'active bg-terminal-bg text-terminal-green' : 'bg-terminal-bg-secondary text-terminal-green hover:bg-terminal-bg-tertiary hover:text-terminal-cyan'
            ]"
          >
            <div class="flex items-center space-x-2">
              <span class="text-terminal-green">></span>
              <span class="font-terminal text-base">{{ tab.label }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- Main Terminal Window -->
    <div class="terminal-main flex-1 flex flex-col w-full relative overflow-hidden">
      <!-- Terminal Content -->
      <div class="terminal-content flex-1 p-4 md:p-6 w-full overflow-y-auto">
        <div class="mb-32 sm:mb-24">
          <router-view />
        </div>
      </div>
    </div>
    
    <!-- Fixed Terminal Footer -->
    <TerminalFooter />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import TerminalFooter from './TerminalFooter.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'

const route = useRoute()
const currentTime = ref('')
const mobileMenuOpen = ref(false)

const tabs = [
  { name: 'home', path: '/', label: 'home' },
  { name: 'resume', path: '/resume', label: 'resume' },
  { name: 'projects', path: '/projects', label: 'projects' },
  { name: 'blog', path: '/blog', label: 'blog' },
]

const currentPrompt = computed(() => {
  const basePrompt = 'asad@atterkhan: ~$'
  const currentPath = route.name
  
  switch (currentPath) {
    case 'home':
      return 'asad@atterkhan: ~/home$'
    case 'resume':
      return 'asad@atterkhan: ~/resume$'
    case 'projects':
      return 'asad@atterkhan: ~/projects$'
    case 'blog':
      return 'asad@atterkhan: ~/blog$'
    case 'calendar':
      return 'asad@atterkhan: ~/calendar$'
    default:
      return basePrompt
  }
})

const mobilePrompt = computed(() => {
  const currentPath = route.name
  const tab = tabs.find(t => t.name === currentPath)
  return tab ? `> ~/${tab.label}$` : '> ~$'
})

let timeInterval

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString()
}
</script>

<style scoped>
.terminal-layout {
  font-family: 'JetBrains Mono', 'Share Tech Mono', 'Courier New', monospace;
  width: 100vw;
  height: 100vh;
}

.terminal-tab.active {
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  background: var(--color-bg-primary);
}

.terminal-tab:hover {
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.2);
}

.terminal-cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .terminal-content {
    padding: 1rem;
  }
}
</style>
