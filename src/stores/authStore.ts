import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import { getErrorMessage } from '@/utils/getErrorMessage'

interface AuthState {
  user: User | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  isInitialized: boolean
  needsEmailConfirmation: boolean
  confirmationEmail: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isInitialized: false,
    needsEmailConfirmation: false,
    confirmationEmail: null,
  }),

  getters: {
    userId: (state) => state.user?.id || null,
    userEmail: (state) => state.user?.email || '',
    userName: (state) =>
      state.user?.user_metadata?.full_name || state.user?.email?.split('@')[0] || 'Пользователь',
  },

  actions: {
    async initAuth() {
      this.isLoading = true

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) throw error

        this.session = session
        this.user = session?.user || null
        this.isAuthenticated = !!session
        this.isInitialized = true

        // Слушаем изменения аутентификации
        supabase.auth.onAuthStateChange((_event, session) => {
          this.session = session
          this.user = session?.user || null
          this.isAuthenticated = !!session

          // Если пользователь подтвердил email, сбрасываем флаг
          if (session?.user?.email_confirmed_at) {
            this.needsEmailConfirmation = false
            this.confirmationEmail = null
          }
        })
      } catch (error: unknown) {
        this.error = getErrorMessage(error)
      } finally {
        this.isLoading = false
      }
    },

    async signUp(email: string, password: string, fullName: string) {
      this.isLoading = true
      this.error = null
      this.needsEmailConfirmation = false
      this.confirmationEmail = null

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              email_confirm: true,
            },
          },
        })

        if (error) throw error

        // Если пользователь создан, но email не подтверждён
        if (data.user && !data.user.email_confirmed_at) {
          this.needsEmailConfirmation = true
          this.confirmationEmail = email
          return {
            success: true,
            needsConfirmation: true,
            email,
          }
        }

        return { success: true, data }
      } catch (error: unknown) {
        this.error = getErrorMessage(error)
        return { success: false, error: getErrorMessage(error) }
      } finally {
        this.isLoading = false
      }
    },

    async resendConfirmationEmail(email: string) {
      this.isLoading = true
      this.error = null

      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email,
        })

        if (error) throw error

        return { success: true }
      } catch (error: unknown) {
        this.error = getErrorMessage(error)
        return { success: false, error: getErrorMessage(error) }
      } finally {
        this.isLoading = false
      }
    },

    async signIn(email: string, password: string) {
      this.isLoading = true
      this.error = null

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            this.needsEmailConfirmation = true
            this.confirmationEmail = email
            throw new Error('Подтвердите email перед входом. Проверьте вашу почту.')
          }
          throw error
        }

        return { success: true, data }
      } catch (error: unknown) {
        this.error = getErrorMessage(error)
        return { success: false, error: getErrorMessage(error) }
      } finally {
        this.isLoading = false
      }
    },

    async signOut() {
      this.isLoading = true

      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error

        // Очищаем все состояния
        this.user = null
        this.session = null
        this.isAuthenticated = false
        this.needsEmailConfirmation = false
        this.confirmationEmail = null

        // Очищаем localStorage
        localStorage.removeItem('supabase.auth.token')

        return { success: true }
      } catch (error: unknown) {
        console.error('Sign out error:', error)
        this.error = getErrorMessage(error)
        return { success: false, error: getErrorMessage(error) }
      } finally {
        this.isLoading = false
      }
    },
  },
})
