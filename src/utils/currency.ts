/**
 * Nigerian Naira currency formatter
 * Uses en-NG locale for proper formatting
 */

export function formatCurrency(amount: number, options?: {
  showSymbol?: boolean
  showDecimals?: boolean
  compact?: boolean
}): string {
  const {
    showSymbol = true,
    showDecimals = true,
    compact = false,
  } = options ?? {}

  if (compact && Math.abs(amount) >= 1000) {
    if (Math.abs(amount) >= 1000000) {
      return `${showSymbol ? '₦' : ''}${(amount / 1000000).toFixed(1)}M`
    }
    return `${showSymbol ? '₦' : ''}${(amount / 1000).toFixed(1)}K`
  }

  const formatter = new Intl.NumberFormat('en-NG', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'NGN',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })

  return formatter.format(amount)
}

export function parseCurrency(value: string): number {
  // Remove currency symbol, commas, and whitespace
  const cleaned = value.replace(/[₦,\s]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

export function formatCurrencyCompact(amount: number): string {
  return formatCurrency(amount, { compact: true })
}

export function formatAmountWithSeparator(amount: number): string {
  return new Intl.NumberFormat('en-NG').format(amount)
}