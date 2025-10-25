<template>
  <div class="terminal-output flex-1 p-4 font-terminal text-sm leading-relaxed w-full">
    <div v-for="(line, index) in terminalOutput" :key="index" :class="`text-${line.color}`">
      <span v-if="line.animated" class="terminal-animated">{{ line.text }}</span>
      <span v-else-if="line.isAsciiCat" class="ascii-art">{{ line.text }}</span>
      <span v-else>{{ line.text }}</span>
      <span v-if="line.cursor" class="terminal-cursor">_</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import workExpData from '@/data/workExpData.json'

const terminalOutput = ref([])
const timeouts = []
let catAnimationInterval = null

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
    { text: 'Welcome to ma-asad@terminal', color: 'terminal-green' },
    { text: 'Initializing system...', color: 'terminal-yellow' },
    { text: 'Loading user profile...', color: 'terminal-cyan' },
    { text: 'System ready.', color: 'terminal-green' },
    { text: '', color: 'terminal-green' },
    { text: 'ma-asad@terminal:~$ cat about.txt', color: 'terminal-green' },
    { text: '', color: 'terminal-green' },
    { text: currentRole.value, color: 'terminal-cyan' },
    { text: 'Passionate about cybersecurity, networking, automation and technology in general.', color: 'terminal-yellow' },
    { text: 'Oh and I also like Cats!', color: 'terminal-cyan' },
    { text: '', color: 'terminal-green' },
    { text: catFrames[0][0], color: 'terminal-yellow', isAsciiCat: true, catLineIndex: 0 },
    { text: catFrames[0][1], color: 'terminal-yellow', isAsciiCat: true, catLineIndex: 1 },
    { text: '', color: 'terminal-green' },
    { text: 'ma-asad@terminal:~$ ls -la', color: 'terminal-green' },
    { text: '', color: 'terminal-green' },
    { text: 'drwxr-xr-x 2 ma-asad ma-asad 4096 Jan 1 00:00 resume/', color: 'terminal-cyan' },
    { text: 'drwxr-xr-x 2 ma-asad ma-asad 4096 Jan 1 00:00 blog/', color: 'terminal-cyan' },
    { text: '', color: 'terminal-green' },
    { text: 'ma-asad@terminal:~$ ', color: 'terminal-green', cursor: true }
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
  const prompt = 'ma-asad@terminal:~$ '
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
            // Start cat animation after all lines are displayed
            startCatAnimation()
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

.terminal-cursor {
  animation: blink 1s infinite;
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

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
