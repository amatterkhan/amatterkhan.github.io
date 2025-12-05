<template>
  <div class="terminal-commands fixed bottom-12 left-0 right-0 p-4 border-t border-terminal-green bg-terminal-bg-secondary w-full z-10">
    <div class="flex flex-col sm:flex-row gap-4">
      <a
        href="https://github.com/amatterkhan"
        target="_blank"
        rel="noopener noreferrer"
        class="terminal-command-btn inline-flex items-center gap-2 px-4 py-2 border border-terminal-green hover:bg-terminal-green transition-all duration-200 font-terminal group"
      >
        <font-awesome-icon :icon="['fab', 'github']" class="group-hover:text-terminal-bg transition-colors duration-200" />
        <span class="group-hover:text-terminal-bg transition-colors duration-200">></span>
        <span class="group-hover:text-terminal-bg transition-colors duration-200">GitHub</span>
      </a>
      <a
        href="https://linkedin.com/in/amatterkhan"
        target="_blank"
        rel="noopener noreferrer"
        class="terminal-command-btn inline-flex items-center gap-2 px-4 py-2 border border-terminal-green hover:bg-terminal-green transition-all duration-200 font-terminal group"
      >
        <font-awesome-icon :icon="['fab', 'linkedin']" class="group-hover:text-terminal-bg transition-colors duration-200" />
        <span class="group-hover:text-terminal-bg transition-colors duration-200">></span>
        <span class="group-hover:text-terminal-bg transition-colors duration-200">LinkedIn</span>
      </a>
    </div>
  </div>
</template>

<script setup>
// Terminal command buttons component
</script>

<style scoped>
.terminal-command-btn {
  font-family: 'JetBrains Mono', monospace;
  text-decoration: none;
  transition: all 0.2s ease;
}

.terminal-command-btn:hover {
  box-shadow: 0 0 10px currentColor;
}
</style>
