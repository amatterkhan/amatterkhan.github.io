<script setup>
import SocialLinks from '@/components/SocialLinks.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const currentYear = new Date().getFullYear();
const route = useRoute();
const isHome = computed(() => route.name === 'home');
</script>

<template>
  <footer :class="['py-4 transition-colors duration-200', isHome ? 'fixed bottom-0 left-0 right-0 backdrop-blur-sm' : '']" style="color: var(--color-text-secondary);">
    <div v-if="isHome" id="home-footer" class="max-w-5xl mx-auto w-full px-6 text-center text-sm">
      © 2025 Mohammad Asad Atterkhan
    </div>
    <div v-else class="max-w-5xl mx-auto w-full px-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
      <p class="mb-2 md:mb-0 text-center md:text-left">
        &copy; {{ currentYear }} Mohammad Asad Atterkhan
      </p>
      <div class="flex justify-center md:justify-end mt-2 md:mt-0">
        <SocialLinks />
      </div>
    </div>
  </footer>
</template>