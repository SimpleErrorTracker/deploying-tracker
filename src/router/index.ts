import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/LandingPage.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthPage.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/bugs',
      name: 'bugs-list',
      component: () => import('@/views/BugsListPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/create-bug',
      name: 'create-bug',
      component: () => import('@/views/CreateBugReportPage.vue'),
      meta: { requiresAuth: true },
    },
    // обработка 404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Ждём инициализации
  if (!authStore.isInitialized) {
    await authStore.initAuth()
  }

  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
