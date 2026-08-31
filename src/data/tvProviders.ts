import type { TVProvider, TVPackage } from '../types/bills'

export const tvProviders: TVProvider[] = [
  {
    id: 'dstv',
    name: 'DSTV',
    code: 'dstv',
    logo: '/icons/tv/dstv.svg',
    color: '#E60000',
    packages: [
      {
        id: 'dstv-premium',
        providerId: 'dstv',
        name: 'Premium',
        price: 29500,
        duration: 'Monthly',
        channels: 170,
        description: 'Full premium package with all channels',
      },
      {
        id: 'dstv-compact-plus',
        providerId: 'dstv',
        name: 'Compact Plus',
        price: 19800,
        duration: 'Monthly',
        channels: 155,
        description: 'Premium entertainment and sports',
      },
      {
        id: 'dstv-compact',
        providerId: 'dstv',
        name: 'Compact',
        price: 12500,
        duration: 'Monthly',
        channels: 140,
        description: 'Popular entertainment package',
      },
      {
        id: 'dstv-confam',
        providerId: 'dstv',
        name: 'Confam',
        price: 7400,
        duration: 'Monthly',
        channels: 115,
        description: 'Budget-friendly entertainment',
      },
      {
        id: 'dstv-yanga',
        providerId: 'dstv',
        name: 'Yanga',
        price: 4200,
        duration: 'Monthly',
        channels: 85,
        description: 'Entry-level package',
      },
      {
        id: 'dstv-padi',
        providerId: 'dstv',
        name: 'Padi',
        price: 2950,
        duration: 'Monthly',
        channels: 45,
        description: 'Basic package',
      },
    ],
  },
  {
    id: 'gotv',
    name: 'GOtv',
    code: 'gotv',
    logo: '/icons/tv/gotv.svg',
    color: '#FF6600',
    packages: [
      {
        id: 'gotv-supa',
        providerId: 'gotv',
        name: 'Supa',
        price: 7600,
        duration: 'Monthly',
        channels: 80,
        description: 'Premium GOtv package',
      },
      {
        id: 'gotv-max',
        providerId: 'gotv',
        name: 'Max',
        price: 5700,
        duration: 'Monthly',
        channels: 70,
        description: 'Popular entertainment package',
      },
      {
        id: 'gotv-jolli',
        providerId: 'gotv',
        name: 'Jolli',
        price: 3950,
        duration: 'Monthly',
        channels: 65,
        description: 'Family entertainment',
      },
      {
        id: 'gotv-jinja',
        providerId: 'gotv',
        name: 'Jinja',
        price: 2700,
        duration: 'Monthly',
        channels: 45,
        description: 'Budget package',
      },
      {
        id: 'gotv-smallie',
        providerId: 'gotv',
        name: 'Smallie',
        price: 1300,
        duration: 'Monthly',
        channels: 35,
        description: 'Basic package',
      },
    ],
  },
  {
    id: 'startimes',
    name: 'Startimes',
    code: 'startimes',
    logo: '/icons/tv/startimes.svg',
    color: '#0066CC',
    packages: [
      {
        id: 'startimes-super',
        providerId: 'startimes',
        name: 'Super',
        price: 6500,
        duration: 'Monthly',
        channels: 100,
        description: 'Premium package',
      },
      {
        id: 'startimes-nova',
        providerId: 'startimes',
        name: 'Nova',
        price: 4200,
        duration: 'Monthly',
        channels: 80,
        description: 'Popular package',
      },
      {
        id: 'startimes-basic',
        providerId: 'startimes',
        name: 'Basic',
        price: 2200,
        duration: 'Monthly',
        channels: 50,
        description: 'Budget package',
      },
      {
        id: 'startimes-classic',
        providerId: 'startimes',
        name: 'Classic',
        price: 3100,
        duration: 'Monthly',
        channels: 65,
        description: 'Standard package',
      },
    ],
  },
]

export function getTVProviderById(id: string): TVProvider | undefined {
  return tvProviders.find((provider) => provider.id === id)
}

export function getTVProviderByCode(code: string): TVProvider | undefined {
  return tvProviders.find((provider) => provider.code === code)
}

export function getPackagesByProvider(providerId: string): TVPackage[] {
  const provider = tvProviders.find((p) => p.id === providerId)
  return provider?.packages ?? []
}

export function getPackageById(id: string): TVPackage | undefined {
  for (const provider of tvProviders) {
    const pkg = provider.packages.find((p) => p.id === id)
    if (pkg) return pkg
  }
  return undefined
}