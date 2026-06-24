<template>
  <div class="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-gray-100">
    <div class="flex flex-wrap gap-5 items-end">
      <!-- Период - Кастомный дропдаун -->
      <div class="flex-1 min-w-[160px]">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          <div class="flex items-center gap-1">
            <Calendar class="w-3.5 h-3.5" />
            <span>Период</span>
          </div>
        </label>
        <div class="relative" ref="periodDropdownRef">
          <button
            @click="togglePeriodDropdown"
            class="w-full flex items-center justify-between bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:shadow-md transition-all duration-200 hover:border-gray-300"
          >
            <span class="flex items-center gap-2">
              <span class="text-lg">{{ selectedPeriodIcon }}</span>
              <span>{{ periodLabel }}</span>
            </span>
            <ChevronDown
              class="w-4 h-4 text-gray-400 transition-transform"
              :class="{ 'rotate-180': isPeriodOpen }"
            />
          </button>

          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="isPeriodOpen"
              class="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
            >
              <button
                v-for="option in periodOptions"
                :key="option.value"
                @click="selectPeriod(option.value)"
                class="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all flex items-center gap-2 group"
                :class="{
                  'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700':
                    localPeriod === option.value,
                }"
              >
                <span class="text-lg">{{ option.icon }}</span>
                <span class="flex-1 text-sm font-medium">{{ option.label }}</span>
                <Check v-if="localPeriod === option.value" class="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </transition>
        </div>
      </div>

      <!-- Статус - Кастомный дропдаун -->
      <div class="flex-1 min-w-[180px]">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          <div class="flex items-center gap-1">
            <Badge class="w-3.5 h-3.5" />
            <span>Статус</span>
          </div>
        </label>
        <div class="relative" ref="statusDropdownRef">
          <button
            @click="toggleStatusDropdown"
            class="w-full flex items-center justify-between bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:shadow-md transition-all duration-200 hover:border-gray-300"
          >
            <span class="flex items-center gap-2">
              <span class="text-lg">{{ selectedStatusIcon }}</span>
              <span>{{ statusLabel }}</span>
            </span>
            <ChevronDown
              class="w-4 h-4 text-gray-400 transition-transform"
              :class="{ 'rotate-180': isStatusOpen }"
            />
          </button>

          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div
              v-if="isStatusOpen"
              class="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
            >
              <button
                v-for="option in statusOptions"
                :key="option.value"
                @click="selectStatus(option.value)"
                class="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all flex items-center gap-2 group"
                :class="{
                  'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700':
                    localStatus === option.value,
                }"
              >
                <span class="text-lg">{{ option.icon }}</span>
                <span class="flex-1 text-sm font-medium">{{ option.label }}</span>
                <Check v-if="localStatus === option.value" class="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </transition>
        </div>
      </div>

      <!-- Кнопка обновления -->
      <div class="flex-shrink-0">
        <GradientButton variant="outline" @click="handleRefresh" title="Обновить данные">
          <template #lucidicon>
            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isRefreshing }" />
          </template>
        </GradientButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Calendar, ChevronDown, Check, RefreshCw, Badge } from 'lucide-vue-next'
import GradientButton from '../common-ui/GradientButton.vue'

const props = defineProps<{
  period: string
  status: string
}>()

const emit = defineEmits<{
  (e: 'filter-change', payload: { period: string; status: string }): void
  (e: 'refresh'): void
}>()

const localPeriod = ref(props.period)
const localStatus = ref(props.status)
const isRefreshing = ref(false)
const isPeriodOpen = ref(false)
const isStatusOpen = ref(false)

const periodDropdownRef = ref<HTMLElement | null>(null)
const statusDropdownRef = ref<HTMLElement | null>(null)

const periodOptions = [
  { value: '7', label: '7 дней', icon: '' },
  { value: '14', label: '14 дней', icon: '' },
  { value: '30', label: '30 дней', icon: '' },
]

const statusOptions = [
  { value: 'all', label: 'Все статусы', icon: '' },
  { value: 'Open', label: 'Open (Открытые)', icon: '' },
  { value: 'In Progress', label: 'In Progress (В работе)', icon: '' },
  { value: 'Done', label: 'Done (Завершённые)', icon: '' },
]

const periodLabel = computed(() => {
  return periodOptions.find((opt) => opt.value === localPeriod.value)?.label || '7 дней'
})

const statusLabel = computed(() => {
  return statusOptions.find((opt) => opt.value === localStatus.value)?.label || 'Все статусы'
})

const selectedPeriodIcon = computed(() => {
  return periodOptions.find((opt) => opt.value === localPeriod.value)?.icon || ''
})

const selectedStatusIcon = computed(() => {
  return statusOptions.find((opt) => opt.value === localStatus.value)?.icon || ''
})

const togglePeriodDropdown = () => {
  isPeriodOpen.value = !isPeriodOpen.value
  if (isStatusOpen.value) isStatusOpen.value = false
}

const toggleStatusDropdown = () => {
  isStatusOpen.value = !isStatusOpen.value
  if (isPeriodOpen.value) isPeriodOpen.value = false
}

const selectPeriod = (value: string) => {
  localPeriod.value = value
  isPeriodOpen.value = false
  emitFilterChange()
}

const selectStatus = (value: string) => {
  localStatus.value = value
  isStatusOpen.value = false
  emitFilterChange()
}

const emitFilterChange = () => {
  emit('filter-change', {
    period: localPeriod.value,
    status: localStatus.value,
  })
}

const handleRefresh = async () => {
  isRefreshing.value = true
  emit('refresh')
  setTimeout(() => {
    isRefreshing.value = false
  }, 500)
}

// Закрытие дропдаунов при клике вне
const handleClickOutside = (event: MouseEvent) => {
  if (periodDropdownRef.value && !periodDropdownRef.value.contains(event.target as Node)) {
    isPeriodOpen.value = false
  }
  if (statusDropdownRef.value && !statusDropdownRef.value.contains(event.target as Node)) {
    isStatusOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
