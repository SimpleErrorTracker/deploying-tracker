export interface User {
  id: string
  email: string
  name: string
  password?: string
  createdAt: Date
  lastLogin?: Date
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ValidationError {
  field: string
  message: string
}
