<template>
  <div class="group relative overflow-hidden bg-gradient-to-br from-purple-50 via-purple-50 to-pink-50 rounded-xl border border-purple-200 transition-all hover:shadow-md">
    <div class="absolute top-0 right-0 w-32 h-32 bg-purple-400 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

    <div class="relative p-5">
      <div class="flex items-center gap-2 mb-4">
        <div class="bg-gradient-to-br from-purple-600 to-purple-700 p-2 rounded-lg shadow-md transform transition-transform group-hover:scale-105">
          <CheckCircle class="w-4 h-4 text-white" />
        </div>
        <h3 class="font-bold text-gray-900 text-lg">Рекомендации</h3>
        <span class="ml-auto text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Action items</span>
      </div>

      <ul class="space-y-3">
        <RecommendationItem
            v-for="(rec, index) in recommendations"
            :key="index"
            :text="rec.text"
            :highlight="rec.highlight"
            :highlight-color="rec.highlightColor"
        />
      </ul>

      <div class="mt-4 pt-3 border-t border-purple-200">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600">Приоритет выполнения:</span>
          <div class="flex gap-2">
            <span class="px-2 py-1 bg-red-100 text-red-600 rounded">Высокий</span>
            <span class="px-2 py-1 bg-yellow-100 text-yellow-600 rounded">Средний</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CheckCircle } from 'lucide-vue-next';
import RecommendationItem from "@/components/common-ui/RecommendationItem.vue";

const props = defineProps<{
  metrics: {
    highPriorityBugs: number;
    averagePerDay: number;
  };
  categoryMetrics: {
    mostProblematicCategory: string;
  };
}>();

const recommendations = computed(() => [
  {
    text: `Продолжить контроль модуля`,
    highlight: props.categoryMetrics.mostProblematicCategory || 'проблемных зон',
    highlightColor: 'red'
  },
  {
    text: `Оставить высокий приоритет для критичных дефектов`,
    highlight: `${props.metrics.highPriorityBugs} ошибок`,
    highlightColor: 'orange'
  },
  {
    text: `Повторно оценить динамику через несколько дней`,
    highlight: '',
    highlightColor: ''
  },
  {
    text: `Оптимизировать нагрузку на команду: среднее`,
    highlight: `${props.metrics.averagePerDay.toFixed(1)} ошибок в день`,
    highlightColor: 'purple'
  }
]);
</script>