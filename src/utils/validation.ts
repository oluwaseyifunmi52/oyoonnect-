/**
 * Validation utilities for bills/services forms
 */

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validatePhoneNumber(phone: string, network?: string): ValidationResult {
  const errors: Record<string, string> = {}

  if (!phone.trim()) {
    errors.phone = 'Phone number is required'
    return { isValid: false, errors }
  }

  // Nigerian phone number format: +234XXXXXXXXXX, 0XXXXXXXXXX, 234XXXXXXXXXX
  const phoneRegex = /^(\+234|234|0)[789]\d{9}$/

  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    errors.phone = 'Enter a valid Nigerian phone number (e.g., +234 XXX XXX XXXX)'
    return { isValid: false, errors }
  }

  // Network-specific validation
  if (network) {
    const networkPrefixes: Record<string, string[]> = {
      mtn: ['0803', '0806', '0703', '0706', '0813', '0816', '0810', '0814', '0903', '0906', '0913', '0916'],
      airtel: ['0802', '0808', '0812', '0708', '0902', '0907', '0901', '0904'],
      glo: ['0805', '0807', '0811', '0815', '0705', '0905', '0915'],
      '9mobile': ['0809', '0817', '0818', '0908', '0909'],
    }

    const prefixes = networkPrefixes[network.toLowerCase()]
    if (prefixes) {
      const normalizedPhone = phone.replace(/\s/g, '').replace(/^(\+234|234)/, '0')
      const prefix = normalizedPhone.substring(0, 4)
      if (!prefixes.includes(prefix)) {
        errors.phone = `This number doesn't appear to be a ${network.toUpperCase()} number`
        return { isValid: false, errors }
      }
    }
  }

  return { isValid: true, errors }
}

export function validateMeterNumber(meter: string): ValidationResult {
  const errors: Record<string, string> = {}

  if (!meter.trim()) {
    errors.meter = 'Meter number is required'
    return { isValid: false, errors }
  }

  // Meter numbers are typically 11-13 digits
  if (!/^\d{11,13}$/.test(meter.trim())) {
    errors.meter = 'Enter a valid meter number (11-13 digits)'
    return { isValid: false, errors }
  }

  return { isValid: true, errors }
}

export function validateEmail(email: string): ValidationResult {
  const errors: Record<string, string> = {}

  if (!email.trim()) {
    errors.email = 'Email is required'
    return { isValid: false, errors }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    errors.email = 'Enter a valid email address'
    return { isValid: false, errors }
  }

  return { isValid: true, errors }
}

export function validateAmount(amount: string | number, min = 100, max = 1000000): ValidationResult {
  const errors: Record<string, string> = {}
  const num = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(num)) {
    errors.amount = 'Enter a valid amount'
    return { isValid: false, errors }
  }

  if (num < min) {
    errors.amount = `Minimum amount is ${min.toLocaleString()}`
    return { isValid: false, errors }
  }

  if (num > max) {
    errors.amount = `Maximum amount is ${max.toLocaleString()}`
    return { isValid: false, errors }
  }

  return { isValid: true, errors }
}

export function validateSmartCardNumber(card: string): ValidationResult {
  const errors: Record<string, string> = {}

  if (!card.trim()) {
    errors.smartCard = 'Smart card/IUC number is required'
    return { isValid: false, errors }
  }

  // DSTV/GOtv/Startimes smart card numbers are typically 10-20 digits
  if (!/^\d{10,20}$/.test(card.trim())) {
    errors.smartCard = 'Enter a valid smart card/IUC number (10-20 digits)'
    return { isValid: false, errors }
  }

  return { isValid: true, errors }
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  const errors: Record<string, string> = {}

  if (!value.trim()) {
    errors[fieldName] = `${fieldName} is required`
    return { isValid: false, errors }
  }

  return { isValid: true, errors }
}

export function combineValidations(...results: ValidationResult[]): ValidationResult {
  const errors: Record<string, string> = {}
  let isValid = true

  for (const result of results) {
    if (!result.isValid) {
      isValid = false
      Object.assign(errors, result.errors)
    }
  }

  return { isValid, errors }
}

export function validateTransactionPin(pin: string): ValidationResult {
  const errors: Record<string, string> = {}

  if (!pin.trim()) {
    errors.pin = 'Transaction PIN is required'
    return { isValid: false, errors }
  }

  if (!/^\d{4,6}$/.test(pin.trim())) {
    errors.pin = 'PIN must be 4-6 digits'
    return { isValid: false, errors }
  }

  return { isValid: true, errors }
}

export function validateUrl(url: string): ValidationResult {
  const errors: Record<string, string> = {}

  if (!url.trim()) {
    errors.url = 'URL is required'
    return { isValid: false, errors }
  }

  try {
    new URL(url)
  } catch {
    errors.url = 'Enter a valid URL (e.g., https://instagram.com/username)'
    return { isValid: false, errors }
  }

  return { isValid: true, errors }
}