<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBarLarge from '@/components/header/NavBarLarge.vue';
import NavBarResponsive from '@/components/header/NavBarResponsive.vue';

const route = useRoute();
const isHome = computed(() => route.name === 'home');
const isMobile = ref(false);

function handleResize() {
  isMobile.value = window.innerWidth < 768;
}

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
const hideOnMobileHome = computed(() => isMobile.value && isHome.value);
</script>

<template>
  <component :is="isMobile ? NavBarResponsive : NavBarLarge" />
</template>