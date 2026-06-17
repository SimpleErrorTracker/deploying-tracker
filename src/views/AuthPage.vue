<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4"
          >
            <Database class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Добро пожаловать</h1>
          <p class="text-gray-600 mt-2">Войдите или создайте аккаунт</p>
        </div>

        <!-- Вкладки -->
        <div class="flex justify-center gap-4 mb-6 border-b border-gray-200">
          <button
            @click="activeTab = 'login'"
            class="pb-3 px-4 font-medium transition-all relative"
            :class="
              activeTab === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            Вход
          </button>
          <button
            @click="activeTab = 'register'"
            class="pb-3 px-4 font-medium transition-all relative"
            :class="
              activeTab === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            "
          >
            Регистрация
          </button>
        </div>

        <!-- Сообщение о необходимости подтверждения email -->
        <div
          v-if="authStore.needsEmailConfirmation"
          class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <div class="flex items-start gap-2">
            <Mail class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div class="text-sm text-yellow-800">
              <p class="font-medium">Подтвердите email</p>
              <p>
                На {{ authStore.confirmationEmail }} отправлено письмо с ссылкой для подтверждения
              </p>
            </div>
          </div>
        </div>

        <!-- Форма входа -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="loginForm.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              v-model="loginForm.password"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
          >
            <span v-if="!authStore.isLoading">Войти</span>
            <div v-else class="flex items-center justify-center gap-2">
              <Loader2 class="w-5 h-5 animate-spin" />
              <span>Вход...</span>
            </div>
          </button>
        </form>

        <!-- Форма регистрации -->
        <form v-else @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <input
              v-model="registerForm.fullName"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Иван Иванов"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="registerForm.email"
              type="email"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              v-model="registerForm.password"
              type="password"
              required
              minlength="6"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••"
            />
            <p class="text-xs text-gray-500 mt-1">Минимум 6 символов</p>
          </div>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50"
          >
            <span v-if="!authStore.isLoading">Зарегистрироваться</span>
            <div v-else class="flex items-center justify-center gap-2">
              <Loader2 class="w-5 h-5 animate-spin" />
              <span>Регистрация...</span>
            </div>
          </button>
        </form>

        <!-- Сообщение об ошибке -->
        <div v-if="authStore.error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 text-sm">{{ authStore.error }}</p>
        </div>
      </div>
      <div class="mt-6 text-center text-sm text-gray-500">
        <p class="mb-2">Тестовый аккаунт:</p>
        <div class="bg-white rounded-lg p-3 inline-block">
          <code class="text-xs">test@example.com / passwordTEST_123</code>
        </div>
      </div>
    </div>

    <!-- Диалог подтверждения email -->
    <EmailConfirmationDialog
      :show="showConfirmationDialog"
      :email="pendingEmail"
      @close="showConfirmationDialog = false"
      @confirmed="onEmailConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Database, Loader2, Mail } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import EmailConfirmationDialog from '@/components/auth/EmailConfirmationDialog.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeTab = ref<'login' | 'register'>(route.query.tab === 'register' ? 'register' : 'login')

const showConfirmationDialog = ref(false)
const pendingEmail = ref('')

const loginForm = ref({
  email: '',
  password: '',
})

const registerForm = ref({
  fullName: '',
  email: '',
  password: '',
})

const handleLogin = async () => {
  const result = await authStore.signIn(loginForm.value.email, loginForm.value.password)
  if (result.success) {
    router.push('/dashboard')
  }
}

const handleRegister = async () => {
  const result = await authStore.signUp(
    registerForm.value.email,
    registerForm.value.password,
    registerForm.value.fullName,
  )

  if (result.success) {
    if (result.needsConfirmation) {
      // Показываем диалог подтверждения
      pendingEmail.value = registerForm.value.email
      showConfirmationDialog.value = true
      registerForm.value = { fullName: '', email: '', password: '' }
    } else {
      alert('Регистрация успешна! Теперь вы можете войти.')
      activeTab.value = 'login'
      registerForm.value = { fullName: '', email: '', password: '' }
    }
  }
}

const onEmailConfirmed = () => {
  showConfirmationDialog.value = false
  authStore.needsEmailConfirmation = false
  alert('Email подтверждён! Теперь вы можете войти в аккаунт.')
  activeTab.value = 'login'
  loginForm.value.email = pendingEmail.value
  pendingEmail.value = ''
}

onMounted(() => {
  authStore.initAuth()
})
</script>
