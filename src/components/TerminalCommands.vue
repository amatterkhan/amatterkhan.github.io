<template>
  <div class="terminal-commands fixed bottom-12 left-0 right-0 p-2 sm:p-4 border-t border-terminal-green bg-terminal-bg-secondary w-full z-10">
    <div class="flex flex-row gap-2 sm:gap-4 justify-center">
      <a
        href="mailto:contact@asad.atterkhan.com"
        class="terminal-command-btn inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border border-terminal-green hover:bg-terminal-green transition-all duration-200 font-terminal group flex-1 sm:flex-initial"
        aria-label="Contact Me"
      >
        <font-awesome-icon :icon="['fas', 'envelope']" class="group-hover:text-terminal-bg transition-colors duration-200 text-xs sm:text-base" />
        <span class="hidden sm:inline group-hover:text-terminal-bg transition-colors duration-200">></span>
        <span class="hidden sm:inline group-hover:text-terminal-bg transition-colors duration-200 text-xs sm:text-sm">Contact</span>
      </a>
      <a
        href="https://github.com/amatterkhan"
        target="_blank"
        rel="noopener noreferrer"
        class="terminal-command-btn inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border border-terminal-green hover:bg-terminal-green transition-all duration-200 font-terminal group flex-1 sm:flex-initial"
        aria-label="GitHub"
      >
        <font-awesome-icon :icon="['fab', 'github']" class="group-hover:text-terminal-bg transition-colors duration-200 text-xs sm:text-base" />
        <span class="hidden sm:inline group-hover:text-terminal-bg transition-colors duration-200">></span>
        <span class="hidden sm:inline group-hover:text-terminal-bg transition-colors duration-200 text-xs sm:text-sm">GitHub</span>
      </a>
      <a
        href="https://linkedin.com/in/amatterkhan"
        target="_blank"
        rel="noopener noreferrer"
        class="terminal-command-btn inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border border-terminal-green hover:bg-terminal-green transition-all duration-200 font-terminal group flex-1 sm:flex-initial"
        aria-label="LinkedIn"
      >
        <font-awesome-icon :icon="['fab', 'linkedin']" class="group-hover:text-terminal-bg transition-colors duration-200 text-xs sm:text-base" />
        <span class="hidden sm:inline group-hover:text-terminal-bg transition-colors duration-200">></span>
        <span class="hidden sm:inline group-hover:text-terminal-bg transition-colors duration-200 text-xs sm:text-sm">LinkedIn</span>
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
