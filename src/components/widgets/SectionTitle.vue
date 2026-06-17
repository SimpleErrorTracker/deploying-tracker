<template>
  <div :class="wrapperClass" class="relative mb-8 md:mb-12">
    <div
      v-if="showLine"
      class="absolute top-1/2 -left-4 h-8 w-1 -translate-y-1/2 rounded-full bg-blue-500 md:h-10"
      aria-hidden="true"
    />

    <component :is="tag" class="font-bebas-bold text-3xl md:text-4xl lg:text-5xl">
      <slot>{{ title }}</slot>
    </component>

    <p v-if="description || $slots.description" class="mt-3 text-sm text-gray-600 md:text-base">
      <slot name="description">
        {{ description }}
      </slot>
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  description?: string
  showLine?: boolean
  wrapperClass?: string
}

withDefaults(defineProps<Props>(), {
  tag: 'h2',
  showLine: true,
})
</script>
