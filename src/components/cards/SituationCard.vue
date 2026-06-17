<template>
  <div
    class="group relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 rounded-xl border border-blue-200 transition-all hover:shadow-md"
  >
    <div
      class="absolute top-0 right-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"
    ></div>

    <div class="relative p-5">
      <div class="flex items-center gap-2 mb-4">
        <div
          class="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-md transform transition-transform group-hover:scale-105"
        >
          <BarChart3 class="w-4 h-4 text-white" />
        </div>
        <h3 class="font-bold text-gray-900 text-lg">Общая ситуация</h3>
        <span class="ml-auto text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full"
          >Актуально</span
        >
      </div>

      <p class="text-gray-700 leading-relaxed">
        За выбранный период зарегистрировано
        <MetricBage :value="metrics.totalBugs" color="blue" />
        ошибок. Из них
        <MetricBage :value="metrics.openBugs" color="red" />
        ещё не взяты в работу,
        <MetricBage :value="metrics.inProgressBugs" color="yellow" />
        исправляются разработчиками, и
        <MetricBage :value="metrics.doneBugs" color="green" />
        уже закрыты.
      </p>

      <div class="mt-4 flex gap-4 text-sm">
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full bg-blue-500"></div>
          <span class="text-gray-600">Всего: {{ metrics.totalBugs }}</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full bg-green-500"></div>
          <span class="text-gray-600">Готово: {{ getDonePercent }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BarChart3 } from 'lucide-vue-next'
import MetricBage from '../common-ui/MetricBage.vue'

const props = defineProps<{
  metrics: {
    totalBugs: number
    openBugs: number
    inProgressBugs: number
    doneBugs: number
  }
}>()

const getDonePercent = computed(() => {
  if (props.metrics.totalBugs === 0) return 0
  return Math.round((props.metrics.doneBugs / props.metrics.totalBugs) * 100)
})
</script>
