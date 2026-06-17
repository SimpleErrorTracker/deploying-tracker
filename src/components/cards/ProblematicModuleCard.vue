<template>
  <div class="group relative overflow-hidden bg-gradient-to-br from-red-50 via-red-50 to-orange-50 rounded-xl border border-red-200 transition-all hover:shadow-md">
    <div class="absolute top-0 right-0 w-32 h-32 bg-red-400 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

    <div class="relative p-5">
      <div class="flex items-center gap-2 mb-4">
        <div class="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg shadow-md transform transition-transform group-hover:scale-105">
          <AlertCircle class="w-4 h-4 text-white" />
        </div>
        <h3 class="font-bold text-gray-900 text-lg">Проблемный модуль</h3>
        <span class="ml-auto text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full animate-pulse">Критично</span>
      </div>

      <p class="text-gray-700 leading-relaxed">
        Модуль
        <span class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 font-bold rounded-lg mx-1">
          <AlertCircle class="w-3 h-3" />
          {{ categoryMetrics.mostProblematicCategory || 'Не определен' }}
        </span>
        является наиболее критичным — здесь найдено
        <strong class="text-red-600 text-lg mx-1">{{ categoryMetrics.mostProblematicCount }}</strong>
        ошибок
        <span v-if="categoryMetrics.mostProblematicPercent > 0">
          ({{ categoryMetrics.mostProblematicPercent }}% всех дефектов)
        </span>.
      </p>

      <div class="mt-4 bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg border-l-4 border-red-500">
        <div class="flex items-start gap-2">
          <AlarmPlusIcon class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p class="text-red-800 font-semibold">
            Приоритет сопровождения: немедленное исправление ошибок в этом модуле
          </p>
        </div>
      </div>

      <div class="mt-3 flex gap-2">
        <div class="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">High Priority</div>
        <div class="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">Требует внимания</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, AlarmPlusIcon } from 'lucide-vue-next';

defineProps<{
  categoryMetrics: {
    mostProblematicCategory: string;
    mostProblematicCount: number;
    mostProblematicPercent: number;
  };
}>();
</script>