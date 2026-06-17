<template>
  <li class="flex items-start gap-3 bg-white bg-opacity-60 p-3 rounded-lg transition-all hover:bg-opacity-80 hover:shadow-sm">
    <div class="bg-gradient-to-br from-green-500 to-green-600 text-white p-1 rounded-full mt-0.5 shadow-sm flex-shrink-0">
      <Check class="w-3 h-3" />
    </div>
    <span class="text-gray-700 leading-relaxed">
      {{ text }}
      <strong
          v-if="highlight"
          class="font-bold mx-1"
          :class="highlightClass"
      >
        {{ highlight }}
      </strong>
    </span>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Check } from 'lucide-vue-next';

const props = defineProps<{
  text: string;
  highlight: string;
  highlightColor?: 'red' | 'orange' | 'purple' | 'green' | 'blue';
}>();

const highlightClass = computed(() => {
  const colors = {
    red: 'text-red-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    blue: 'text-blue-600'
  };
  return props.highlightColor ? colors[props.highlightColor] : 'text-gray-900';
});
</script>