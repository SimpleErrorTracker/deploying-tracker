<template>
  <div class="mt-20 relative">
    <div class="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent blur-3xl"></div>

    <div
      class="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 transition-all hover:shadow-3xl hover:scale-[1.01] duration-500"
    >
      <div
        class="bg-gray-100/80 backdrop-blur-sm px-4 py-3 flex items-center gap-2 border-b border-gray-200"
      >
        <div class="flex gap-1.5">
          <div class="w-3 h-3 rounded-full bg-red-500"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div class="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div class="flex-1 text-center">
          <span class="text-xs text-gray-500 font-mono bg-white/50 px-3 py-1 rounded-full">
            ErrorTracker Dashboard
          </span>
        </div>
        <div class="w-16"></div>
      </div>

      <div class="relative">
        <ResponsiveImage
          desktop-src="dashboard-preview-desktop.webp"
          tablet-src="dashboard-preview-tablet.webp"
          mobile-src="dashboard-preview-mobile.webp"
          alt="Dashboard Preview"
          class-name="w-full h-auto"
          loading="lazy"
          format="image/webp"
          @load="onImageLoad"
        />

        <!-- Скелетон загрузки -->
        <div
          v-if="!isLoaded"
          class="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
        >
          <div class="absolute inset-0 flex items-center justify-center">
            <Loader2 class="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import ResponsiveImage from '@/components/common-ui/ResponsiveImage.vue'

const isLoaded = ref(false)

const onImageLoad = () => {
  isLoaded.value = true
}
</script>

<style scoped>
.hover\:shadow-3xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>
