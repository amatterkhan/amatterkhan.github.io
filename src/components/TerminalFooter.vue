<template>
  <div class="terminal-footer fixed bottom-0 left-0 right-0 p-4 border-t border-terminal-green bg-terminal-bg-secondary w-full z-10">
    <div class="flex justify-between items-center text-xs text-terminal-green opacity-75">
      <div>Status: Online</div>
      <div>&copy; {{ currentYear }} Mohammad Asad Atterkhan</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.terminal-footer {
  font-family: 'JetBrains Mono', 'Share Tech Mono', 'Courier New', monospace;
}
</style>
