<!-- BlogView.vue -->
<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import postsData from '@/data/postData.json'

const query = ref('')
const selectedCategory = ref('All')
const startDate = ref('') // YYYY-MM-DD
const endDate = ref('')   // YYYY-MM-DD
const showFilters = ref(false)
// Sort posts newest first for consistent ordering
const posts = ref([...postsData].sort((a, b) => new Date(b.date) - new Date(a.date)))

// Pin post via JSON field
const pinned = computed(() => posts.value.find(p => p.pinned))
const pinnedId = computed(() => pinned.value?.id)

// Show pinned only when no query or it matches the query
const pinnedMatchesQuery = computed(() => {
    const pin = pinned.value
    if (!pin) return false
    const qRaw = query.value.trim()
    // Category filter
    if (selectedCategory.value !== 'All' && !(pin.categories || []).includes(selectedCategory.value)) {
        return false
    }
    // Date range filter
    const pinDate = new Date(pin.date)
    if (startDate.value && pinDate < new Date(startDate.value)) return false
    if (endDate.value && pinDate > new Date(endDate.value)) return false

    if (!qRaw) return true
    const q = qRaw.toLowerCase()
    return (
        pin.title.toLowerCase().includes(q) ||
        (pin.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (pin.categories || []).some((c) => c.toLowerCase().includes(c))
    )
})

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    return posts.value.filter((p) => {
        // Category
        if (selectedCategory.value !== 'All' && !(p.categories || []).includes(selectedCategory.value)) {
            return false
        }
        // Date range
        const d = new Date(p.date)
        if (startDate.value && d < new Date(startDate.value)) return false
        if (endDate.value && d > new Date(endDate.value)) return false

        if (!q) return true
        return (
            p.title.toLowerCase().includes(q) ||
            (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
            (p.categories || []).some((c) => c.toLowerCase().includes(q))
        )
    })
})

// Pagination
const postsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(filtered.value.length / postsPerPage))

const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * postsPerPage
    const end = start + postsPerPage
    return filtered.value.slice(start, end)
})

// Reset to page 1 when filters change
watch([query, selectedCategory, startDate, endDate], () => {
    currentPage.value = 1
})

// Pagination display logic
const displayedPages = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const pages = []
    
    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push({ type: 'page', value: i })
        }
    } else {
        pages.push({ type: 'page', value: 1 })
        
        if (current > 4) {
            pages.push({ type: 'ellipsis' })
        }
        
        const start = Math.max(2, current - 1)
        const end = Math.min(total - 1, current + 1)
        
        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== total) {
                pages.push({ type: 'page', value: i })
            }
        }
        
        if (current < total - 3) {
            pages.push({ type: 'ellipsis' })
        }
        
        if (total > 1) {
            pages.push({ type: 'page', value: total })
        }
    }
    
    return pages
})

// Categories from posts
const categories = computed(() => {
    const set = new Set()
    posts.value.forEach((p) => (p.categories || []).forEach((c) => set.add(c)))
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
})
</script>

<template>
  <div class="terminal-page w-full h-full overflow-auto">
    <section class="mb-12 w-full px-6">
        <h2 class="text-2xl font-bold mb-4 text-terminal-green">Blog</h2>

        <div class="sticky top-0 z-10 py-2 bg-terminal-bg">
            <div class="flex items-center gap-2">
                <div class="relative flex-1 max-w-md">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-terminal-green text-sm">
                        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                    </span>
                    <input
                        v-model="query"
                        type="text"
                        placeholder="$ grep -i 'search term' posts/*"
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
                            <label class="block text-sm font-terminal text-terminal-green mb-2">Category</label>
                            <select v-model="selectedCategory" class="w-full border-2 border-terminal-green rounded-md px-3 py-2 text-sm bg-terminal-bg text-terminal-green font-terminal focus:outline-none focus:ring-2 focus:ring-terminal-cyan">
                                <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="block text-sm font-terminal text-terminal-green mb-2">Start date</label>
                            <input v-model="startDate" type="date" class="w-full border-2 border-terminal-green rounded-md px-3 py-2 text-sm bg-terminal-bg text-terminal-green font-terminal focus:outline-none focus:ring-2 focus:ring-terminal-cyan" />
                        </div>
                        <div>
                            <label class="block text-sm font-terminal text-terminal-green mb-2">End date</label>
                            <input v-model="endDate" type="date" class="w-full border-2 border-terminal-green rounded-md px-3 py-2 text-sm bg-terminal-bg text-terminal-green font-terminal focus:outline-none focus:ring-2 focus:ring-terminal-cyan" />
                        </div>
                    </div>
                </details>
            </div>
        </div>

        <!-- Mobile Filters Bottom Sheet -->
        <div v-if="showFilters" class="fixed inset-0 z-50 sm:hidden">
            <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showFilters = false"></div>
            <div class="absolute inset-x-0 bottom-0 bg-terminal-bg border-t-2 border-terminal-green rounded-t-2xl p-6 max-h-[80vh] overflow-auto filter-sheet">
                <h3 class="text-lg font-terminal text-terminal-green mb-4">Filter Posts</h3>
                <div class="mb-4">
                    <label class="block text-sm font-terminal text-terminal-green mb-2">Category</label>
                    <select v-model="selectedCategory" class="w-full border-2 border-terminal-green rounded-md px-3 py-2 text-sm bg-terminal-bg text-terminal-green font-terminal">
                        <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                    </select>
                </div>
                <div class="flex gap-3 mb-4">
                    <div class="flex-1 min-w-0">
                        <label class="block text-sm font-terminal text-terminal-green mb-2">Start date</label>
                        <input v-model="startDate" type="date" class="w-full border-2 border-terminal-green rounded-md px-3 py-2 text-sm bg-terminal-bg text-terminal-green font-terminal" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <label class="block text-sm font-terminal text-terminal-green mb-2">End date</label>
                        <input v-model="endDate" type="date" class="w-full border-2 border-terminal-green rounded-md px-3 py-2 text-sm bg-terminal-bg text-terminal-green font-terminal" />
                    </div>
                </div>
                <div class="mt-6 flex justify-end gap-3">
                    <button class="px-4 py-2 border-2 border-terminal-green rounded-md text-terminal-green hover:bg-terminal-green hover:text-terminal-bg transition-all duration-200 font-terminal" @click="() => { selectedCategory = 'All'; startDate = ''; endDate = '' }">Reset</button>
                    <button class="px-4 py-2 border-2 rounded-md bg-terminal-green text-terminal-bg hover:bg-terminal-cyan hover:border-terminal-cyan transition-all duration-200 font-terminal" @click="showFilters = false">Apply</button>
                </div>
            </div>
        </div>

        <div v-if="pinned && pinnedMatchesQuery && currentPage === 1" class="mb-6 p-5 rounded-lg border-2 border-terminal-yellow bg-terminal-bg-secondary hover:shadow-lg hover:shadow-terminal-yellow/20 transition-all duration-200">
            <div class="flex items-start justify-between gap-3 mb-2">
                <router-link :to="`/post/${pinned.id}`" class="font-semibold text-lg text-terminal-green hover:text-terminal-cyan transition-colors duration-200 font-terminal">
                    > {{ pinned.title }}
                </router-link>
                <div class="flex items-center gap-2 flex-shrink-0">
                    <font-awesome-icon :icon="['fas', 'thumbtack']" class="text-terminal-yellow text-sm rotate-45"/>
                    <span class="text-xs text-terminal-green font-terminal">{{ pinned.date }}</span>
                </div>
            </div>
            <p class="text-sm text-terminal-cyan mt-2 leading-relaxed" v-if="pinned.excerpt">{{ pinned.excerpt }}</p>
            <div class="flex flex-wrap gap-2 mt-3" v-if="pinned.categories?.length">
                <span v-for="cat in pinned.categories" :key="cat" class="px-2.5 py-1 text-xs bg-terminal-green/10 border border-terminal-green rounded-md text-terminal-green font-terminal">
                    {{ cat }}
                </span>
            </div>
        </div>

        <ul class="space-y-4">
            <li v-for="post in paginatedPosts" :key="post.id" class="p-5 rounded-lg border-2 border-terminal-green bg-terminal-bg-secondary hover:border-terminal-cyan hover:shadow-lg hover:shadow-terminal-green/10 transition-all duration-200">
                <div class="flex items-start justify-between gap-3 mb-2">
                    <router-link :to="`/post/${post.id}`" class="font-medium text-base text-terminal-green hover:text-terminal-cyan transition-colors duration-200 font-terminal">
                        > {{ post.title }}
                    </router-link>
                    <span class="text-xs text-terminal-green flex-shrink-0 font-terminal">{{ post.date }}</span>
                </div>
                <p class="text-sm text-terminal-cyan mt-2 line-clamp-2 leading-relaxed" v-if="post.excerpt">{{ post.excerpt }}</p>
                <div class="flex flex-wrap gap-2 mt-3" v-if="post.categories?.length">
                    <span v-for="cat in post.categories" :key="cat" class="px-2.5 py-1 text-xs bg-terminal-green/10 border border-terminal-green rounded-md text-terminal-green font-terminal">
                        {{ cat }}
                    </span>
                </div>
            </li>
        </ul>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-3 text-sm font-terminal">
            <button
                class="px-4 py-2 border-2 border-terminal-green rounded-md text-terminal-green disabled:opacity-40 disabled:cursor-not-allowed hover:bg-terminal-green hover:text-terminal-bg transition-all duration-200 disabled:hover:bg-transparent disabled:hover:text-terminal-green"
                :disabled="currentPage === 1"
                @click="currentPage = Math.max(1, currentPage - 1)"
            >← Prev</button>
            <div class="flex items-center gap-2">
                <template v-for="(item, idx) in displayedPages" :key="idx">
                    <button
                        v-if="item.type === 'page'"
                        class="w-10 h-10 flex items-center justify-center border-2 rounded-md transition-all duration-200"
                        :class="item.value === currentPage 
                            ? 'border-terminal-cyan bg-terminal-cyan text-terminal-bg font-bold' 
                            : 'border-terminal-green text-terminal-green hover:bg-terminal-green hover:text-terminal-bg'"
                        @click="currentPage = item.value"
                    >{{ item.value }}</button>
                    <span v-else class="px-2 text-terminal-green">…</span>
                </template>
            </div>
            <button
                class="px-4 py-2 border-2 border-terminal-green rounded-md text-terminal-green disabled:opacity-40 disabled:cursor-not-allowed hover:bg-terminal-green hover:text-terminal-bg transition-all duration-200 disabled:hover:bg-transparent disabled:hover:text-terminal-green"
                :disabled="currentPage === totalPages"
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
            >Next →</button>
        </div>
    </section>
  </div>
</template>