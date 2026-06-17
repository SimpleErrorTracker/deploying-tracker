<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <button
              @click="$router.push('/dashboard')"
              class="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft class="w-5 h-5 text-gray-600" />
            </button>
            <div class="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
              <List class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Список баг-репортов</h1>
              <p class="text-sm text-gray-500 mt-0.5">Управление и отслеживание ошибок</p>
            </div>
          </div>

          <router-link
            to="/create-bug"
            class="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
          >
            <Plus class="w-5 h-5" />
            <span>Новый баг-репорт</span>
          </router-link>
        </div>
      </div>

      <!-- Статистика -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl p-4 shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Всего багов</p>
              <p class="text-2xl font-bold text-gray-900">{{ bugStore.statistics.total }}</p>
            </div>
            <Bug class="w-8 h-8 text-blue-500 opacity-50" />
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Открыто</p>
              <p class="text-2xl font-bold text-red-600">{{ bugStore.statistics.open }}</p>
            </div>
            <Circle class="w-8 h-8 text-red-500 opacity-50" />
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">В работе</p>
              <p class="text-2xl font-bold text-yellow-600">{{ bugStore.statistics.inProgress }}</p>
            </div>
            <Clock class="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </div>

        <div class="bg-white rounded-xl p-4 shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Готово</p>
              <p class="text-2xl font-bold text-green-600">{{ bugStore.statistics.done }}</p>
            </div>
            <CheckCircle class="w-8 h-8 text-green-500 opacity-50" />
          </div>
        </div>
      </div>

      <!-- Фильтры -->
      <BugsFilters @filter-change="applyFilters" />

      <!-- Таблица -->
      <BugsTable :bugs="filteredBugs" :sort-by="sortBy" @sort="handleSort" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBugStore } from '@/stores/bugStore'
import { ArrowLeft, List, Plus, Bug, Circle, Clock, CheckCircle } from 'lucide-vue-next'
import BugsFilters from '@/components/bugs/BugsFilters.vue'
import BugsTable from '@/components/bugs/BugsTable.vue'

const bugStore = useBugStore()

// Фильтры
const filters = ref({
  search: '',
  category: 'all',
  priority: 'all',
  status: 'all',
})

// Сортировка
const sortBy = ref({ id: 'created_at', desc: true })

// Фильтрация багов
const filteredBugs = computed(() => {
  let bugs = [...bugStore.bugs]

  // Поиск
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    bugs = bugs.filter(
      (bug) =>
        bug.description.toLowerCase().includes(searchTerm) ||
        bug.category.toLowerCase().includes(searchTerm) ||
        bug.author_name.toLowerCase().includes(searchTerm) ||
        bug.id.includes(searchTerm),
    )
  }

  // Категория
  if (filters.value.category !== 'all') {
    bugs = bugs.filter((bug) => bug.category === filters.value.category)
  }

  // Приоритет
  if (filters.value.priority !== 'all') {
    bugs = bugs.filter((bug) => bug.priority === filters.value.priority)
  }

  // Статус
  if (filters.value.status !== 'all') {
    bugs = bugs.filter((bug) => bug.status === filters.value.status)
  }

  // Сортировка
  const { id, desc } = sortBy.value
  bugs.sort((a, b) => {
    let aVal: any = a[id as keyof typeof a]
    let bVal: any = b[id as keyof typeof b]

    if (id === 'created_at') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    }

    if (aVal < bVal) return desc ? 1 : -1
    if (aVal > bVal) return desc ? -1 : 1
    return 0
  })

  return bugs
})

const applyFilters = (newFilters: typeof filters.value) => {
  filters.value = newFilters
}

const handleSort = (id: string, desc: boolean) => {
  sortBy.value = { id, desc }
}

onMounted(() => {
  bugStore.fetchBugs()
})
</script>
