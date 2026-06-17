<template>
  <div class="bg-white rounded-2xl shadow p-6">
    <div class="flex items-center gap-2 mb-4">
      <Layers class="w-5 h-5 text-blue-600" />
      <h2 class="text-xl font-semibold text-gray-900">
        Ошибки по категориям
      </h2>
    </div>
    <div class="h-80">
      <canvas ref="chartCanvas"></canvas>
    </div>
    <div class="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
      <p class="font-medium text-gray-900">Анализ:</p>
      <p class="mt-1">
        Самый проблемный модуль —
        <span class="text-red-600 font-bold">{{ mostProblematicCategory }}</span>
        с {{ mostProblematicCount }} ошибками ({{ mostProblematicPercent }}% всех дефектов).
        <span class="text-gray-700">Требуется приоритетное исправление.</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { Chart } from 'chart.js/auto';
import { Layers } from 'lucide-vue-next';

// Props
const props = defineProps<{
  categoryData: Record<string, number>;
  totalBugs: number;
}>();

// Refs
const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

// Computed
const sortedCategories = computed(() =>
    Object.entries(props.categoryData).sort((a, b) => b[1] - a[1])
);

const mostProblematicCategory = computed(() =>
    sortedCategories.value[0]?.[0] || ''
);

const mostProblematicCount = computed(() =>
    sortedCategories.value[0]?.[1] || 0
);

const mostProblematicPercent = computed(() =>
    props.totalBugs > 0
        ? Math.round((mostProblematicCount.value / props.totalBugs) * 100)
        : 0
);

// Methods
const createChart = () => {
  if (!chartCanvas.value) return;

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = sortedCategories.value.map(([cat]) => cat);
  const data = sortedCategories.value.map(([_, count]) => count);

  chartInstance = new Chart(chartCanvas.value, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Количество ошибок',
        data: data,
        backgroundColor: [
          'rgba(255, 82, 82, 0.8)',
          'rgba(255, 152, 0, 0.8)',
          'rgba(120, 220, 120, 0.8)',
          'rgba(82, 152, 255, 0.8)'
        ],
        borderColor: [
          'rgba(255, 82, 82, 1)',
          'rgba(255, 152, 0, 1)',
          'rgba(120, 220, 120, 1)',
          'rgba(82, 152, 255, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#333' }
        },
        tooltip: {
          callbacks: {
            afterLabel: (context) => {
              const value = context.raw as number;
              const percent = Math.round((value / props.totalBugs) * 100);
              return `${percent}% всех дефектов`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#333' },
          title: { display: true, text: 'Количество ошибок', color: '#333' }
        },
        x: {
          ticks: { color: '#333' },
          title: { display: true, text: 'Категория', color: '#333' }
        }
      }
    }
  });
};

// Watchers
watch(() => props.categoryData, () => {
  createChart();
}, { deep: true });

// Lifecycle
onMounted(() => {
  createChart();
});
</script>