<template>
  <div class="space-y-2">
    <label class="block text-sm font-semibold text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <slot />
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  required?: boolean
  error?: string
}>()
</script>
