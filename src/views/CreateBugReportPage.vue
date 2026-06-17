<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-4">
          <button
            @click="$router.push('/dashboard')"
            class="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft class="w-5 h-5 text-gray-600" />
          </button>
          <div class="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
            <Bug class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Создание баг-репорта</h1>
            <p class="text-sm text-gray-500 mt-0.5">
              Заполните форму для создания нового отчёта об ошибке
            </p>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl transform transition-all">
          <div class="text-center">
            <div class="bg-green-100 p-3 rounded-full inline-flex mb-4">
              <CheckCircle class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Баг-репорт создан!</h3>
            <p class="text-gray-600 mb-6">
              Ваш отчёт об ошибке успешно создан и добавлен в дашборд.
            </p>
            <div class="flex gap-3">
              <button
                @click="createAnother"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Создать ещё
              </button>
              <button
                @click="goToDashboard"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                К дашборду
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="p-6 md:p-8">
          <BugForm
            :is-loading="bugStore.isLoading"
            :error="bugStore.error"
            @submit="handleSubmit"
          />
        </div>
      </div>

      <!-- Info Card -->
      <div class="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <div class="flex items-start gap-3">
          <Info class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div class="text-sm text-gray-700">
            <p class="font-medium mb-1">Советы по созданию качественного баг-репорта:</p>
            <ul class="list-disc list-inside space-y-1 text-gray-600">
              <li>Опишите шаги для воспроизведения проблемы</li>
              <li>Укажите ожидаемое и фактическое поведение</li>
              <li>Добавьте скриншоты или логи (если есть)</li>
              <li>Выберите правильную категорию и приоритет</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBugStore } from '@/stores/bugStore'
import { ArrowLeft, Bug, CheckCircle, Info } from 'lucide-vue-next'
import BugForm from '@/components/bugs/BugForm.vue'
import type { BugFormData } from '@/types/bug.types'

const router = useRouter()
const bugStore = useBugStore()
const showSuccessModal = ref(false)

const handleSubmit = async (data: BugFormData) => {
  const result = await bugStore.createBug(data)

  if (result.success) {
    showSuccessModal.value = true
  }
}

const createAnother = () => {
  showSuccessModal.value = false
  bugStore.clearLastCreatedBug()
  // Обновляем страницу для сброса формы
  router.go(0)
}

const goToDashboard = () => {
  showSuccessModal.value = false
  router.push('/dashboard')
}
</script>
