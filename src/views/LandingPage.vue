<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-gray-900/[0.02] bg-[size:20px_20px]"></div>

      <div class="relative max-w-7xl mx-auto px-4 py-20">
        <!-- Header -->
        <div class="flex justify-between items-center mb-16">
          <div class="flex items-center gap-2">
            <div class="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg">
              <Bug class="w-6 h-6 text-white" />
            </div>
            <span class="text-xl font-bold text-gray-900">ErrorTracker</span>
          </div>

          <div class="flex gap-3">
            <router-link
              to="/auth"
              class="px-5 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            >
              Войти
            </router-link>
            <GradientButton title="Начать" link="/auth?tab=register" />
          </div>
        </div>

        <!-- Hero Content -->
        <div class="text-center">
          <div
            class="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm mb-6"
          >
            <Sparkles class="w-4 h-4" />
            <span>Отслеживание и управление багами</span>
          </div>

          <h1 class="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Отслеживайте ошибки
            <span
              class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              эффективно
            </span>
          </h1>

          <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Централизованное управление баг-репортами, аналитика качества и командная работа над
            исправлением ошибок
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <div>
              <GradientButton title="Начать бесплатно" link="/auth?tab=register" />
            </div>
            <a
              href="#features"
              class="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition-all"
            >
              Узнать больше
            </a>
          </div>
        </div>

        <!-- Dashboard Preview -->
        <div class="mt-20 relative">
          <div
            class="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent blur-3xl"
          ></div>
          <div
            class="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
          >
            <div class="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
              <div class="w-3 h-3 rounded-full bg-red-500"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div class="w-3 h-3 rounded-full bg-green-500"></div>
              <div class="text-sm text-gray-500 ml-2">ErrorTracker Dashboard</div>
            </div>
            <img
              src="https://placehold.co/1200x600/1e293b/ffffff?text=Dashboard+Preview"
              alt="Dashboard Preview"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="bg-white py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Возможности платформы</h2>
          <p class="text-xl text-gray-600">Всё необходимое для эффективного управления качеством</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center p-6 rounded-2xl hover:shadow-lg transition-all">
            <div class="bg-blue-100 p-3 rounded-2xl inline-block mb-4">
              <PlusCircle class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Создание багов</h3>
            <p class="text-gray-600">
              Быстрое создание баг-репортов с детальным описанием и приоритетами
            </p>
          </div>

          <div class="text-center p-6 rounded-2xl hover:shadow-lg transition-all">
            <div class="bg-purple-100 p-3 rounded-2xl inline-block mb-4">
              <List class="w-8 h-8 text-purple-600" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Умные фильтры</h3>
            <p class="text-gray-600">
              Фильтрация и сортировка по категориям, приоритетам и статусам
            </p>
          </div>

          <div class="text-center p-6 rounded-2xl hover:shadow-lg transition-all">
            <div class="bg-green-100 p-3 rounded-2xl inline-block mb-4">
              <BarChart3 class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-xl font-semibold mb-2">Аналитика</h3>
            <p class="text-gray-600">Детальная аналитика качества и динамика исправления ошибок</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
      <div class="max-w-4xl mx-auto text-center px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Готовы начать?</h2>
        <p class="text-xl text-blue-100 mb-8">
          Присоединяйтесь к командам, которые уже используют ErrorTracker
        </p>
        <router-link
          to="/auth?tab=register"
          class="inline-block px-8 py-3 bg-white text-blue-600 rounded-xl font-medium hover:bg-gray-100 transition-all shadow-lg"
        >
          Создать аккаунт
        </router-link>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-12">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p>© 2024 ErrorTracker. Все права защищены.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import GradientButton from '@/components/common-ui/GradientButton.vue'
import { Bug, Sparkles, PlusCircle, List, BarChart3 } from 'lucide-vue-next'
</script>
