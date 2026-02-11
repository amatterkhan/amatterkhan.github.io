<script setup>
import { ref, computed } from 'vue'
import skillsData from '@/data/skillsData.json'

const isAboutOpen = ref(true)

const skills = computed(() =>
    skillsData.map((s) => {
        const idx = s.name.indexOf(':')
        if (idx > -1) {
            return {
                id: s.id,
                label: s.name.slice(0, idx).trim(),
                detail: s.name.slice(idx + 1).trim()
            }
        }
        return { id: s.id, label: s.name, detail: '' }
    })
)
</script>

<template>
    <!-- Intro & Contact Section -->
    <section class="mb-12 rounded-lg py-8 px-4">
        <h2 class="text-3xl font-bold mb-4 text-center">
            <span class="text-terminal-green" style="letter-spacing: 0.1em"
                >MOHAMMAD ASAD </span
            ><span class="text-terminal-cyan" style="letter-spacing: 0.1em"
                >ATTERKHAN</span
            >
        </h2>
        <!-- contacts -->
        <div
            class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 text-sm"
        >
            <p>
                <a
                    href="mailto:contact@asad.atterkhan.com"
                    class="contact-link flex items-center group"
                >
                    <font-awesome-icon
                        :icon="['fas', 'envelope']"
                        class="contact-icon mr-2"
                    />
                    contact@asad.atterkhan.com</a
                >
            </p>
            <p class="flex items-center">
                <a
                    href="https://linkedin.com/in/amatterkhan"
                    class="contact-link flex items-center group"
                >
                    <font-awesome-icon
                        :icon="['fab', 'linkedin']"
                        class="contact-icon mr-2"
                    />
                    LinkedIn
                </a>
            </p>
            <p class="flex items-center">
                <a
                    href="https://github.com/amatterkhan"
                    target="_blank"
                    class="contact-link flex items-center group"
                >
                    <font-awesome-icon
                        :icon="['fab', 'github']"
                        class="contact-icon mr-2"
                    />
                    GitHub
                </a>
            </p>
        </div>
    </section>

    <!-- About Section -->
    <section class="mb-4">
        <h3
            class="section-heading text-2xl font-bold mb-4 cursor-pointer flex justify-between items-center"
            @click="isAboutOpen = !isAboutOpen"
        >
            <span>About Me</span>
            <span v-if="isAboutOpen">−</span>
            <span v-else>+</span>
        </h3>
        <div v-if="isAboutOpen" class="section-content space-y-2">
            <p class="text-terminal-content leading-relaxed">
                IT and security professional with experience across IT support, systems administration, and security
                operations, currently working in a SecOps role. Holds a BSc (Hons) in Computer Science (Systems
                Engineering) and is pursuing a Master's in Computer Science at Georgia Institute of Technology. Strong
                background in Windows and Linux environments, identity and access management, and enterprise IT
                operations, with a growing focus on cloud and security engineering.
            </p>
            <ul class="list-disc pl-5 space-y-1 marker-highlight">
                <li v-for="s in skills" :key="s.id" class="text-terminal-content">
                    <strong class="text-terminal-highlight">{{ s.label }}:</strong>
                    <span v-if="s.detail"> {{ s.detail }}</span>
                </li>
            </ul>

        </div>
    </section>
</template>

<style scoped>
.contact-icon {
    transform: scale(1.2);
    transition: color 0.2s ease;
    color: inherit;
}

.cursor-pointer {
    cursor: pointer;
}

.contact-link {
    color: var(--color-text-tertiary);
    transition: color 0.2s ease;
}

.contact-link:hover {
    color: var(--color-link-hover);
}

.section-heading {
    color: var(--color-text-primary);
}

.section-content {
    color: var(--color-text-content);
}

.section-content strong {
    color: var(--color-text-highlight);
}

.marker-highlight :deep(li::marker) {
    color: var(--color-text-highlight);
}
</style>
