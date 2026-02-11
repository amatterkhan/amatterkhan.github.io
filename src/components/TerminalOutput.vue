<template>
  <div class="terminal-output flex-1 p-4 font-terminal text-sm leading-relaxed w-full">
    <div v-for="(line, index) in terminalOutput" :key="index" :class="`text-${line.color}`">
      <span v-if="line.animated" class="terminal-animated">{{ line.text }}</span>
      <span v-else-if="line.isAsciiCat" class="ascii-art">{{ line.text }}</span>
      <span v-else-if="line.isLink" class="terminal-link">
        <a v-if="line.isExternalLink" :href="line.linkTo" target="_blank" rel="noopener noreferrer" class="hover:text-terminal-cyan transition-colors">
          {{ line.text }}
        </a>
        <router-link v-else :to="line.linkTo" class="hover:text-terminal-cyan transition-colors">
          {{ line.text }}
        </router-link>
      </span>
      <span v-else>{{ line.text }}</span>
    </div>
    
    <!-- Interactive Command Input -->
    <div v-if="showInput" class="flex items-center mt-2 mb-8">
      <span class="text-terminal-green mr-1 sm:mr-2 text-xs sm:text-sm">asad@atterkhan: ~$</span>
      <input
        ref="commandInput"
        v-model="currentCommand"
        @keydown.enter="executeCommand"
        @keydown.up="navigateHistory(-1)"
        @keydown.down="navigateHistory(1)"
        class="flex-1 bg-transparent border-none outline-none text-terminal-green font-terminal command-input"
        placeholder="type 'help' for available commands"
        autocomplete="off"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import workExpData from '@/data/workExpData.json'
import postData from '@/data/postData.json'
import projectsData from '@/data/projectsData.json'
import commandsData from '@/data/commandsData.json'

const router = useRouter()
const terminalOutput = ref([])
const timeouts = []
let catAnimationInterval = null
const currentCommand = ref('')
const commandHistory = ref([])
const historyIndex = ref(-1)
const showInput = ref(false)
const commandInput = ref(null)

const clearTimeouts = () => {
  timeouts.forEach(t => clearTimeout(t))
  timeouts.length = 0
  if (catAnimationInterval) {
    clearInterval(catAnimationInterval)
    catAnimationInterval = null
  }
}

// ASCII cat animation frames
const catFrames = [
  [
    '     /\\_/\\  ',
    '    ( o.o ) '
  ],
  [
    '     /\\_/\\  ',
    '    ( -.- ) '
  ],
  [
    '     /\\_/\\  ',
    '    ( o.o ) '
  ],
  [
    '     /\\_/\\  ',
    '    ( ^.^ ) '
  ]
]

let currentCatFrame = 0

// Get current role dynamically
const currentRole = computed(() => {
  const current = workExpData.find(exp => exp.isCurrent)
  return current ? `${current.title} at ${current.company}` : ''
})

onMounted(() => {
  const startupSequence = [
    { text: 'Welcome to asad@atterkhan', color: 'terminal-green' },
    { text: 'Initializing system...', color: 'terminal-yellow' },
    { text: 'Loading user profile...', color: 'terminal-cyan' },
    { text: 'System ready.', color: 'terminal-green' },
    { text: '', color: 'terminal-green' },
    { text: 'asad@atterkhan: ~$ cat about.txt', color: 'terminal-green' },
    { text: '', color: 'terminal-green' },
    { text: currentRole.value, color: 'terminal-cyan' },
    { text: commandsData.about.summary, color: 'terminal-yellow' },
    { text: commandsData.about.interests, color: 'terminal-cyan' },
    { text: '', color: 'terminal-green' },
    { text: catFrames[0][0], color: 'terminal-yellow', isAsciiCat: true, catLineIndex: 0 },
    { text: catFrames[0][1], color: 'terminal-yellow', isAsciiCat: true, catLineIndex: 1 },
    { text: '', color: 'terminal-green' }
  ]

  let currentLine = 0
  let delay = 0
  
  // Display initial lines
  for (let i = 0; i < 5; i++) {
    timeouts.push(setTimeout(() => {
      terminalOutput.value.push({ ...startupSequence[i] })
    }, delay))
    delay += 200
  }
  
  // Type whoami command
  const prompt = 'asad@atterkhan: ~$ '
  const command = 'whoami'
  const fullName = 'Mohammad Asad Atterkhan'
  
  timeouts.push(setTimeout(() => {
    const cmdIndex = terminalOutput.value.length
    terminalOutput.value.push({ text: prompt, color: 'terminal-green' })
    
    // Type command character by character
    for (let i = 0; i <= command.length; i++) {
      timeouts.push(setTimeout(() => {
        terminalOutput.value[cmdIndex].text = prompt + command.substring(0, i)
      }, i * 80))
    }
    
    // Type name output (single time)
    timeouts.push(setTimeout(() => {
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      const nameIndex = terminalOutput.value.length
      terminalOutput.value.push({ 
        text: '', 
        color: 'terminal-cyan', 
        animated: true 
      })
      
      // Type name character by character
      for (let i = 0; i <= fullName.length; i++) {
        timeouts.push(setTimeout(() => {
          terminalOutput.value[nameIndex].text = fullName.substring(0, i)
        }, i * 100))
      }
      
      // Continue with remaining lines after a delay
      timeouts.push(setTimeout(() => {
        terminalOutput.value.push({ text: '', color: 'terminal-green' })
        
        currentLine = 5
        const continueDisplay = () => {
          if (currentLine < startupSequence.length) {
            terminalOutput.value.push({ ...startupSequence[currentLine] })
            currentLine++
            timeouts.push(setTimeout(continueDisplay, 200))
          } else {
            // Start cat animation and enable input after all lines are displayed
            startCatAnimation()
            enableInput()
          }
        }
        continueDisplay()
      }, 2000))
      
    }, command.length * 80 + 300))
    
  }, delay))
})

// Animate the ASCII cat
const startCatAnimation = () => {
  catAnimationInterval = setInterval(() => {
    currentCatFrame = (currentCatFrame + 1) % catFrames.length
    
    // Find and update cat lines in terminal output
    terminalOutput.value.forEach((line, index) => {
      if (line.isAsciiCat && line.catLineIndex !== undefined) {
        terminalOutput.value[index].text = catFrames[currentCatFrame][line.catLineIndex]
      }
    })
  }, 800) // Change frame every 800ms
}

// Enable interactive input
const enableInput = () => {
  timeouts.push(setTimeout(() => {
    showInput.value = true
    nextTick(() => {
      commandInput.value?.focus()
    })
  }, 500))
}

// Command execution
const executeCommand = () => {
  const cmd = currentCommand.value.trim().toLowerCase()
  if (!cmd) return
  
  // Add command to output
  terminalOutput.value.push({ 
    text: `asad@atterkhan: ~$ ${currentCommand.value}`, 
    color: 'terminal-green' 
  })
  
  // Add to history
  commandHistory.value.push(currentCommand.value)
  historyIndex.value = commandHistory.value.length
  
  // Execute command
  processCommand(cmd)
  
  // Clear input
  currentCommand.value = ''
}

// Process commands
const processCommand = (cmd) => {
  switch (cmd) {
    case 'help':
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: 'Available commands:', color: 'terminal-cyan' })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: 'Information:', color: 'terminal-highlight' })
      terminalOutput.value.push({ text: '  whoami    - Display user information', color: 'terminal-content' })
      terminalOutput.value.push({ text: '  about     - Show about and interests', color: 'terminal-content' })
      terminalOutput.value.push({ text: '  skills    - List technical skills', color: 'terminal-content' })
      terminalOutput.value.push({ text: '  contact   - Show contact information', color: 'terminal-content' })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: 'Content:', color: 'terminal-highlight' })
      terminalOutput.value.push({ text: '  recent    - Show recent blog posts', color: 'terminal-content' })
      terminalOutput.value.push({ text: '  projects  - List featured projects', color: 'terminal-content' })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: 'Navigation:', color: 'terminal-highlight' })
      terminalOutput.value.push({ text: '  resume    - Navigate to resume page', color: 'terminal-content' })
      terminalOutput.value.push({ text: '  blog      - Navigate to blog page', color: 'terminal-content' })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: 'Utility:', color: 'terminal-highlight' })
      terminalOutput.value.push({ text: '  clear     - Clear the terminal', color: 'terminal-content' })
      terminalOutput.value.push({ text: '  refresh   - Refresh the page', color: 'terminal-content' })
      terminalOutput.value.push({ text: '  history   - Show command history', color: 'terminal-content' })
      terminalOutput.value.push({ text: '  date      - Display current date/time', color: 'terminal-content' })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      break
      
    case 'recent':
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: 'Recent blog posts:', color: 'terminal-cyan' })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      const recentPosts = postData.slice(0, 3)
      recentPosts.forEach((post, index) => {
        terminalOutput.value.push({ 
          text: `${index + 1}. ${post.title}`, 
          color: 'terminal-highlight',
          isLink: true,
          linkTo: `/blog/${post.id}`
        })
        terminalOutput.value.push({ 
          text: `   ${post.date} | ${post.readTime}`, 
          color: 'terminal-subtle' 
        })
      })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      break
      
    case 'clear':
      terminalOutput.value = []
      break
      
    case 'refresh':
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: 'Refreshing page...', color: 'terminal-yellow' })
      setTimeout(() => window.location.reload(), 500)
      break
      
    case 'whoami':
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: 'Mohammad Asad Atterkhan', color: 'terminal-cyan' })
      break
      
    case 'resume':
      terminalOutput.value.push({ text: 'Navigating to resume...', color: 'terminal-yellow' })
      setTimeout(() => router.push('/resume'), 500)
      break
      
    case 'blog':
      terminalOutput.value.push({ text: 'Navigating to blog...', color: 'terminal-yellow' })
      setTimeout(() => router.push('/blog'), 500)
      break
      
    case 'about':
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: currentRole.value, color: 'terminal-cyan' })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: commandsData.about.bio, color: 'terminal-content' })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      break
      
    case 'skills':
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: 'Technical Skills:', color: 'terminal-cyan' })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      commandsData.skills.forEach(skill => {
        terminalOutput.value.push({ 
          text: `  • ${skill.category}: ${skill.items}`, 
          color: 'terminal-content' 
        })
      })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      break
      
    case 'contact':
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: 'Contact Information:', color: 'terminal-cyan' })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ 
        text: `  Email:    ${commandsData.contact.email}`, 
        color: 'terminal-content',
        isLink: true,
        isExternalLink: true,
        linkTo: `mailto:${commandsData.contact.email}`
      })
      terminalOutput.value.push({ 
        text: `  LinkedIn: ${commandsData.contact.linkedin}`, 
        color: 'terminal-content',
        isLink: true,
        isExternalLink: true,
        linkTo: `https://${commandsData.contact.linkedin}`
      })
      terminalOutput.value.push({ 
        text: `  GitHub:   ${commandsData.contact.github}`, 
        color: 'terminal-content',
        isLink: true,
        isExternalLink: true,
        linkTo: `https://${commandsData.contact.github}`
      })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      break
      
    case 'projects':
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: 'Featured Projects:', color: 'terminal-cyan' })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      const featuredProjects = projectsData.filter(p => p.featured === true)
      if (featuredProjects.length === 0) {
        terminalOutput.value.push({ text: '  No featured projects available', color: 'terminal-subtle' })
      } else {
        featuredProjects.forEach((project, index) => {
          terminalOutput.value.push({ 
            text: `  ${index + 1}. ${project.title}`, 
            color: 'terminal-highlight' 
          })
          terminalOutput.value.push({ 
            text: `     ${project.description}`, 
            color: 'terminal-subtle' 
          })
          if (index < featuredProjects.length - 1) {
            terminalOutput.value.push({ text: '', color: 'terminal-green' })
          }
        })
      }
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: 'Type "projects" in navigation or visit /projects for all projects', color: 'terminal-yellow' })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      break
      
    case 'history':
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ text: 'Command History:', color: 'terminal-cyan' })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      if (commandHistory.value.length === 0) {
        terminalOutput.value.push({ text: '  No commands in history yet', color: 'terminal-subtle' })
      } else {
        commandHistory.value.forEach((cmd, index) => {
          terminalOutput.value.push({ 
            text: `  ${index + 1}. ${cmd}`, 
            color: 'terminal-content' 
          })
        })
      }
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      break
      
    case 'date':
      const now = new Date()
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ 
        text: now.toLocaleString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit'
        }), 
        color: 'terminal-cyan' 
      })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      break
      
    default:
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
      terminalOutput.value.push({ 
        text: `Command not found: ${cmd}. Type 'help' for available commands.`, 
        color: 'terminal-red' 
      })
      terminalOutput.value.push({ text: '', color: 'terminal-green' })
  }
  
  // Scroll to bottom with smooth behavior
  nextTick(() => {
    setTimeout(() => {
      const outputEl = document.querySelector('.terminal-output')
      if (outputEl) {
        outputEl.scrollTop = outputEl.scrollHeight
      }
      // Refocus input after scroll
      commandInput.value?.focus()
    }, 100)
  })
}

// Navigate command history
const navigateHistory = (direction) => {
  if (commandHistory.value.length === 0) return
  
  historyIndex.value = Math.max(0, Math.min(commandHistory.value.length, historyIndex.value + direction))
  
  if (historyIndex.value < commandHistory.value.length) {
    currentCommand.value = commandHistory.value[historyIndex.value]
  } else {
    currentCommand.value = ''
  }
}

onBeforeUnmount(() => {
  clearTimeouts()
})
</script>

<style scoped>
.terminal-output {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.6;
  width: 100%;
}

.terminal-animated {
  animation: glow 2s ease-in-out infinite alternate;
}

.ascii-art {
  white-space: pre;
}

.terminal-link {
  cursor: pointer;
}

.terminal-link a {
  text-decoration: none;
  color: inherit;
}

.command-input {
  caret-color: var(--color-text-primary);
  font-size: 16px; /* Prevent iOS zoom on focus - minimum for mobile */
  line-height: 1.2; /* Tighter line height to make it look more compact */
  padding: 0; /* Remove any default padding */
}

.command-input::placeholder {
  color: var(--color-text-muted);
  opacity: 0.5;
  font-size: 0.75rem; /* Smaller placeholder on mobile */
}

/* Desktop: use smaller font size */
@media (min-width: 768px) {
  .command-input {
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  .command-input::placeholder {
    font-size: 0.875rem;
  }
}

@keyframes glow {
  0% { 
    text-shadow: 0 0 5px currentColor;
    opacity: 0.8;
  }
  100% { 
    text-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
    opacity: 1;
  }
}
</style>
