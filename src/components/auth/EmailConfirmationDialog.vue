<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all">
      <div class="text-center">
        <div class="bg-yellow-100 p-3 rounded-full inline-flex mb-4">
          <Mail class="w-8 h-8 text-yellow-600" />
        </div>

        <h3 class="text-xl font-bold text-gray-900 mb-2">Подтверждение email</h3>

        <p class="text-gray-600 mb-4">
          Мы отправили письмо с ссылкой для подтверждения на адрес
          <strong class="text-blue-600">{{ email }}</strong>
        </p>

        <div class="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <p class="text-sm text-blue-800">📧 Что делать?</p>
          <ul class="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
            <li>Откройте письмо от Supabase Auth</li>
            <li>Нажмите на ссылку подтверждения</li>
            <li>Вернитесь и войдите в аккаунт</li>
          </ul>
        </div>

        <div class="space-y-3">
          <button
            @click="handleResend"
            :disabled="isResending"
            class="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all disabled:opacity-50"
          >
            <span v-if="!isResending">Отправить письмо повторно</span>
            <div v-else class="flex items-center justify-center gap-2">
              <Loader2 class="w-4 h-4 animate-spin" />
              <span>Отправка...</span>
            </div>
          </button>

          <button
            @click="handleClose"
            class="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            Закрыть
          </button>
        </div>

        <div v-if="resendSuccess" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-green-700 text-sm">✅ Письмо отправлено! Проверьте ваш почтовый ящик</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Mail, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps<{
  show: boolean
  email: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirmed'): void
}>()

const authStore = useAuthStore()
const isResending = ref(false)
const resendSuccess = ref(false)

const handleResend = async () => {
  isResending.value = true
  resendSuccess.value = false

  const result = await authStore.resendConfirmationEmail(props.email)

  if (result.success) {
    resendSuccess.value = true
    setTimeout(() => {
      resendSuccess.value = false
    }, 3000)
  }

  isResending.value = false
}

const handleClose = () => {
  emit('close')
}

// Проверяем, не подтвердил ли пользователь email
let checkInterval: NodeJS.Timeout

watch(
  () => props.show,
  (isShown) => {
    if (isShown) {
      // Проверяем каждые 3 секунды, не подтвердил ли пользователь email
      checkInterval = setInterval(async () => {
        const {
          data: { session },
        } = await authStore.initAuth()
        if (session?.user?.email_confirmed_at) {
          clearInterval(checkInterval)
          emit('confirmed')
        }
      }, 3000)
    } else {
      if (checkInterval) clearInterval(checkInterval)
    }
  },
)
</script>
