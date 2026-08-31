import type { ElectricityProvider } from '../types/bills'

export const electricityProviders: ElectricityProvider[] = [
  {
    id: 'ibedc',
    name: 'Ibadan Electricity Distribution Company',
    code: 'ibedc',
    shortName: 'IBEDC',
    logo: '/icons/electricity/ibedc.svg',
    color: '#0066CC',
    states: ['Oyo', 'Ogun', 'Kwara', 'Osun', 'Ekiti', 'Kogi'],
  },
 
]

export function getElectricityProviderById(id: string): ElectricityProvider | undefined {
  return electricityProviders.find((provider) => provider.id === id)
}

export function getElectricityProviderByCode(code: string): ElectricityProvider | undefined {
  return electricityProviders.find((provider) => provider.code === code)
}

export function getElectricityProvidersByState(state: string): ElectricityProvider[] {
  return electricityProviders.filter((provider) =>
    provider.states.some((s) => s.toLowerCase() === state.toLowerCase())
  )
}

export function getAllElectricityProviders(): ElectricityProvider[] {
  return electricityProviders
}