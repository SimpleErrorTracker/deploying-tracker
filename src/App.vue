<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { Loader2 } from 'lucide-vue-next'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initAuth()
})
</script>

<template>
  <router-view v-if="authStore.isInitialized" />
  <div v-else class="min-h-screen flex items-center justify-center">
    <Loader2 class="w-8 h-8 animate-spin text-blue-600" />
  </div>
</template>
