<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import SocialLinks from '@/components/SocialLinks.vue'
import workExpData from '@/data/workExpData.json'

// Determine current role dynamically: prefer isCurrent, fallback to highest id
const currentExp = computed(() => {
    const marked = workExpData.find((exp) => exp.isCurrent === true)
    if (marked) return marked
    return workExpData.reduce((latest, exp) => (exp.id > latest.id ? exp : latest), workExpData[0])
})

const fullName = 'Mohammad Asad Atterkhan'
const typedName = ref('')
let typingTimeout
let restartTimeout
let setVhHandler

onMounted(() => {
    // Set up dynamic viewport height handler for better mobile support
    setVhHandler = () => {
        const vh = window.innerHeight * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    setVhHandler()
    window.addEventListener('resize', setVhHandler)
    
    // Allow natural scrolling on mobile for better UX
    if (window.innerWidth < 768) {
        document.body.style.overflow = 'auto'
    } else {
        document.body.style.overflow = 'hidden'
    }

    // Typing effect loop for name (restarts every 4s after completion)
    const startTypingLoop = () => {
        typedName.value = ''
        let i = 0
        const step = () => {
            if (i < fullName.length) {
                typedName.value += fullName.charAt(i)
                i++
                typingTimeout = window.setTimeout(step, 90)
            } else {
                restartTimeout = window.setTimeout(startTypingLoop, 4000)
            }
        }
        step()
    }
    startTypingLoop()
})

onBeforeUnmount(() => {
    // Re-enable scroll when leaving home
    document.body.style.overflow = ''
    if (setVhHandler) {
        window.removeEventListener('resize', setVhHandler)
    }
    if (typingTimeout) clearTimeout(typingTimeout)
    if (restartTimeout) clearTimeout(restartTimeout)
})
</script>

<template>
    <section class="home-hero flex flex-col items-center justify-center text-center w-full px-6 max-w-5xl mx-auto py-16 md:py-0 md:min-h-screen">
        <img
            src="@/assets/img/PixMeAlone.gif"
            alt="Profile"
            class="h-40 w-40"
        />
        <h1 class="mt-6 text-3xl font-semibold">
            <span>{{ typedName }}</span>
            <span class="ml-1 opacity-75 animate-pulse">|</span>
        </h1>
        <p class="mt-2" style="color: var(--color-text-secondary);">
            {{ currentExp?.title }} at
            <span style="color: var(--color-primary);" class="font-semibold">{{ currentExp?.company }}</span>
        </p>
        <p class="mt-3 mx-auto leading-relaxed" style="color: var(--color-text-tertiary);">
            Passionate about cybersecurity, networking, automation and technology in general.
            <br>
            Oh and I also like Cats! 
            <a 
                href="https://nukochannel.neocities.org" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Nuko cat by nukochannel"
                class="inline-block"
            >
                <img 
                    src="@/assets/img/nukoPeekAllSides.gif" 
                    alt="Nuko cat" 
                    class="inline-block h-6 w-6 ml-1 align-middle hover:opacity-80 transition-opacity"
                />
            </a>
        </p>
        <div class="mt-4 flex items-center space-x-4">
            <RouterLink
                to="/resume"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded transition-colors"
                style="border: 1px solid var(--color-border-primary); color: var(--color-text-secondary);"
            >
                Resume
            </RouterLink>
            <RouterLink
                to="/blog"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded transition-colors"
                style="border: 1px solid var(--color-border-primary); color: var(--color-text-secondary);"
            >
                <font-awesome-icon :icon="['fas', 'code']" class="text-sm"/>
                <span>Blog</span>
            </RouterLink>
        </div>
        <div class="mt-4">
            <SocialLinks />
        </div>
    </section>
</template>

<style scoped>
/* Better mobile viewport handling */
.home-hero {
    min-height: 100vh;
    min-height: calc(var(--vh, 1vh) * 100);
}

@media (max-width: 767px) {
    .home-hero {
        min-height: auto;
        /* Ensure content is centered with proper spacing on mobile */
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 6rem; /* Account for navbar */
        padding-bottom: 2rem;
        min-height: calc(100vh - 4rem); /* Subtract approximate footer height */
        min-height: calc(var(--vh, 1vh) * 100 - 4rem);
    }
}

/* Ensure proper text wrapping on small screens */
@media (max-width: 480px) {
    h1 {
        font-size: 1.5rem;
    }
    
    p {
        font-size: 0.875rem;
    }
}
</style>