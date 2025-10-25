<template>
  <div class="terminal-commands fixed bottom-16 sm:bottom-12 left-0 right-0 p-4 border-t border-terminal-green bg-terminal-bg-secondary w-full z-10">
    <div class="flex flex-col sm:flex-row gap-4">
      <a
        href="https://github.com/ma-asad"
        target="_blank"
        rel="noopener noreferrer"
        class="terminal-command-btn inline-flex items-center gap-2 px-4 py-2 border border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-all duration-200 font-terminal group"
      >
        <font-awesome-icon :icon="['fab', 'github']" class="text-terminal-green group-hover:text-terminal-bg transition-colors duration-200" />
        <span class="text-terminal-green group-hover:text-terminal-bg transition-colors duration-200">></span>
        <span>git clone github.com/ma-asad</span>
      </a>
      <a
        href="https://linkedin.com/in/maatterkhan"
        target="_blank"
        rel="noopener noreferrer"
        class="terminal-command-btn inline-flex items-center gap-2 px-4 py-2 border border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan hover:text-terminal-bg transition-all duration-200 font-terminal group"
      >
        <font-awesome-icon :icon="['fab', 'linkedin']" class="text-terminal-cyan group-hover:text-terminal-bg transition-colors duration-200" />
        <span class="text-terminal-cyan group-hover:text-terminal-bg transition-colors duration-200">></span>
        <span>connect linkedin.com/in/maatterkhan</span>
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
