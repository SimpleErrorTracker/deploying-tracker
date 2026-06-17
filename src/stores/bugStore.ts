import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './authStore'
import type { Bug, CreateBugDTO } from '@/types/bug.types'
import { getErrorMessage } from '@/utils/getErrorMessage'

interface BugState {
  bugs: Bug[]
  isLoading: boolean
  error: string | null
  totalCount: number
}

export const useBugStore = defineStore('bug', {
  state: (): BugState => ({
    bugs: [],
    isLoading: false,
    error: null,
    totalCount: 0,
  }),

  getters: {
    statistics: (state) => {
      return {
        total: state.bugs.length,
        open: state.bugs.filter((b) => b.status === 'Open').length,
        inProgress: state.bugs.filter((b) => b.status === 'In Progress').length,
        done: state.bugs.filter((b) => b.status === 'Done').length,
        critical: state.bugs.filter((b) => b.priority === 'critical').length,
        high: state.bugs.filter((b) => b.priority === 'high').length,
      }
    },

    getBugById: (state) => (id: string) => {
      return state.bugs.find((bug) => bug.id === id)
    },
  },

  actions: {
    async fetchBugs() {
      this.isLoading = true
      this.error = null

      try {
        const authStore = useAuthStore()

        let query = supabase.from('bugs').select('*').order('created_at', { ascending: false })

        // Если пользователь не админ, показываем только его баги
        // Для админа можно добавить проверку роли
        if (!authStore.user?.user_metadata?.is_admin) {
          query = query.eq('author_id', authStore.userId!)
        }

        const { data, error } = await query

        if (error) throw error

        this.bugs = data as Bug[]
        this.totalCount = this.bugs.length
      } catch (error: unknown) {
        this.error = getErrorMessage(error)
      } finally {
        this.isLoading = false
      }
    },

    async createBug(bugData: CreateBugDTO) {
      this.isLoading = true
      this.error = null

      try {
        const authStore = useAuthStore()

        const { data, error } = await supabase
          .from('bugs')
          .insert({
            description: bugData.description,
            category: bugData.category,
            priority: bugData.priority,
            status: 'Open',
            author_id: authStore.userId,
            author_name: authStore.userName,
          })
          .select()
          .single()

        if (error) throw error

        this.bugs.unshift(data as Bug)
        this.totalCount = this.bugs.length

        return { success: true, bug: data }
      } catch (error: any) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async updateBug(id: string, updates: Partial<Bug>) {
      this.isLoading = true
      this.error = null

      try {
        const { data, error } = await supabase
          .from('bugs')
          .update(updates)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        const index = this.bugs.findIndex((b) => b.id === id)
        if (index !== -1) {
          this.bugs[index] = data as Bug
        }

        return { success: true, bug: data }
      } catch (error: any) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async deleteBug(id: string) {
      this.isLoading = true
      this.error = null

      try {
        const { error } = await supabase.from('bugs').delete().eq('id', id)

        if (error) throw error

        this.bugs = this.bugs.filter((b) => b.id !== id)
        this.totalCount = this.bugs.length

        return { success: true }
      } catch (error: any) {
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.isLoading = false
      }
    },

    async updateBugStatus(id: string, status: Bug['status']) {
      return this.updateBug(id, { status })
    },
  },
})
