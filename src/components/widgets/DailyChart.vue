<template>
  <div class="bg-white rounded-2xl shadow p-6">
    <div class="flex items-center gap-2 mb-4">
      <TrendingUp class="w-5 h-5 text-green-600" />
      <h2 class="text-xl font-semibold text-gray-900">Динамика ошибок по дням</h2>
    </div>
    <div class="h-80">
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div class="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
      <p class="font-medium text-gray-900">Тренд:</p>
      <p class="mt-1" v-html="trendHtml"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { Chart } from 'chart.js/auto'
import { TrendingUp } from 'lucide-vue-next'

// Props
const props = defineProps<{
  dailyData: Record<string, number>
  trendAnalysis: string
}>()

// Refs
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// Computed
const trendHtml = computed(() => {
  if (props.trendAnalysis.includes('Растёт')) {
    return '<span class="text-red-600 font-bold">Растёт количество ошибок</span> — требуется срочное исправление.'
  } else if (props.trendAnalysis.includes('Снижается')) {
    return '<span class="text-green-600 font-bold">Снижается количество ошибок</span> — положительная динамика после исправлений.'
  }
  return '<span class="text-blue-600 font-bold">Стабильное количество ошибок</span> — ситуация контролируется.'
})

// Methods
const createChart = () => {
  if (!chartCanvas.value) return

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
  }

  const sortedDates = Object.keys(props.dailyData).sort()

  // Проверка на пустые данные
  if (sortedDates.length === 0) {
    return
  }

  const labels = sortedDates.map((date) => {
    const d = new Date(date)
    return d.toLocaleDateString('ru-RU', { weekday: 'short' })
  })

  const data = sortedDates.map((date) => props.dailyData[date])

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Новые ошибки',
          data: data,
          borderColor: 'rgba(255, 82, 82, 1)',
          backgroundColor: 'rgba(255, 82, 82, 0.2)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'rgba(255, 82, 82, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          fill: true,
          tension: 0.3, // Плавная линия
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, labels: { color: '#333' } },
        tooltip: {
          callbacks: {
            title: (context) => {
              const date = sortedDates[context[0].dataIndex]
              if (!date) return ''
              return new Date(date).toLocaleDateString('ru-RU', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })
            },
            label: (context) => {
              return `Ошибок: ${context.raw}`
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#333',
            stepSize: 1, // Целые числа
          },
          title: { display: true, text: 'Количество новых ошибок', color: '#333' },
        },
        x: {
          ticks: { color: '#333' },
          title: { display: true, text: 'День', color: '#333' },
        },
      },
    },
  })
}

// Watchers - ВАЖНО: обновляем график при изменении данных
watch(
  () => props.dailyData,
  () => {
    createChart()
  },
  { deep: true },
)

// Lifecycle
onMounted(() => {
  createChart()
})
</script>
