<template>
  <div class="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition cursor-pointer">
    <div class="flex items-center justify-between mb-4">
      <!-- Иконка из lucide-vue-next -->
      <div class="text-3xl text-gray-700">
        <component :is="iconComponent" class="w-8 h-8" />
      </div>

      <!-- Badge с правильными Tailwind классами -->
      <div class="text-sm font-medium px-2 py-1 rounded" :class="colorBadgeClass">
        {{ colorBadgeText }}
      </div>
    </div>

    <!-- Название метрики -->
    <h3 class="text-sm font-medium text-gray-600 mb-2">{{ title }}</h3>

    <!-- Числовое значение -->
    <p class="text-3xl font-bold text-gray-900 mb-2">
      {{ formattedValue }}
    </p>

    <!-- Описание -->
    <p class="text-sm text-gray-500">{{ description }}</p>

    <!-- Дополнительная информация при hover -->
    <div v-if="additionalInfo" class="mt-3 pt-3 border-t border-gray-200">
      <p class="text-xs text-gray-400">{{ additionalInfo }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import {
  BarChart3,
  AlertCircle,
  Clock,
  CheckCircle,
  AlertOctagon,
  TrendingUp,
  Icon,
} from 'lucide-vue-next'

// Тип для иконок
type IconName = 'statistics' | 'critical' | 'active' | 'resolved' | 'high' | 'average'

export default defineComponent({
  name: 'MetricCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isDecimal: {
      type: Boolean,
      default: false,
    },
    additionalInfo: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const iconMap: Record<IconName, typeof Icon> = {
      statistics: BarChart3,
      critical: AlertCircle,
      active: Clock,
      resolved: CheckCircle,
      high: AlertOctagon,
      average: TrendingUp,
    }

    // Получение иконки по имени
    const iconComponent = computed(() => {
      const iconName = props.icon as IconName
      return iconMap[iconName] || BarChart3
    })

    // Классы для badge
    const colorBadgeClass = computed(() => {
      const badges: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-800',
        red: 'bg-red-100 text-red-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        green: 'bg-green-100 text-green-800',
        orange: 'bg-orange-100 text-orange-800',
        purple: 'bg-purple-100 text-purple-800',
      }
      return badges[props.color] || 'bg-gray-100 text-gray-800'
    })

    // Текст для badge
    const colorBadgeText = computed(() => {
      const badgeTexts: Record<string, string> = {
        blue: 'Total',
        red: 'Open',
        yellow: 'Progress',
        green: 'Done',
        orange: 'High',
        purple: 'Avg/day',
      }
      return badgeTexts[props.color] || 'Info'
    })

    // Форматирование значения
    const formattedValue = computed(() => {
      if (props.isDecimal) {
        return props.value.toFixed(1)
      }
      return props.value
    })

    return {
      iconComponent,
      colorBadgeClass,
      colorBadgeText,
      formattedValue,
    }
  },
})
</script>
