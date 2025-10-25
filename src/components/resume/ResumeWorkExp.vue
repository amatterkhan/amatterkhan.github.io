<script setup>
import { ref, computed } from 'vue'
import workExpData from '@/data/workExpData.json'

const isWorkExpOpen = ref(true)
const bullet = '•'

// Map for looking up prior role details when a promotion exists
const idToExp = computed(() => {
    const map = {}
    for (const exp of workExpData) map[exp.id] = exp
    return map
})

// Determine which items should be rendered (group promotions under one container)
const promotionTargets = computed(() => {
    const set = new Set()
    for (const exp of workExpData) if (exp.promotionFrom) set.add(exp.promotionFrom)
    return set
})

const displayedExperiences = computed(() => {
    const filtered = workExpData.filter(
        (exp) => exp.promotionFrom || !promotionTargets.value.has(exp.id)
    )
    return [...filtered].sort((a, b) => b.id - a.id)
})
</script>

<template>
    <section>
        <h3
            class="section-heading text-2xl md:text-2xl font-bold mb-4 cursor-pointer flex justify-between items-center"
            @click="isWorkExpOpen = !isWorkExpOpen"
        >
            <span>Experience</span>
            <span v-if="isWorkExpOpen">−</span>
            <span v-else>+</span>
        </h3>
        <div
            v-if="isWorkExpOpen"
        >
            <ul class="grid grid-cols-1 gap-4 text-terminal-green mb-4">
                <li
                    v-for="exp in displayedExperiences"
                    :key="exp.id"
                    class="border border-terminal-green rounded-lg p-4"
                >
                    <!-- Combined container if this experience is a promotion from a prior role -->
                    <template v-if="exp.promotionFrom">
                        <div class="mb-2">
                            <h4 class="text-lg md:text-xl font-semibold company-name">{{ exp.company }}</h4>
                        </div>
                        <div class="grid grid-cols-[16px_1fr] gap-x-4">
                            <!-- Timeline + node for current role -->
                            <div class="relative">
                                <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px timeline-line"></div>
                                <span class="absolute left-1/2 -translate-x-1/2 top-1.5 h-3 w-3 rounded-full timeline-node"></span>
                            </div>
                            <!-- Current role content -->
                            <div>
                                <div class="font-medium role-title">{{ exp.title }}</div>
                                <div class="text-xs date-range">{{ exp.dateRange }}</div>
                                <ul class="text-sm responsibility-list list-none ml-4 mt-2">
                                    <li v-for="(responsibility, index) in exp.responsibilities" :key="index" class="flex items-start">
                                        <span class="bullet mr-2">{{ bullet }}</span>
                                        <span>{{ responsibility }}</span>
                                    </li>
                                </ul>
                            </div>
                            <!-- Timeline + node for previous role -->
                            <div class="relative">
                                <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px timeline-line"></div>
                                <span class="absolute left-1/2 -translate-x-1/2 top-1.5 h-3 w-3 rounded-full timeline-node opacity-60"></span>
                            </div>
                            <!-- Previous role content -->
                            <div>
                                <div class="font-medium role-title">{{ idToExp[exp.promotionFrom]?.title }}</div>
                                <div class="text-xs date-range">{{ idToExp[exp.promotionFrom]?.dateRange }}</div>
                                <ul class="text-sm responsibility-list list-none ml-4 mt-2">
                                    <li v-for="(responsibility, index) in idToExp[exp.promotionFrom]?.responsibilities || []" :key="index" class="flex items-start">
                                        <span class="bullet mr-2">{{ bullet }}</span>
                                        <span>{{ responsibility }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </template>
                    
                    <!-- Single role container if not part of a promotion pair -->
                    <template v-else>
                        <h4 class="text-lg md:text-xl font-semibold mb-1 company-name">{{ exp.company }}</h4>
                        <div class="font-medium role-title">{{ exp.title }}</div>
                        <div class="text-xs date-range">{{ exp.dateRange }}</div>
                        <ul class="text-sm responsibility-list list-none ml-4 mt-2">
                            <li v-for="(responsibility, index) in exp.responsibilities" :key="index" class="flex items-start">
                                <span class="bullet mr-2">{{ bullet }}</span>
                                <span>{{ responsibility }}</span>
                            </li>
                        </ul>
                    </template>
                </li>
            </ul>
        </div>
    </section>
</template>

<style scoped>
.section-heading {
    color: var(--color-text-primary);
}

.company-name {
    color: var(--color-text-highlight);
}

.role-title {
    color: var(--color-text-accent);
}

.date-range {
    color: var(--color-text-subtle);
}

.responsibility-list {
    color: var(--color-text-content);
}

.bullet {
    color: var(--color-text-accent);
    font-size: 1rem;
}

.timeline-line {
    background-color: var(--color-border-muted);
}

.timeline-node {
    background-color: var(--color-text-accent);
}

.cursor-pointer {
    cursor: pointer;
}
</style>