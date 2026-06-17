<template>
  <span
      class="inline-flex items-center gap-1 px-2 py-1 mx-0.5 font-bold rounded-lg transition-all"
      :class="badgeClass"
  >
    <span v-if="icon" class="text-xs">{{ icon }}</span>
    {{ value }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: number;
  color: 'blue' | 'red' | 'yellow' | 'green' | 'purple' | 'orange';
  icon?: string;
}>();

const badgeClass = computed(() => {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700'
  };
  return colors[props.color];
});
</script>