<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
    :class="priorityClass"
  >
    <component :is="icon" class="w-3 h-3" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown, Minus, ArrowUp, Skull } from 'lucide-vue-next'

const props = defineProps<{
  priority: 'low' | 'medium' | 'high' | 'critical'
}>()

const priorityConfig = {
  low: {
    label: 'Низкий',
    class: 'bg-green-100 text-green-700',
    icon: ArrowDown,
  },
  medium: {
    label: 'Средний',
    class: 'bg-yellow-100 text-yellow-700',
    icon: Minus,
  },
  high: {
    label: 'Высокий',
    class: 'bg-orange-100 text-orange-700',
    icon: ArrowUp,
  },
  critical: {
    label: 'Критический',
    class: 'bg-red-100 text-red-700',
    icon: Skull,
  },
}

const label = computed(() => priorityConfig[props.priority].label)
const priorityClass = computed(() => priorityConfig[props.priority].class)
const icon = computed(() => priorityConfig[props.priority].icon)
</script>
