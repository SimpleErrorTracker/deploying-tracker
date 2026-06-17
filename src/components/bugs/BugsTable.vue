<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              v-for="column in columns"
              :key="column.id"
              @click="
                column.enableSorting &&
                handleSort(column.id, column.id === sortBy.id ? !sortBy.desc : false)
              "
              class="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
              :class="{ 'cursor-pointer': column.enableSorting }"
            >
              <div class="flex items-center gap-2">
                {{ column.header }}
                <span v-if="column.enableSorting && sortBy.id === column.id" class="inline-block">
                  <ArrowUp v-if="!sortBy.desc" class="w-4 h-4" />
                  <ArrowDown v-else class="w-4 h-4" />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="bug in bugs"
            :key="bug.id"
            class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-sm text-gray-500 font-mono">#{{ bug.id }}</td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900 max-w-md">
                {{
                  bug.description.length > 100
                    ? bug.description.substring(0, 100) + '...'
                    : bug.description
                }}
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                :class="categoryClass(bug.category)"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ bug.category }}
              </span>
            </td>
            <td class="px-6 py-4">
              <BugPriorityBadge :priority="bug.priority" />
            </td>
            <td class="px-6 py-4">
              <BugStatusBadge :status="bug.status" />
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">
              {{ bug.author_name }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(bug.created_at) }}
            </td>
          </tr>
          <tr v-if="bugs.length === 0">
            <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500">
              <div class="flex flex-col items-center gap-2">
                <BugOff class="w-12 h-12 text-gray-400" />
                <p>Баги не найдены</p>
                <p class="text-sm">Попробуйте изменить параметры фильтрации</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer с информацией -->
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Всего: <span class="font-semibold">{{ bugs.length }}</span> багов
      </div>
      <div class="flex gap-4 text-xs text-gray-500">
        <span>🔴 Открытых: {{ getStatusCount('Open') }}</span>
        <span>🟡 В работе: {{ getStatusCount('In Progress') }}</span>
        <span>🟢 Готовых: {{ getStatusCount('Done') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUp, ArrowDown, BugOff } from 'lucide-vue-next'
import BugPriorityBadge from './BugPriorityBadge.vue'
import BugStatusBadge from './BugStatusBadge.vue'
import type { Bug } from '@/types/bug.types'

const props = defineProps<{
  bugs: Bug[]
  sortBy: { id: string; desc: boolean }
}>()

const emit = defineEmits<{
  (e: 'sort', id: string, desc: boolean): void
}>()

const columns = [
  { id: 'id', header: 'ID', enableSorting: true },
  { id: 'description', header: 'Описание', enableSorting: true },
  { id: 'category', header: 'Категория', enableSorting: true },
  { id: 'priority', header: 'Приоритет', enableSorting: true },
  { id: 'status', header: 'Статус', enableSorting: true },
  { id: 'author_name', header: 'Автор', enableSorting: true },
  { id: 'created_at', header: 'Дата создания', enableSorting: true },
]

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const categoryClass = (category: string) => {
  const classes = {
    Authentication: 'bg-purple-100 text-purple-700',
    DB: 'bg-yellow-100 text-yellow-700',
    UI: 'bg-green-100 text-green-700',
    Network: 'bg-blue-100 text-blue-700',
  }
  return classes[category as keyof typeof classes] || 'bg-gray-100 text-gray-700'
}

const getStatusCount = (status: string) => {
  return props.bugs.filter((b) => b.status === status).length
}

const handleSort = (id: string, desc: boolean) => {
  emit('sort', id, desc)
}
</script>
