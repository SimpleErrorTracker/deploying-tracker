<template>
  <div class="bg-white rounded-xl shadow-lg p-4 mb-6">
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Поиск -->
      <div class="flex-1">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск по описанию, категории, автору..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            @input="onSearchChange"
          />
        </div>
      </div>

      <!-- Фильтр по категории -->
      <select
        v-model="categoryFilter"
        class="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        @change="onCategoryChange"
      >
        <option value="all">Все категории</option>
        <option value="Authentication">🔐 Авторизация</option>
        <option value="DB">🗄 База данных</option>
        <option value="UI">🎨 Интерфейс</option>
        <option value="Network">🌐 Сеть</option>
      </select>

      <!-- Фильтр по приоритету -->
      <select
        v-model="priorityFilter"
        class="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        @change="onPriorityChange"
      >
        <option value="all">Все приоритеты</option>
        <option value="critical">🔴 Критический</option>
        <option value="high">🟠 Высокий</option>
        <option value="medium">🟡 Средний</option>
        <option value="low">🟢 Низкий</option>
      </select>

      <!-- Фильтр по статусу -->
      <select
        v-model="statusFilter"
        class="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        @change="onStatusChange"
      >
        <option value="all">Все статусы</option>
        <option value="Open">🔴 Открыт</option>
        <option value="In Progress">🟡 В работе</option>
        <option value="Done">🟢 Готов</option>
      </select>

      <!-- Сброс фильтров -->
      <button
        v-if="hasActiveFilters"
        @click="resetFilters"
        class="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
      >
        Сбросить
      </button>
    </div>

    <!-- Активные фильтры -->
    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
      <span class="text-xs text-gray-500">Активные фильтры:</span>
      <span
        v-if="categoryFilter !== 'all'"
        class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg"
      >
        Категория: {{ categoryFilter }}
        <X @click="clearCategoryFilter" class="w-3 h-3 cursor-pointer hover:text-red-600" />
      </span>
      <span
        v-if="priorityFilter !== 'all'"
        class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg"
      >
        Приоритет: {{ priorityFilter }}
        <X @click="clearPriorityFilter" class="w-3 h-3 cursor-pointer hover:text-red-600" />
      </span>
      <span
        v-if="statusFilter !== 'all'"
        class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg"
      >
        Статус: {{ statusFilter }}
        <X @click="clearStatusFilter" class="w-3 h-3 cursor-pointer hover:text-red-600" />
      </span>
      <span
        v-if="searchQuery"
        class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg"
      >
        Поиск: "{{ searchQuery }}"
        <X @click="clearSearch" class="w-3 h-3 cursor-pointer hover:text-red-600" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, X } from 'lucide-vue-next'

const emit = defineEmits<{
  (
    e: 'filter-change',
    filters: {
      search: string
      category: string
      priority: string
      status: string
    },
  ): void
}>()

const searchQuery = ref('')
const categoryFilter = ref('all')
const priorityFilter = ref('all')
const statusFilter = ref('all')

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value ||
    categoryFilter.value !== 'all' ||
    priorityFilter.value !== 'all' ||
    statusFilter.value !== 'all'
  )
})

const emitFilters = () => {
  emit('filter-change', {
    search: searchQuery.value,
    category: categoryFilter.value,
    priority: priorityFilter.value,
    status: statusFilter.value,
  })
}

const onSearchChange = () => emitFilters()
const onCategoryChange = () => emitFilters()
const onPriorityChange = () => emitFilters()
const onStatusChange = () => emitFilters()

// Очистка отдельных фильтров
const clearCategoryFilter = () => {
  categoryFilter.value = 'all'
  emitFilters()
}

const clearPriorityFilter = () => {
  priorityFilter.value = 'all'
  emitFilters()
}

const clearStatusFilter = () => {
  statusFilter.value = 'all'
  emitFilters()
}

const clearSearch = () => {
  searchQuery.value = ''
  emitFilters()
}

const resetFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = 'all'
  priorityFilter.value = 'all'
  statusFilter.value = 'all'
  emitFilters()
}

// Debounce для поиска
let debounceTimeout: NodeJS.Timeout
watch(searchQuery, () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    emitFilters()
  }, 300)
})
</script>
