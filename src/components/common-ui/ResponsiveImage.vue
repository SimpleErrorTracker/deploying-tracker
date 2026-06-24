<template>
  <picture>
    <!-- Mobile версия -->
    <source media="(max-width: 640px)" :srcset="imageSources.mobile" :type="format" />

    <!-- Tablet версия -->
    <source media="(max-width: 1024px)" :srcset="imageSources.tablet" :type="format" />

    <!-- Desktop версия -->
    <source media="(min-width: 1025px)" :srcset="imageSources.desktop" :type="format" />

    <!-- Fallback -->
    <img
      :src="desktopSrc"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      :class="className"
      decoding="async"
      @load="onLoad"
      @error="onError"
    />
  </picture>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import desktopImg from '@/assets/images/dashboard-preview-desktop.png'
import tabletImg from '@/assets/images/dashboard-preview-tablet.png'
import mobileImg from '@/assets/images/dashboard-preview-mobile.png'

const props = withDefaults(
  defineProps<{
    variant?: 'dashboard' | 'custom'
    desktopSrc?: string
    tabletSrc?: string
    mobileSrc?: string
    alt?: string
    width?: string | number
    height?: string | number
    className?: string
    loading?: 'lazy' | 'eager'
    format?: 'image/webp' | 'image/png' | 'image/jpeg'
  }>(),
  {
    variant: 'dashboard',
    alt: 'Изображение',
    width: '100%',
    height: 'auto',
    className: 'w-full h-auto',
    loading: 'lazy',
    format: 'image/png',
  },
)

const emit = defineEmits<{
  (e: 'load'): void
  (e: 'error'): void
}>()

// Определяем источники изображений в зависимости от варианта
const imageSources = computed(() => {
  // Если переданы кастомные пути, используем их
  if (props.desktopSrc) {
    return {
      desktop: props.desktopSrc,
      tablet: props.tabletSrc || props.desktopSrc,
      mobile: props.mobileSrc || props.tabletSrc || props.desktopSrc,
    }
  }

  // Иначе используем стандартные для дашборда
  return {
    desktop: desktopImg,
    tablet: tabletImg,
    mobile: mobileImg,
  }
})

const onLoad = () => {
  emit('load')
}

const onError = () => {
  console.error('❌ Failed to load image')
  emit('error')
}
</script>
