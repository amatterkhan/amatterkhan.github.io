<template>
  <div class="theme-switcher relative">
    <button
      @click="isOpen = !isOpen"
      class="theme-button w-6 h-6 flex items-center justify-center text-terminal-green hover:text-terminal-cyan transition-colors duration-200 text-xs"
      aria-label="Change theme"
      title="Change theme"
    >
      <font-awesome-icon :icon="['fas', 'palette']" />
    </button>

    <!-- Theme dropdown -->
    <div
      v-if="isOpen"
      class="theme-dropdown absolute right-0 mt-1 bg-terminal-bg-secondary border border-terminal-green z-50"
    >
      <button
        v-for="(theme, key) in themes"
        :key="key"
        @click="selectTheme(key)"
        class="theme-option w-full px-3 py-1.5 text-left font-terminal text-xs transition-colors duration-150 whitespace-nowrap"
        :class="{
          'bg-terminal-green text-terminal-bg': currentTheme === key,
          'text-terminal-green hover:bg-terminal-bg-tertiary': currentTheme !== key
        }"
      >
        <span>{{ currentTheme === key ? '> ' : '  ' }}{{ theme.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { themes, currentTheme, setTheme } = useTheme()
const isOpen = ref(false)

const selectTheme = (themeName) => {
  setTheme(themeName)
  isOpen.value = false
}

const closeOnClickOutside = (event) => {
  if (!event.target.closest('.theme-switcher')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeOnClickOutside)
})
</script>

<style scoped>
.theme-button {
  font-family: 'JetBrains Mono', monospace;
}

.theme-dropdown {
  min-width: 160px;
  max-height: 300px;
  overflow-y: auto;
}

.theme-option {
  font-family: 'JetBrains Mono', monospace;
}
</style>

