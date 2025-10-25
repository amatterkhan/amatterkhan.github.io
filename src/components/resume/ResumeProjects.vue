<!-- ResumeProjects.vue -->
<script setup>
import { ref } from 'vue'
import projectsData from '@/data/projectsData.json'

const isProjectsOpen = ref(true)
</script>

<template>
    <section>
        <h3
            class="section-heading text-2xl font-bold mb-4 cursor-pointer flex justify-between items-center"
            @click="isProjectsOpen = !isProjectsOpen"
        >
            <span>Projects</span>
            <span v-if="isProjectsOpen">−</span>
            <span v-else>+</span>
        </h3>
        <div v-if="isProjectsOpen">
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <li
                    v-for="project in projectsData"
                    :key="project.id"
                    class="border border-terminal-green rounded-lg p-4"
                >
                    <h4 class="text-lg md:text-xl font-semibold mb-2 project-title">
                        {{ project.title }}
                    </h4>
                    <p class="project-description leading-relaxed">{{ project.description }}</p>

                    <!-- Display Links with Icons Only -->
                    <div v-if="project.links.length > 0" class="mt-2 flex">
                        <span
                            v-for="link in project.links"
                            :key="link.type"
                            class="mr-4 flex items-center"
                        >
                            <a
                                :href="link.url"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="project-link transition-colors"
                                :aria-label="`${link.type} Link`"
                            >
                                <font-awesome-icon
                                    :icon="[
                                        'fas',
                                        link.type === 'Code'
                                            ? 'code'
                                            : 'external-link-alt'
                                    ]"
                                    class="mr-1"
                                />
                            </a>
                        </span>
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

.project-title {
    color: var(--color-text-highlight);
}

.project-description {
    color: var(--color-text-content);
}

.project-link {
    color: var(--color-text-accent);
}

.project-link:hover {
    color: var(--color-text-highlight);
}

.cursor-pointer {
    cursor: pointer;
}
</style>
