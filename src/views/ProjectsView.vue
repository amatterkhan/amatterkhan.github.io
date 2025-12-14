<!-- ProjectsView.vue -->
<script setup>
import { ref, computed, watch } from 'vue'
import projectsData from '@/data/projectsData.json'

const query = ref('')
const selectedCategory = ref('All')
const showFeaturedOnly = ref(false)
const showFilters = ref(false)
// Sort projects: featured first, then by date (newest first)
const projects = ref([...projectsData].sort((a, b) => {
    // Featured projects first
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    // Then sort by date (newest first)
    const dateA = new Date(a.date || '1970-01-01')
    const dateB = new Date(b.date || '1970-01-01')
    return dateB - dateA
}))

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return projects.value.filter((p) => {
        // Featured filter
        if (showFeaturedOnly.value && !p.featured) {
            return false
        }
        
        // Category filter
        if (selectedCategory.value !== 'All' && !(p.categories || []).includes(selectedCategory.value)) {
            return false
        }

        if (!q) return true
        return (
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
            (p.categories || []).some((c) => c.toLowerCase().includes(q))
        )
    })
})

// Categories from projects
const categories = computed(() => {
    const set = new Set()
    projects.value.forEach((p) => (p.categories || []).forEach((c) => set.add(c)))
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
})
</script>

<template>
  <div class="terminal-page w-full h-full overflow-auto">
    <section class="mb-12 w-full px-6">
        <h2 class="text-2xl font-bold mb-4 text-terminal-green font-terminal">> Projects</h2>

        <div class="sticky top-0 z-10 py-2 bg-terminal-bg">
            <div class="flex items-center gap-2">
                <div class="relative flex-1 max-w-md">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-green text-sm">
                        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                    </span>
                    <input
                        v-model="query"
                        type="text"
                        placeholder="$ grep -i 'search term' projects/*"
                        class="w-full border-2 border-terminal-green rounded-md pl-10 pr-4 py-2.5 bg-terminal-bg focus:outline-none focus:ring-2 focus:ring-terminal-cyan focus:border-terminal-cyan text-terminal-green placeholder-terminal-green/40 font-terminal text-sm transition-all duration-200"
                    />
                </div>
                <!-- Mobile Filter Trigger -->
                <button class="sm:hidden p-2.5 border-2 border-terminal-green rounded-md text-sm text-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-all duration-200" @click="showFilters = true" aria-label="Open filters">
                    <font-awesome-icon :icon="['fas', 'filter']" />
                </button>
                <!-- Desktop Filters Dropdown -->
                <details class="relative hidden sm:block">
                    <summary class="list-none cursor-pointer p-2.5 border-2 border-terminal-green rounded-md text-sm text-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-all duration-200 flex items-center gap-2" aria-label="Open filters">
                        <font-awesome-icon :icon="['fas', 'filter']" />
                        <span>Filters</span>
                    </summary>
                    <div class="absolute right-0 mt-2 p-4 bg-terminal-bg border-2 border-terminal-green rounded-md shadow-lg shadow-terminal-green/20 z-20 w-80">
                        <div class="mb-3">
                            <label class="flex items-center gap-2 mb-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    v-model="showFeaturedOnly"
                                    class="w-4 h-4 border-terminal-green bg-terminal-bg text-terminal-green focus:ring-terminal-cyan focus:ring-2 rounded"
                                />
                                <span class="text-sm font-terminal text-terminal-green">Show Featured Only</span>
                            </label>
                        </div>
                        <div class="mb-3">
                            <label class="block text-sm font-terminal text-terminal-green mb-2">Category</label>
                            <select v-model="selectedCategory" class="w-full border-2 border-terminal-green rounded-md px-3 py-2 text-sm bg-terminal-bg text-terminal-green font-terminal focus:outline-none focus:ring-2 focus:ring-terminal-cyan">
                                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                            </select>
                        </div>
                    </div>
                </details>
            </div>
        </div>

        <!-- Mobile Filters Bottom Sheet -->
        <div v-if="showFilters" class="fixed inset-0 z-50 sm:hidden">
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showFilters = false"></div>
            <div class="absolute inset-x-0 bottom-0 bg-terminal-bg border-t-2 border-terminal-green rounded-t-2xl p-6 max-h-[80vh] overflow-auto filter-sheet">
                <h3 class="text-lg font-terminal text-terminal-green mb-4">Filter Projects</h3>
                <div class="mb-4">
                    <label class="flex items-center gap-2 mb-3 cursor-pointer">
                        <input
                            type="checkbox"
                            v-model="showFeaturedOnly"
                            class="w-4 h-4 border-terminal-green bg-terminal-bg text-terminal-green focus:ring-terminal-cyan focus:ring-2 rounded"
                        />
                        <span class="text-sm font-terminal text-terminal-green">Show Featured Only</span>
                    </label>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-terminal text-terminal-green mb-2">Category</label>
                    <select v-model="selectedCategory" class="w-full border-2 border-terminal-green rounded-md px-3 py-2 text-sm bg-terminal-bg text-terminal-green font-terminal">
                        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                    </select>
                </div>
                <div class="mt-6 flex justify-end gap-3">
                    <button class="px-4 py-2 border-2 border-terminal-green rounded-md text-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-all duration-200 font-terminal" @click="() => { selectedCategory = 'All'; showFeaturedOnly = false }">Reset</button>
                    <button class="px-4 py-2 border-2 rounded-md bg-terminal-green text-terminal-bg hover:bg-terminal-cyan hover:border-terminal-cyan transition-all duration-200 font-terminal" @click="showFilters = false">Apply</button>
                </div>
            </div>
        </div>

        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <li
                v-for="project in filtered"
                :key="project.id"
                class="border border-terminal-green rounded-lg p-6 hover:border-terminal-cyan transition-all duration-200 project-card"
            >
                <div class="flex items-start justify-between gap-3 mb-3">
                    <h3 class="text-xl md:text-2xl font-semibold project-title flex-1">
                        <router-link 
                            v-if="project.hasWriteup"
                            :to="`/project/${project.id}`"
                            class="hover:text-terminal-cyan transition-colors duration-200 flex items-center gap-2"
                        >
                            <span v-if="project.featured" class="text-terminal-yellow" title="Featured Project">
                                <font-awesome-icon :icon="['fas', 'star']" class="text-xs" />
                            </span>
                            <span>{{ project.title }}</span>
                        </router-link>
                        <span v-else class="flex items-center gap-2">
                            <span v-if="project.featured" class="text-terminal-yellow" title="Featured Project">
                                <font-awesome-icon :icon="['fas', 'star']" class="text-xs" />
                            </span>
                            <span>{{ project.title }}</span>
                        </span>
                    </h3>
                    <span v-if="project.date" class="text-xs text-terminal-green flex-shrink-0 font-terminal">{{ project.date }}</span>
                </div>
                
                <p class="project-description leading-relaxed mb-4">{{ project.description }}</p>

                <!-- Categories -->
                <div v-if="project.categories?.length" class="flex flex-wrap gap-2 mb-4">
                    <span
                        v-for="cat in project.categories"
                        :key="cat"
                        class="px-2.5 py-1 text-xs bg-terminal-green/10 border border-terminal-green rounded-md text-terminal-green font-terminal"
                    >
                        {{ cat }}
                    </span>
                </div>

                <!-- Tags -->
                <div v-if="project.tags?.length" class="flex flex-wrap gap-2 mb-4">
                    <span
                        v-for="tag in project.tags"
                        :key="tag"
                        class="text-terminal-cyan font-terminal text-xs"
                    >
                        #{{ tag }}
                    </span>
                </div>

                <!-- Display Links -->
                <div v-if="project.links && project.links.length > 0 && project.links[0].url" class="mt-4 flex gap-4 flex-wrap">
                    <a
                        v-for="link in project.links.filter(l => l.url)"
                        :key="link.type"
                        :href="link.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="project-link inline-flex items-center gap-2 px-3 py-2 border border-terminal-green rounded hover:bg-terminal-green hover:text-terminal-bg transition-all duration-200"
                        :aria-label="`${link.type || 'View'} Link`"
                    >
                        <font-awesome-icon
                            :icon="[
                                'fas',
                                link.type === 'Code'
                                    ? 'code'
                                    : link.type === 'Live'
                                    ? 'external-link-alt'
                                    : 'link'
                            ]"
                        />
                        <span class="text-sm font-terminal">{{ link.type || 'View' }}</span>
                    </a>
                    <router-link
                        v-if="project.hasWriteup"
                        :to="`/project/${project.id}`"
                        class="project-link inline-flex items-center gap-2 px-3 py-2 border border-terminal-green rounded hover:bg-terminal-green hover:text-terminal-bg transition-all duration-200"
                    >
                        <font-awesome-icon :icon="['fas', 'file-lines']" />
                        <span class="text-sm font-terminal">Writeup</span>
                    </router-link>
                </div>
            </li>
        </ul>

        <!-- No results message -->
        <div v-if="filtered.length === 0" class="mt-8 p-6 border-2 border-terminal-green rounded-lg text-center">
            <p class="text-terminal-green font-terminal">No projects found matching your search criteria.</p>
        </div>
    </section>
  </div>
</template>

<style scoped>
.terminal-page {
  font-family: 'JetBrains Mono', 'Share Tech Mono', 'Courier New', monospace;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.project-card {
  background: var(--color-bg-secondary);
  transition: all 0.2s ease;
}

.project-card:hover {
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.2);
  transform: translateY(-2px);
}

.project-title {
  color: var(--color-text-highlight);
}

.project-description {
  color: var(--color-text-content);
}

.project-link {
  color: var(--color-text-primary);
  text-decoration: none;
  font-family: 'JetBrains Mono', monospace;
}

.project-link:hover {
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}
</style>
