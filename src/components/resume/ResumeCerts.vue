<script setup>
import { ref, computed } from 'vue'
import certsData from '@/data/certsData.json'

const isCertsOpen = ref(true)
const sortedCerts = computed(() => [...certsData].sort((a, b) => b.id - a.id))
</script>

<template>
    <section class="mb-4">
        <h3
            class="section-heading text-2xl font-bold mb-4 cursor-pointer flex justify-between items-center"
            @click="isCertsOpen = !isCertsOpen"
        >
            <span>Certifications</span>
            <span v-if="isCertsOpen">−</span>
            <span v-else>+</span>
        </h3>
        <div v-if="isCertsOpen">
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <li
                    v-for="cert in sortedCerts"
                    :key="cert.id"
                    class="border border-terminal-green rounded-lg p-4"
                >
                    <h4 class="text-lg md:text-xl font-semibold mb-2">
                        <a
                            :href="cert.link"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="cert-link transition-colors"
                        >
                            {{ cert.title }}
                        </a>
                    </h4>
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 cert-issuer text-sm mb-2">
                        <p>{{ cert.issuer }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>

<style scoped>
.section-heading {
    color: var(--color-text-primary);
}

.cert-link {
    color: var(--color-text-secondary);
}

.cert-link:hover {
    color: var(--color-text-cyan);
}

.cert-issuer {
    color: var(--color-text-tertiary);
}

.cursor-pointer {
    cursor: pointer;
}
</style>
