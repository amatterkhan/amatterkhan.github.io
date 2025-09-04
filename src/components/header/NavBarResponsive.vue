<!-- NavBarResponsive.vue -->
<script setup>
import { RouterLink, useRoute } from 'vue-router';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import DarkModeToggle from '@/components/DarkModeToggle.vue';

const route = useRoute();
const isHome = computed(() => route.name === 'home');

const menuOpen = ref(false);
const isFixed = ref(false);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  
  // make header fixed after scrolling 50px
  isFixed.value = currentScrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header 
    :class="[
      'w-full z-50 pt-6 pb-2 md:pt-0 md:pb-0 transition-colors duration-200',
      isHome ? 'fixed left-0 right-0 top-0' : 'relative'
    ]"
    :style="!isHome ? { backgroundColor: 'var(--color-nav-bg)' } : {}"
  >
    <div class="max-w-5xl mx-auto w-full px-6 flex items-center justify-between">
      <!-- Show gif icon on non-home pages -->
      <div class="flex items-center">
        <img v-if="!isHome" src="@/assets/img/PixMeAlone.gif" alt="Pixel Me" class="h-8 w-8" />
      </div>
      <div class="flex items-center space-x-2" :class="{ 'ml-auto': isHome }">
        <DarkModeToggle />
        <button v-if="!isHome" class="md:hidden block" @click="toggleMenu" aria-label="Toggle navigation">
          <font-awesome-icon v-if="!menuOpen" :icon="['fas', 'ellipsis']" size="2x"/>
          <font-awesome-icon v-else :icon="['fas', 'xmark']" size="2x"/>
        </button>
      </div>
    </div>

    <!-- Fullscreen overlay menu on mobile -->
    <div 
      v-if="menuOpen" 
      class="fixed inset-0 z-40 flex items-center justify-center"
      style="background-color: var(--color-nav-bg);"
      @click.self="closeMenu"
    >
      <ul class="flex flex-col items-center space-y-6 text-lg">
        <li v-if="!isHome">
          <RouterLink to="/" class="hover:underline" style="color: var(--color-text-secondary);" @click="closeMenu">Home</RouterLink>
        </li>
        <li>
          <RouterLink to="/blog" class="hover:underline" style="color: var(--color-text-secondary);" @click="closeMenu">Blog</RouterLink>
        </li>
        <li>
          <RouterLink to="/resume" class="hover:underline" style="color: var(--color-text-secondary);" @click="closeMenu">Resume</RouterLink>
        </li>
      </ul>
    </div>

    <!-- Desktop navigation (hidden on mobile) -->
    <nav class="hidden md:block w-full mt-4 md:mt-2 max-w-5xl mx-auto px-6">
      <ul class="flex flex-row justify-end items-center space-x-4">
        <li v-if="!isHome">
          <RouterLink to="/" class="hover:underline" style="color: var(--color-text-secondary);">Home</RouterLink>
        </li>
        <li>
          <RouterLink to="/blog" class="hover:underline" style="color: var(--color-text-secondary);">Blog</RouterLink>
        </li>
        <li v-if="!isHome">
          <RouterLink to="/resume" class="hover:underline" style="color: var(--color-text-secondary);">Resume</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
  
  
</template>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>