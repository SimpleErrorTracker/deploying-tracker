import { ref, computed } from 'vue'
import type { Bug } from '@/types/bug.types'

export function useBugsTable(bugs: Bug[]) {
  const searchQuery = ref('')
  const categoryFilter = ref('all')
  const priorityFilter = ref('all')
  const statusFilter = ref('all')
  const sortBy = ref<{ id: keyof Bug; desc: boolean }>({ id: 'created_at', desc: true })

  // Фильтрация
  const filteredBugs = computed(() => {
    let result = [...bugs]

    // Поиск
    if (searchQuery.value) {
      const searchTerm = searchQuery.value.toLowerCase()
      result = result.filter(
        (bug) =>
          bug.description.toLowerCase().includes(searchTerm) ||
          bug.category.toLowerCase().includes(searchTerm) ||
          bug.author_name.toLowerCase().includes(searchTerm) ||
          bug.id.includes(searchTerm),
      )
    }

    // Фильтр по категории
    if (categoryFilter.value !== 'all') {
      result = result.filter((bug) => bug.category === categoryFilter.value)
    }

    // Фильтр по приоритету
    if (priorityFilter.value !== 'all') {
      result = result.filter((bug) => bug.priority === priorityFilter.value)
    }

    // Фильтр по статусу
    if (statusFilter.value !== 'all') {
      result = result.filter((bug) => bug.status === statusFilter.value)
    }

    return result
  })

  // Сортировка
  const sortedBugs = computed(() => {
    const sorted = [...filteredBugs.value]
    const { id, desc } = sortBy.value

    sorted.sort((a, b) => {
      let aVal: any = a[id]
      let bVal: any = b[id]

      if (id === 'created_at') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) return desc ? 1 : -1
      if (aVal > bVal) return desc ? -1 : 1
      return 0
    })

    return sorted
  })

  const setSorting = (id: keyof Bug, desc: boolean) => {
    sortBy.value = { id, desc }
  }

  const setSearchQuery = (value: string) => {
    searchQuery.value = value
  }

  const setCategoryFilter = (value: string) => {
    categoryFilter.value = value
  }

  const setPriorityFilter = (value: string) => {
    priorityFilter.value = value
  }

  const setStatusFilter = (value: string) => {
    statusFilter.value = value
  }

  const resetFilters = () => {
    searchQuery.value = ''
    categoryFilter.value = 'all'
    priorityFilter.value = 'all'
    statusFilter.value = 'all'
    sortBy.value = { id: 'created_at', desc: true }
  }

  return {
    // Данные
    bugs: sortedBugs,

    // Фильтры
    searchQuery,
    categoryFilter,
    priorityFilter,
    statusFilter,

    // Сортировка
    sortBy,

    // Методы
    setSorting,
    setSearchQuery,
    setCategoryFilter,
    setPriorityFilter,
    setStatusFilter,
    resetFilters,

    // Вспомогательные
    hasActiveFilters: computed(
      () =>
        searchQuery.value !== '' ||
        categoryFilter.value !== 'all' ||
        priorityFilter.value !== 'all' ||
        statusFilter.value !== 'all',
    ),
  }
}
