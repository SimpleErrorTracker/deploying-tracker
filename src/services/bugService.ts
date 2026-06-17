import type { Bug, CreateBugDTO } from '@/types/bug.types'
import { bugs } from '@/mock/bugData'
import { useAuthStore } from '@/stores/authStore'

class BugService {
  async createBug(data: CreateBugDTO): Promise<Bug> {
    // Имитация задержки сети
    await this.delay(800)

    const authStore = useAuthStore()
    const user = authStore.user

    if (!user) {
      throw new Error('Пользователь не авторизован')
    }

    const newBug: Bug = {
      id: (bugs.length + 1).toString(),
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'Open',
      created_at: new Date().toISOString(),
      author_id: user.id,
      author_name: user.name,
    }

    // В реальном приложении здесь будет API вызов
    bugs.unshift(newBug)

    return newBug
  }

  async getAllBugs(): Promise<Bug[]> {
    await this.delay(300)
    return bugs
  }

  async getBugById(id: string): Promise<Bug | undefined> {
    await this.delay(200)

    return bugs.find((bug) => bug.id === id)
  }

  async updateBugStatus(id: string, status: Bug['status']): Promise<Bug | undefined> {
    await this.delay(500)

    const bug = bugs.find((b) => b.id === id)
    if (bug) {
      bug.status = status
      return bug
    }
    return undefined
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export default new BugService()
