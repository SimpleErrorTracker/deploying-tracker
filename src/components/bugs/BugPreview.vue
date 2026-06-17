<template>
  <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
    <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
      <Eye class="w-4 h-4" />
      Предпросмотр баг-репорта
    </h4>

    <div class="space-y-2 text-sm">
      <div class="flex items-start gap-2">
        <span class="font-medium text-gray-600 min-w-[80px]">Описание:</span>
        <p class="text-gray-700 flex-1">{{ bugData.description || '—' }}</p>
      </div>

      <div class="flex items-center gap-2">
        <span class="font-medium text-gray-600 min-w-[80px]">Категория:</span>
        <span :class="categoryBadgeClass" class="px-2 py-0.5 rounded-full text-xs">
          {{ categoryLabel }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <span class="font-medium text-gray-600 min-w-[80px]">Приоритет:</span>
        <span :class="priorityBadgeClass" class="px-2 py-0.5 rounded-full text-xs">
          {{ priorityLabel }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <span class="font-medium text-gray-600 min-w-[80px]">Статус:</span>
        <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">Open</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Eye } from 'lucide-vue-next'
import type { BugFormData } from '@/types/bug.types'

const props = defineProps<{
  bugData: BugFormData
}>()

const categoryLabel = computed(() => {
  const labels = {
    Authentication: 'Авторизация',
    DB: 'База данных',
    UI: 'Интерфейс',
    Network: 'Сеть',
  }
  return labels[props.bugData.category]
})

const categoryBadgeClass = computed(() => {
  const classes = {
    Authentication: 'bg-purple-100 text-purple-700',
    DB: 'bg-yellow-100 text-yellow-700',
    UI: 'bg-green-100 text-green-700',
    Network: 'bg-blue-100 text-blue-700',
  }
  return classes[props.bugData.category]
})

const priorityLabel = computed(() => {
  const labels = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    critical: 'Критический',
  }
  return labels[props.bugData.priority]
})

const priorityBadgeClass = computed(() => {
  const classes = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  }
  return classes[props.bugData.priority]
})
</script>
