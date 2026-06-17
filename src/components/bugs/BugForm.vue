<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Описание ошибки -->
    <BugFormField label="Описание ошибки" required :error="errors.description">
      <div class="relative">
        <div class="absolute top-3 left-3 text-gray-400">
          <FileText class="w-5 h-5" />
        </div>
        <textarea
          v-model="formData.description"
          rows="6"
          class="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
          :class="{ 'border-red-500 focus:ring-red-500': errors.description }"
          placeholder="Опишите проблему подробно...&#10;&#10;Пример:&#10;1. Шаги для воспроизведения&#10;2. Ожидаемое поведение&#10;3. Фактическое поведение"
        ></textarea>
      </div>
    </BugFormField>

    <!-- Категория -->
    <BugFormField label="Категория" required :error="errors.category">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          v-for="category in categories"
          :key="category.value"
          type="button"
          @click="formData.category = category.value"
          class="p-3 rounded-xl border-2 transition-all text-left group"
          :class="[
            formData.category === category.value
              ? category.selectedClass
              : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md',
          ]"
        >
          <div class="flex items-center gap-3">
            <div
              class="p-2 rounded-lg transition-colors"
              :class="
                formData.category === category.value
                  ? category.iconBgSelected
                  : 'bg-gray-100 group-hover:bg-gray-200'
              "
            >
              <component :is="category.icon" class="w-5 h-5" :class="category.iconClass" />
            </div>
            <div class="flex-1">
              <p
                class="font-semibold text-sm"
                :class="formData.category === category.value ? category.textClass : 'text-gray-700'"
              >
                {{ category.label }}
              </p>
              <p class="text-xs text-gray-500 mt-0.5">{{ category.description }}</p>
            </div>
            <Check v-if="formData.category === category.value" class="w-4 h-4 text-green-600" />
          </div>
        </button>
      </div>
    </BugFormField>

    <!-- Приоритет -->
    <BugFormField label="Приоритет" required :error="errors.priority">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          v-for="priority in priorities"
          :key="priority.value"
          type="button"
          @click="formData.priority = priority.value"
          class="p-3 rounded-xl border-2 transition-all text-left group"
          :class="[
            formData.priority === priority.value
              ? priority.selectedClass
              : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md',
          ]"
        >
          <div class="flex items-center gap-3">
            <div
              class="p-2 rounded-lg transition-colors"
              :class="
                formData.priority === priority.value
                  ? priority.iconBgSelected
                  : 'bg-gray-100 group-hover:bg-gray-200'
              "
            >
              <component :is="priority.icon" class="w-5 h-5" :class="priority.iconClass" />
            </div>
            <div class="flex-1">
              <p
                class="font-semibold text-sm"
                :class="formData.priority === priority.value ? priority.textClass : 'text-gray-700'"
              >
                {{ priority.label }}
              </p>
              <p class="text-xs text-gray-500 mt-0.5">{{ priority.description }}</p>
            </div>
            <Check v-if="formData.priority === priority.value" class="w-4 h-4 text-green-600" />
          </div>
        </button>
      </div>
    </BugFormField>

    <!-- Предпросмотр -->
    <BugPreview :bug-data="formData" />

    <!-- Кнопки -->
    <div class="flex flex-col sm:flex-row gap-3 pt-4">
      <button
        type="submit"
        :disabled="isLoading"
        class="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        <div v-if="!isLoading" class="flex items-center justify-center gap-2">
          <Bug class="w-5 h-5" />
          <span>Создать баг-репорт</span>
        </div>
        <div v-else class="flex items-center justify-center gap-2">
          <Loader2 class="w-5 h-5 animate-spin" />
          <span>Создание...</span>
        </div>
      </button>

      <button
        type="button"
        @click="$router.push('/dashboard')"
        class="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all"
      >
        Отмена
      </button>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <div class="flex items-start gap-3">
        <AlertCircle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <p class="text-red-700 text-sm">{{ error }}</p>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import {
  FileText,
  Check,
  Bug,
  Loader2,
  AlertCircle,
  Lock,
  Database,
  Palette,
  Wifi,
  ArrowUp,
  Minus,
  ArrowDown,
  Skull,
} from 'lucide-vue-next'
import BugFormField from './BugFormField.vue'
import BugPreview from './BugPreview.vue'
import type { BugFormData, ValidationErrors } from '@/types/bug.types'

const props = defineProps<{
  isLoading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  (e: 'submit', data: BugFormData): void
}>()

const formData = reactive<BugFormData>({
  description: '',
  category: 'UI',
  priority: 'medium',
})

const errors = reactive<ValidationErrors>({})

const categories = [
  {
    value: 'Authentication' as const,
    label: 'Авторизация',
    icon: Lock,
    description: 'Вход, регистрация, права доступа',
    selectedClass: 'border-purple-500 bg-purple-50 shadow-md',
    iconBgSelected: 'bg-purple-100',
    iconClass: 'text-purple-700',
    textClass: 'text-purple-900',
  },
  {
    value: 'DB' as const,
    label: 'База данных',
    icon: Database,
    description: 'Запросы, сохранение, кэш',
    selectedClass: 'border-yellow-500 bg-yellow-50 shadow-md',
    iconBgSelected: 'bg-yellow-100',
    iconClass: 'text-yellow-700',
    textClass: 'text-yellow-900',
  },
  {
    value: 'UI' as const,
    label: 'Интерфейс',
    icon: Palette,
    description: 'Вёрстка, адаптивность, стили',
    selectedClass: 'border-green-500 bg-green-50 shadow-md',
    iconBgSelected: 'bg-green-100',
    iconClass: 'text-green-700',
    textClass: 'text-green-900',
  },
  {
    value: 'Network' as const,
    label: 'Сеть',
    icon: Wifi,
    description: 'API, таймауты, CORS',
    selectedClass: 'border-blue-500 bg-blue-50 shadow-md',
    iconBgSelected: 'bg-blue-100',
    iconClass: 'text-blue-700',
    textClass: 'text-blue-900',
  },
]

const priorities = [
  {
    value: 'low' as const,
    label: 'Низкий',
    icon: ArrowDown,
    description: 'Косметические проблемы',
    selectedClass: 'border-green-500 bg-green-50',
    iconBgSelected: 'bg-green-100',
    iconClass: 'text-green-700',
    textClass: 'text-green-900',
  },
  {
    value: 'medium' as const,
    label: 'Средний',
    icon: Minus,
    description: 'Не критично, но нужно исправить',
    selectedClass: 'border-yellow-500 bg-yellow-50',
    iconBgSelected: 'bg-yellow-100',
    iconClass: 'text-yellow-700',
    textClass: 'text-yellow-900',
  },
  {
    value: 'high' as const,
    label: 'Высокий',
    icon: ArrowUp,
    description: 'Серьёзные проблемы',
    selectedClass: 'border-orange-500 bg-orange-50',
    iconBgSelected: 'bg-orange-100',
    iconClass: 'text-orange-700',
    textClass: 'text-orange-900',
  },
  {
    value: 'critical' as const,
    label: 'Критический',
    icon: Skull,
    description: 'Блокирует работу',
    selectedClass: 'border-red-500 bg-red-50',
    iconBgSelected: 'bg-red-100',
    iconClass: 'text-red-700',
    textClass: 'text-red-900',
  },
]

const validateForm = (): boolean => {
  let isValid = true

  // Валидация описания
  if (!formData.description.trim()) {
    errors.description = 'Описание обязательно'
    isValid = false
  } else if (formData.description.length < 10) {
    errors.description = 'Описание должно содержать минимум 10 символов'
    isValid = false
  } else if (formData.description.length > 1000) {
    errors.description = 'Описание не должно превышать 1000 символов'
    isValid = false
  } else {
    errors.description = undefined
  }

  // Валидация категории
  if (!formData.category) {
    errors.category = 'Выберите категорию'
    isValid = false
  } else {
    errors.category = undefined
  }

  // Валидация приоритета
  if (!formData.priority) {
    errors.priority = 'Выберите приоритет'
    isValid = false
  } else {
    errors.priority = undefined
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', formData)
  }
}
</script>

<style scoped>
/* анимации для кнопок */
button {
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.98);
}

/* для текстового поля */
textarea {
  font-family: inherit;
  line-height: 1.5;
}

textarea:focus {
  outline: none;
}

/* скролл для textarea */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
