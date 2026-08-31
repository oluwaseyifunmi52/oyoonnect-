export interface NigerianBank {
  name: string
  code: string
  slug: string
}

export const nigerianBanks: NigerianBank[] = [
  { name: 'Access Bank', code: '044', slug: 'access-bank' },
  { name: 'Citibank Nigeria', code: '023', slug: 'citibank-nigeria' },
  { name: 'Diamond Bank', code: '063', slug: 'diamond-bank' },
  { name: 'Ecobank Nigeria', code: '050', slug: 'ecobank-nigeria' },
  { name: 'Enterprise Bank', code: '084', slug: 'enterprise-bank' },
  { name: 'Fidelity Bank', code: '070', slug: 'fidelity-bank' },
  { name: 'First Bank of Nigeria', code: '011', slug: 'first-bank-of-nigeria' },
  { name: 'First City Monument Bank', code: '214', slug: 'first-city-monument-bank' },
  { name: 'Guaranty Trust Bank', code: '058', slug: 'guaranty-trust-bank' },
  { name: 'Heritage Bank', code: '030', slug: 'heritage-bank' },
  { name: 'Jaiz Bank', code: '301', slug: 'jaiz-bank' },
  { name: 'Keystone Bank', code: '082', slug: 'keystone-bank' },
  { name: 'Mainstreet Bank', code: '014', slug: 'mainstreet-bank' },
  { name: 'Polaris Bank', code: '076', slug: 'polaris-bank' },
  { name: 'Providus Bank', code: '101', slug: 'providus-bank' },
  { name: 'Stanbic IBTC Bank', code: '221', slug: 'stanbic-ibtc-bank' },
  { name: 'Standard Chartered Bank', code: '068', slug: 'standard-chartered-bank' },
  { name: 'Sterling Bank', code: '232', slug: 'sterling-bank' },
  { name: 'SunTrust Bank', code: '100', slug: 'suntrust-bank' },
  { name: 'Union Bank of Nigeria', code: '032', slug: 'union-bank-of-nigeria' },
  { name: 'United Bank for Africa', code: '033', slug: 'united-bank-for-africa' },
  { name: 'Unity Bank', code: '215', slug: 'unity-bank' },
  { name: 'Wema Bank', code: '035', slug: 'wema-bank' },
  { name: 'Zenith Bank', code: '057', slug: 'zenith-bank' },
]

export function getBankByCode(code: string): NigerianBank | undefined {
  return nigerianBanks.find((bank) => bank.code === code)
}

export function getBankByName(name: string): NigerianBank | undefined {
  return nigerianBanks.find((bank) => bank.name.toLowerCase() === name.toLowerCase())
}

export function getBankOptions(): { value: string; label: string }[] {
  return nigerianBanks.map((bank) => ({ value: bank.name, label: bank.name }))
}

export function validateAccountNumber(accountNumber: string): boolean {
  return /^\d{10}$/.test(accountNumber)
}

export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length < 4) return accountNumber
  const visible = accountNumber.slice(-4)
  return '•'.repeat(accountNumber.length - 4) + visible
}