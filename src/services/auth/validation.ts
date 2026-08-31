export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '')
  if (cleaned.startsWith('+234')) {
    return cleaned.slice(1)
  }
  if (cleaned.startsWith('234')) {
    return cleaned
  }
  if (cleaned.startsWith('0')) {
    return '234' + cleaned.slice(1)
  }
  return cleaned
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

export function isValidNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '')
  const regex = /^(\+234|234|0)[789]\d{9}$/
  return regex.test(cleaned)
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Za-z]/.test(password)) return 'Password must include at least one letter'
  if (!/\d/.test(password)) return 'Password must include at least one number'
  return null
}
