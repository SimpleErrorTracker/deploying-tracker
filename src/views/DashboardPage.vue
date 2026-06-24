<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
    <div class="mt-10 max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8 p-5 shadow-lg xl:flex justify-between items-start bg-white rounded-2xl">
        <div class="flex-1">
          <SectionTitle
            title="Дашборд качества программного продукта"
            description="Общая картина состояния проекта и метрики качества ПО"
            :show-line="false"
          />
          <div class="py-4">
            <p class="text-sm font-medium text-gray-700">{{ authStore.userName }}</p>
            <p class="text-xs text-gray-500">{{ authStore.userEmail }}</p>
          </div>
        </div>

        <div class="flex flex-col align-end gap-4">
          <RouterLink to="/create-bug">
            <GradientButton variant="secondary" title="Новый репорт" custom-class="justify-between">
              <template #lucidicon><BugIcon class="w-4 h-4" /></template>
            </GradientButton>
          </RouterLink>

          <RouterLink to="/bugs">
            <GradientButton variant="gradient" title="Список багов" custom-class="justify-between">
              <template #lucidicon><List class="w-4 h-4" /></template>
            </GradientButton>
          </RouterLink>

          <GradientButton
            variant="red"
            @click="handleLogout"
            title="Выйти"
            custom-class="justify-between"
          >
            <template #lucidicon><LogOut class="w-4 h-4" /></template>
          </GradientButton>
        </div>
      </div>

      <!-- Filters -->
      <DashboardFilters
        :period="selectedPeriod"
        :status="selectedStatus"
        @filter-change="handleFilterChange"
        @refresh="refreshData"
      />

      <!-- Metric Cards в списке -->
      <div class="mb-8">
        <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <li>
            <MetricCard
              title="Всего ошибок"
              :value="metrics.totalBugs"
              icon="statistics"
              color="blue"
              description="Общее количество дефектов за период"
              :additional-info="`Зарегистрированных`"
            />
          </li>
          <li>
            <MetricCard
              title="Открытые"
              :value="metrics.openBugs"
              icon="critical"
              color="red"
              description="Ошибки, требующие первичной обработки"
              :additional-info="`Требуется обработка`"
            />
          </li>
          <li>
            <MetricCard
              title="В процессе"
              :value="metrics.inProgressBugs"
              icon="active"
              color="yellow"
              description="Ошибки в работе разработчиков"
              :additional-info="`В работе сейчас`"
            />
          </li>
          <li>
            <MetricCard
              title="Готовые"
              :value="metrics.doneBugs"
              icon="resolved"
              color="green"
              description="Исправленные и закрытые ошибки"
              :additional-info="`${calculateDonePercent}% от всех ошибок`"
            />
          </li>
          <li>
            <MetricCard
              title="Приоритетные"
              :value="metrics.highPriorityBugs"
              icon="high"
              color="orange"
              description="Критичные ошибки для приоритетного исправления"
              :additional-info="`Исправлять в первую очередь`"
            />
          </li>
          <li>
            <MetricCard
              title="Среднее в день"
              :value="metrics.averagePerDay"
              icon="average"
              color="purple"
              description="Средняя нагрузка на команду"
              :is-decimal="true"
              :additional-info="`Ошибок в день`"
            />
          </li>
        </ul>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CategoryChart :category-data="categoryData" :total-bugs="metrics.totalBugs" />
        <DailyChart :daily-data="dailyData" :trend-analysis="trendAnalysis" />
      </div>

      <!-- Analytical Summary -->
      <AnalyticalSummary
        :metrics="metrics"
        :category-metrics="categoryMetrics"
        :trend-analysis="trendAnalysis"
        :trend-analysis-detailed="trendAnalysisDetailed"
      />

      <div class="flex gap-10 justify-center items-center p-10">
        <a>быстрый выход</a>
        <button
          @click="forceLogout"
          class="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <LogOut class="w-4 h-4" />
          <span>Выйти</span>
        </button>
      </div>
    </div>

    <Transition name="modal" appear>
      <div
        v-if="showLogoutModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showLogoutModal = false"
      >
        <div class="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl transform transition-all">
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-red-100 p-2 rounded-full">
              <LogOut class="w-6 h-6 text-red-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900">Выход из аккаунта</h3>
          </div>
          <p class="text-gray-600 mb-6">Вы уверены, что хотите выйти из аккаунта?</p>
          <div class="flex gap-3">
            <button
              @click="showLogoutModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              @click="confirmLogout"
              class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { LogOut, BugIcon, List } from 'lucide-vue-next'
import { bugs } from '@/mock/bugData'
import SectionTitle from '@/components/widgets/SectionTitle.vue'
import DashboardFilters from '@/components/widgets/DashboardFiltres.vue'
import MetricCard from '@/components/common-ui/MetricCard.vue'
import CategoryChart from '@/components/widgets/CategoryChart.vue'
import DailyChart from '@/components/widgets/DailyChart.vue'
import AnalyticalSummary from '@/components/widgets/AnalyticalSummary.vue'
import type { Bug } from '@/types/bug.types'
import GradientButton from '@/components/common-ui/GradientButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const showLogoutModal = ref(false)

// State
const selectedPeriod = ref('30')
const selectedStatus = ref('all')

const metrics = reactive({
  totalBugs: 0,
  openBugs: 0,
  inProgressBugs: 0,
  doneBugs: 0,
  highPriorityBugs: 0,
  averagePerDay: 0,
})

const categoryMetrics = reactive({
  mostProblematicCategory: '',
  mostProblematicCount: 0,
  mostProblematicPercent: 0,
})

const categoryData = ref<Record<string, number>>({})
const dailyData = ref<Record<string, number>>({})
const trendAnalysis = ref('')
const trendAnalysisDetailed = ref('')

// Computed
const calculateDonePercent = computed(() => {
  if (metrics.totalBugs === 0) return 0
  return Math.round((metrics.doneBugs / metrics.totalBugs) * 100)
})

// Methods
const filterBugs = (): Bug[] => {
  const days = parseInt(selectedPeriod.value)
  const sinceDate = new Date()
  sinceDate.setDate(sinceDate.getDate() - days)

  return bugs.filter((bug) => {
    const bugDate = new Date(bug.created_at)
    const matchesPeriod = bugDate >= sinceDate
    const matchesStatus = selectedStatus.value === 'all' || bug.status === selectedStatus.value
    return matchesPeriod && matchesStatus
  })
}

const analyzeTrend = (bugsList: Bug[]) => {
  const dailyCounts: Record<string, number> = {}
  bugsList.forEach((bug) => {
    const createdAt = bug.created_at
    if (!createdAt) return

    const date = createdAt.split('T')[0]
    if (!date) return

    dailyCounts[date] = (dailyCounts[date] ?? 0) + 1
  })
  dailyData.value = dailyCounts

  const sortedDates = Object.keys(dailyCounts).sort()
  if (sortedDates.length < 2) {
    trendAnalysis.value = 'Недостаточно данных для анализа тренда.'
    trendAnalysisDetailed.value = 'Период наблюдения слишком короткий.'
    return
  }

  const firstHalf = sortedDates.slice(0, Math.floor(sortedDates.length / 2))
  const secondHalf = sortedDates.slice(Math.floor(sortedDates.length / 2))

  const firstHalfAvg =
    firstHalf.reduce((sum, date) => sum + (dailyCounts[date] ?? 0), 0) / firstHalf.length

  const secondHalfAvg =
    secondHalf.reduce((sum, date) => sum + (dailyCounts[date] ?? 0), 0) / secondHalf.length

  const changePercent = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100

  if (changePercent > 20) {
    trendAnalysis.value = `Растёт количество ошибок (+${Math.round(changePercent)}%) — требуется срочное исправление.`
    trendAnalysisDetailed.value = `В первой половине периода среднее ${firstHalfAvg.toFixed(1)}, во второй ${secondHalfAvg.toFixed(1)}. Растёт нагрузка после релиза.
  } else if (changePercent < -20) {`
    trendAnalysis.value = `Снижается количество ошибок (${Math.round(changePercent)}%) — положительная динамика.`
    trendAnalysisDetailed.value = `В первой половине периода среднее ${firstHalfAvg.toFixed(1)}, во второй ${secondHalfAvg.toFixed(1)}. Исправления дали эффект.`
  } else {
    trendAnalysis.value = `Стабильное количество ошибок ~(${Math.round(changePercent)}%) — ситуация контролируется.`
    trendAnalysisDetailed.value = `Нет значительного роста или снижения. Ситуация стабильна.`
  }
}

const calculateMetrics = () => {
  const filtered = filterBugs()

  metrics.totalBugs = filtered.length
  metrics.openBugs = filtered.filter((b) => b.status === 'Open').length
  metrics.inProgressBugs = filtered.filter((b) => b.status === 'In Progress').length
  metrics.doneBugs = filtered.filter((b) => b.status === 'Done').length
  metrics.highPriorityBugs = filtered.filter(
    (b) => b.priority === 'high' || b.priority === 'critical',
  ).length
  metrics.averagePerDay = metrics.totalBugs / parseInt(selectedPeriod.value)

  const categoryCounts: Record<string, number> = {}
  filtered.forEach((bug) => {
    categoryCounts[bug.category] = (categoryCounts[bug.category] || 0) + 1
  })
  categoryData.value = categoryCounts

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])
  const mostProblematic = sortedCategories[0]

  if (mostProblematic) {
    categoryMetrics.mostProblematicCategory = mostProblematic[0]
    categoryMetrics.mostProblematicCount = mostProblematic[1]
    categoryMetrics.mostProblematicPercent = Math.round(
      (mostProblematic[1] / metrics.totalBugs) * 100,
    )
  } else {
    categoryMetrics.mostProblematicCategory = ''
    categoryMetrics.mostProblematicCount = 0
    categoryMetrics.mostProblematicPercent = 0
  }

  analyzeTrend(filtered)
}

const refreshData = () => {
  calculateMetrics()
}

const handleFilterChange = ({ period, status }: { period: string; status: string }) => {
  selectedPeriod.value = period
  selectedStatus.value = status
}

const handleLogout = () => {
  showLogoutModal.value = true
}

const confirmLogout = async () => {
  try {
    showLogoutModal.value = false

    // Выход из Supabase
    await supabase.auth.signOut()

    // Очищаем Pinia store
    await authStore.signOut()

    // Принудительно перенаправляем
    router.push('/auth')
  } catch (error) {
    console.error('Logout error:', error)
    // Если произошла ошибка, всё равно перенаправляем
    router.push('/auth')
  }
}

const forceLogout = async () => {
  try {
    // Прямой выход через Supabase
    await supabase.auth.signOut()

    // Очистка localStorage
    localStorage.clear()
    sessionStorage.clear()

    // Сброс store
    authStore.$reset()

    // Перенаправление
    window.location.href = '/auth'
  } catch (error) {
    console.error(error)
    window.location.href = '/auth'
  }
}

// Watchers
watch([selectedPeriod, selectedStatus], () => {
  refreshData()
})

// Lifecycle
onMounted(() => {
  calculateMetrics()
})
</script>
