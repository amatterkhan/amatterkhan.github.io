<template>
  <div class="terminal-footer fixed bottom-0 left-0 right-0 p-4 border-t border-terminal-green bg-terminal-bg-secondary w-full z-10">
    <div class="flex justify-between items-center text-xs text-terminal-green opacity-75">
      <!-- Left side: Status or Social Links -->
      <div v-if="isHomePage">Status: Online</div>
      <div v-else class="flex items-center gap-4">
        <a
          href="https://github.com/amatterkhan"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-terminal-cyan transition-colors duration-200"
          aria-label="GitHub"
        >
          <font-awesome-icon :icon="['fab', 'github']" class="text-base" />
        </a>
        <a
          href="https://linkedin.com/in/amatterkhan"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-terminal-cyan transition-colors duration-200"
          aria-label="LinkedIn"
        >
          <font-awesome-icon :icon="['fab', 'linkedin']" class="text-base" />
        </a>
      </div>
      
      <!-- Right side: Copyright -->
      <div>&copy; {{ currentYear }} Mohammad Asad Atterkhan</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentYear = computed(() => new Date().getFullYear())
const isHomePage = computed(() => route.name === 'home')
</script>

<style scoped>
.terminal-footer {
  font-family: 'JetBrains Mono', 'Share Tech Mono', 'Courier New', monospace;
}
</style>
