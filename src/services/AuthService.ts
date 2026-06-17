import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '@/types/auth.types'

// Тестовый аккаунт
const TEST_USER = {
  id: '1',
  email: 'test@example.com',
  password: 'passwordTEST_123',
  name: 'Тестовый Пользователь',
  createdAt: new Date('2024-01-01'),
}

const users = new Map<string, User>([[TEST_USER.email, TEST_USER]])

class AuthService {
  private readonly TOKEN_KEY = 'auth_token'
  private readonly USER_KEY = 'auth_user'

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const user = users.get(credentials.email)

    if (!user) {
      throw new Error('Пользователь с таким email не найден')
    }

    if (user.password !== credentials.password) {
      throw new Error('Неверный пароль')
    }

    const { password: _password, ...userWithoutPassword } = user
    const token = this.generateToken(userWithoutPassword)

    const response: AuthResponse = {
      user: { ...userWithoutPassword, lastLogin: new Date() },
      token,
    }

    this.saveAuthData(response)
    return response
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await this.delay(800)

    // Проверка существующего пользователя
    if (users.has(credentials.email)) {
      throw new Error('Пользователь с таким email уже существует')
    }

    // Создание нового пользователя
    const newUser = {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.name,
      password: credentials.password,
      createdAt: new Date(),
    }

    users.set(credentials.email, newUser)

    const { password: _password, ...userWithoutPassword } = newUser
    const token = this.generateToken(userWithoutPassword)

    const response: AuthResponse = {
      user: userWithoutPassword,
      token,
    }

    this.saveAuthData(response)
    return response
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }

  checkAuth(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY)
    if (!userStr) return null

    try {
      const user = JSON.parse(userStr)
      return user
    } catch {
      return null
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  private saveAuthData(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token)
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user))
  }

  private generateToken(user: Omit<User, 'password'>): string {
    // В реальном приложении здесь будет JWT
    return btoa(JSON.stringify({ userId: user.id, email: user.email, exp: Date.now() + 86400000 }))
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export default new AuthService()
