<script setup>
import { useRoute } from 'vue-router'
import TerminalLayout from '@/components/TerminalLayout.vue'

const route = useRoute()
</script>

<template>
  <router-view v-if="route.meta?.bare" />
  <TerminalLayout v-else />
</template>
