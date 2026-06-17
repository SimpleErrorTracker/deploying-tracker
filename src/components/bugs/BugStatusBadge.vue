<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
    :class="statusClass"
  >
    <component :is="icon" class="w-3 h-3" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Circle, Clock, CheckCircle } from 'lucide-vue-next'

const props = defineProps<{
  status: 'Open' | 'In Progress' | 'Done'
}>()

const statusConfig = {
  Open: {
    label: 'Открыт',
    class: 'bg-red-100 text-red-700',
    icon: Circle,
  },
  'In Progress': {
    label: 'В работе',
    class: 'bg-yellow-100 text-yellow-700',
    icon: Clock,
  },
  Done: {
    label: 'Готов',
    class: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
}

const label = computed(() => statusConfig[props.status].label)
const statusClass = computed(() => statusConfig[props.status].class)
const icon = computed(() => statusConfig[props.status].icon)
</script>
