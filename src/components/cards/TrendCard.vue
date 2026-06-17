<template>
  <div class="group relative overflow-hidden rounded-xl border transition-all hover:shadow-md"
       :class="trendCardClass">
    <div class="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"
         :class="trendBlurClass"></div>

    <div class="relative p-5">
      <div class="flex items-center gap-2 mb-4">
        <div class="p-2 rounded-lg shadow-md transform transition-transform group-hover:scale-105"
             :class="trendIconBgClass">
          <TrendingUp class="w-4 h-4 text-white" />
        </div>
        <h3 class="font-bold text-gray-900 text-lg">Динамика после релиза</h3>
        <span class="ml-auto text-xs px-2 py-1 rounded-full"
              :class="trendBadgeClass">
          {{ trendType }}
        </span>
      </div>

      <div class="text-gray-700 leading-relaxed space-y-2">
        <p v-html="trendHtml"></p>
        <div class="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
          <p class="text-sm text-gray-600" v-html="trendAnalysisDetailed"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TrendingUp } from 'lucide-vue-next';

const props = defineProps<{
  trendAnalysis: string;
  trendAnalysisDetailed: string;
}>();

const trendType = computed(() => {
  if (props.trendAnalysis.includes('Растёт')) return 'Негативный';
  if (props.trendAnalysis.includes('Снижается')) return 'Позитивный';
  return 'Стабильный';
});

const trendCardClass = computed(() => {
  if (props.trendAnalysis.includes('Растёт')) return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
  if (props.trendAnalysis.includes('Снижается')) return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
  return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
});

const trendBlurClass = computed(() => {
  if (props.trendAnalysis.includes('Растёт')) return 'bg-red-400';
  if (props.trendAnalysis.includes('Снижается')) return 'bg-green-400';
  return 'bg-blue-400';
});

const trendIconBgClass = computed(() => {
  if (props.trendAnalysis.includes('Растёт')) return 'bg-gradient-to-br from-red-600 to-red-700';
  if (props.trendAnalysis.includes('Снижается')) return 'bg-gradient-to-br from-green-600 to-green-700';
  return 'bg-gradient-to-br from-blue-600 to-blue-700';
});

const trendBadgeClass = computed(() => {
  if (props.trendAnalysis.includes('Растёт')) return 'bg-red-100 text-red-600';
  if (props.trendAnalysis.includes('Снижается')) return 'bg-green-100 text-green-600';
  return 'bg-blue-100 text-blue-600';
});

const trendHtml = computed(() => {
  const trendText = props.trendAnalysis.split('—')[0];
  if (props.trendAnalysis.includes('Растёт')) {
    return `<span class="text-red-600 font-bold">${trendText}</span><span class="text-gray-700"> — требуется срочное исправление.</span>`;
  } else if (props.trendAnalysis.includes('Снижается')) {
    return `<span class="text-green-600 font-bold">${trendText}</span><span class="text-gray-700"> — положительная динамика после исправлений.</span>`;
  }
  return `<span class="text-blue-600 font-bold">${trendText}</span><span class="text-gray-700"> — ситуация контролируется.</span>`;
});
</script>