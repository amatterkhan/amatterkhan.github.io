<script setup>
import { ref } from 'vue'
import educationData from '@/data/educationData.json'

const isEducationOpen = ref(true)
</script>

<template>
  <section>
    <h3
      class="section-heading text-2xl md:text-2xl font-bold mb-4 cursor-pointer flex justify-between items-center"
      @click="isEducationOpen = !isEducationOpen"
    >
      <span>Education</span>
      <span v-if="isEducationOpen">−</span>
      <span v-else>+</span>
    </h3>
    <div
      v-if="isEducationOpen"
    >
      <ul class="grid grid-cols-1 gap-4 text-terminal-green mb-4">
        <li v-for="(education, index) in educationData" :key="index" class="border border-terminal-green rounded-lg p-4">
          <h4 class="text-lg md:text-xl font-semibold mb-2">
            <a :href="education.degreeLink" target="_blank" rel="noopener noreferrer" class="degree-link transition-colors">
              {{ education.field }}
            </a>
          </h4>
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 education-details text-sm mb-2">
            <p>{{ education.degree }}</p>
            <span class="hidden sm:block separator">|</span>
            <p class="university-name">{{ education.university }}</p>
          </div>
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 education-details text-sm">
            <p>{{ education.classification }}</p>
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

.degree-link {
  color: var(--color-text-highlight);
}

.degree-link:hover {
  color: var(--color-text-accent);
}

.education-details {
  color: var(--color-text-content);
}

.university-name {
  color: var(--color-text-cyan);
}

.separator {
  color: var(--color-text-subtle);
}

.cursor-pointer {
  cursor: pointer;
}
</style>