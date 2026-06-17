<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
      <div class="bg-gradient-to-br from-purple-500 to-purple-700 p-2.5 rounded-xl shadow-lg">
        <FileText class="w-6 h-6 text-white" />
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Аналитический вывод</h2>
        <p class="text-sm text-gray-500 mt-0.5">Детальный анализ качества ПО</p>
      </div>
    </div>

    <div class="space-y-5">
      <!-- Общая ситуация -->
      <SectionTitle :metrics="metrics" :show-line="false" />

      <!-- Проблемный модуль -->
      <ProblematicModuleCard :category-metrics="categoryMetrics" />

      <!-- Динамика -->
      <TrendCard :trend-analysis="trendAnalysis" :trend-analysis-detailed="trendAnalysisDetailed" />

      <!-- Рекомендации -->
      <RecommendationCard :metrics="metrics" :category-metrics="categoryMetrics" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { FileText } from 'lucide-vue-next'
import SectionTitle from '@/components/widgets/SectionTitle.vue'
import ProblematicModuleCard from '@/components/cards/ProblematicModuleCard.vue'
import TrendCard from '@/components/cards/TrendCard.vue'
import RecommendationCard from '@/components/cards/RecommendationCard.vue'

interface Metrics {
  totalBugs: number
  openBugs: number
  inProgressBugs: number
  doneBugs: number
  highPriorityBugs: number
  averagePerDay: number
}

interface CategoryMetrics {
  mostProblematicCategory: string
  mostProblematicCount: number
  mostProblematicPercent: number
}

defineProps<{
  metrics: Metrics
  categoryMetrics: CategoryMetrics
  trendAnalysis: string
  trendAnalysisDetailed: string
}>()
</script>
