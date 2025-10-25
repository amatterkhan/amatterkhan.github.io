<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import posts from '@/data/postData.json'

const route = useRoute()
const postId = route.params.id

const post = posts.find((p) => p.id === postId)

const html = ref('')

onMounted(() => {
    const fetchPostContent = async () => {
        try {
            const response = await fetch(`/data/posts/${postId}.html`)
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const text = await response.text()
            html.value = text
        } catch (error) {
            html.value = '<h1>Error</h1><p>Failed to load the post content.</p>'
            console.error('Failed to fetch post content:', error)
        }
    }

    fetchPostContent()
})
</script>

<template>
    <div class="post-content mx-auto max-w-4xl w-full px-6 py-4">
        <div class="mb-6 flex items-center justify-between flex-wrap gap-3">
            <router-link to="/blog" class="text-sm text-terminal-cyan hover:text-terminal-green hover:underline font-terminal flex items-center gap-2 transition-colors duration-200">
                <font-awesome-icon :icon="['fas', 'arrow-left']" />
                <span>cd ../blog</span>
            </router-link>
            <span class="text-sm text-terminal-green font-terminal">
                <font-awesome-icon :icon="['fas', 'calendar-days']" class="mr-2"/> 
                {{ post.date }}
            </span>
        </div>

        <article class="prose prose-terminal max-w-none">
            <!-- Categories -->
            <div class="flex flex-wrap gap-2 mb-4">
                <span
                    v-for="category in post.categories"
                    :key="category"
                    class="inline-block bg-terminal-green/10 border border-terminal-green text-terminal-green rounded-md px-3 py-1 text-xs font-terminal"
                >{{ category }}</span>
            </div>
            
            <!-- Post Content -->
            <div class="post-html-content" v-html="html"></div>
            
            <!-- Tags -->
            <div class="mt-8 pt-6 border-t-2 border-terminal-green/30">
                <div class="flex flex-wrap gap-3">
                    <span v-for="tag in post.tags" :key="tag" class="text-terminal-cyan font-terminal text-sm">
                        #{{ tag }}
                    </span>
                </div>
            </div>
        </article>
    </div>
</template>

<style scoped>
.post-content {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
}

/* Terminal-themed prose styling */
.prose {
    color: var(--color-text-primary);
    font-size: 1rem;
    line-height: 1.75;
}

/* Headings */
.prose :deep(h1) {
    color: var(--color-text-primary);
    font-weight: 700;
    font-size: 2.25rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid var(--color-border-primary);
    padding-bottom: 0.5rem;
}

.prose :deep(h2) {
    color: var(--color-text-cyan);
    font-weight: 600;
    font-size: 1.75rem;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
}

.prose :deep(h3) {
    color: var(--color-text-primary);
    font-weight: 600;
    font-size: 1.5rem;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
}

.prose :deep(h4),
.prose :deep(h5),
.prose :deep(h6) {
    color: var(--color-text-cyan);
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
}

/* Paragraphs */
.prose :deep(p) {
    margin-top: 1rem;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
}

/* Links */
.prose :deep(a) {
    color: var(--color-text-cyan);
    text-decoration: underline;
    transition: color 0.3s;
}

.prose :deep(a:hover) {
    color: var(--color-text-primary);
}

/* Inline code */
.prose :deep(code) {
    background-color: var(--color-bg-secondary);
    color: var(--color-text-cyan);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9em;
    border: 1px solid var(--color-border-primary);
}

/* Code blocks */
.prose :deep(pre) {
    background-color: var(--color-bg-secondary);
    border: 2px solid var(--color-border-primary);
    border-radius: 8px;
    padding: 1.25rem;
    overflow-x: auto;
    margin: 1.5rem 0;
}

.prose :deep(pre code) {
    background-color: transparent;
    color: var(--color-text-primary);
    padding: 0;
    border: none;
    font-size: 0.875rem;
    line-height: 1.5;
}

/* Blockquotes */
.prose :deep(blockquote) {
    border-left: 4px solid var(--color-border-primary);
    padding-left: 1.25rem;
    margin: 1.5rem 0;
    color: var(--color-text-cyan);
    font-style: italic;
    background-color: var(--color-bg-secondary);
    padding: 1rem 1.25rem;
    border-radius: 4px;
}

/* Lists */
.prose :deep(ul),
.prose :deep(ol) {
    margin: 1rem 0;
    padding-left: 2rem;
    color: var(--color-text-primary);
}

.prose :deep(ul) {
    list-style-type: disc;
}

.prose :deep(ol) {
    list-style-type: decimal;
}

.prose :deep(li) {
    margin: 0.5rem 0;
}

.prose :deep(li::marker) {
    color: var(--color-text-cyan);
}

/* Images */
.prose :deep(img) {
    max-width: 100%;
    border-radius: 8px;
    margin: 1.5rem 0;
    border: 2px solid var(--color-border-primary);
}

/* Tables */
.prose :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    border: 2px solid var(--color-border-primary);
}

.prose :deep(th),
.prose :deep(td) {
    border: 1px solid var(--color-border-primary);
    padding: 0.75rem 1rem;
    text-align: left;
}

.prose :deep(th) {
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
    font-weight: 600;
}

.prose :deep(td) {
    color: var(--color-text-primary);
}

.prose :deep(tr:nth-child(even)) {
    background-color: var(--color-bg-secondary);
}

/* Horizontal rule */
.prose :deep(hr) {
    border: none;
    border-top: 2px solid var(--color-border-primary);
    margin: 2rem 0;
}

/* Strong/Bold */
.prose :deep(strong),
.prose :deep(b) {
    color: var(--color-text-primary);
    font-weight: 700;
}

/* Emphasis/Italic */
.prose :deep(em),
.prose :deep(i) {
    color: var(--color-text-cyan);
    font-style: italic;
}
</style>
