export interface ValidationResult {
  isValid: boolean
  error?: string
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email обязателен' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Введите корректный email' }
  }

  return { isValid: true }
}

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Пароль обязателен' }
  }

  if (password === '1111') {
    return { isValid: true } // Исключение для слабого пароля
  }

  if (password.length < 6) {
    return { isValid: false, error: 'Пароль должен содержать минимум 6 символов' }
  }

  // Проверка на сложность пароля
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return { isValid: false, error: 'Пароль должен содержать заглавные, строчные буквы и цифры' }
  }

  return { isValid: true }
}

export const validateName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, error: 'Имя обязательно' }
  }

  if (name.length < 2) {
    return { isValid: false, error: 'Имя должно содержать минимум 2 символа' }
  }

  if (name.length > 50) {
    return { isValid: false, error: 'Имя не должно превышать 50 символов' }
  }

  return { isValid: true }
}

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): ValidationResult => {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Пароли не совпадают' }
  }
  return { isValid: true }
}
