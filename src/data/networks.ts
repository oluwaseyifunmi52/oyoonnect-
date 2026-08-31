import type { Network, DataPlan } from '../types/bills'

export const networks: Network[] = [
  {
    id: 'mtn',
    name: 'MTN',
    code: 'mtn',
    logo: '/icons/networks/mtn.svg',
    color: '#FFCC00',
    ussdCode: '*312#',
    supportsData: true,
    supportsAirtime: true,
    supportsSME: true,
    supportsCorporateGifting: true,
  },
  {
    id: 'airtel',
    name: 'Airtel',
    code: 'airtel',
    logo: '/icons/networks/airtel.svg',
    color: '#FC0000',
    ussdCode: '*141#',
    supportsData: true,
    supportsAirtime: true,
    supportsSME: false,
    supportsCorporateGifting: false,
  },
  {
    id: 'glo',
    name: 'Glo',
    code: 'glo',
    logo: '/icons/networks/glo.svg',
    color: '#00A651',
    ussdCode: '*777#',
    supportsData: true,
    supportsAirtime: true,
    supportsSME: false,
    supportsCorporateGifting: false,
  },
  {
    id: '9mobile',
    name: '9mobile',
    code: '9mobile',
    logo: '/icons/networks/9mobile.svg',
    color: '#00A0E3',
    ussdCode: '*200#',
    supportsData: true,
    supportsAirtime: true,
    supportsSME: false,
    supportsCorporateGifting: false,
  },
]

export const dataPlans: DataPlan[] = [
  // MTN Plans
  {
    id: 'mtn-500mb',
    networkId: 'mtn',
    name: '500MB',
    dataAmount: '500MB',
    validity: '7 days',
    price: 150,
    type: 'regular',
    description: 'Weekly data plan',
  },
  {
    id: 'mtn-1gb',
    networkId: 'mtn',
    name: '1GB',
    dataAmount: '1GB',
    validity: '30 days',
    price: 300,
    type: 'regular',
    description: 'Monthly data plan',
  },
  {
    id: 'mtn-2gb',
    networkId: 'mtn',
    name: '2GB',
    dataAmount: '2GB',
    validity: '30 days',
    price: 600,
    type: 'regular',
    description: 'Monthly data plan',
  },
  {
    id: 'mtn-5gb',
    networkId: 'mtn',
    name: '5GB',
    dataAmount: '5GB',
    validity: '30 days',
    price: 1500,
    type: 'regular',
    description: 'Monthly data plan',
  },
  {
    id: 'mtn-10gb',
    networkId: 'mtn',
    name: '10GB',
    dataAmount: '10GB',
    validity: '30 days',
    price: 3000,
    type: 'regular',
    description: 'Monthly data plan',
  },
  {
    id: 'mtn-20gb',
    networkId: 'mtn',
    name: '20GB',
    dataAmount: '20GB',
    validity: '30 days',
    price: 5000,
    type: 'regular',
    description: 'Monthly data plan',
  },
  // MTN SME Plans
  {
    id: 'mtn-sme-1gb',
    networkId: 'mtn',
    name: '1GB SME',
    dataAmount: '1GB',
    validity: '30 days',
    price: 250,
    type: 'sme',
    description: 'SME data share',
  },
  {
    id: 'mtn-sme-2gb',
    networkId: 'mtn',
    name: '2GB SME',
    dataAmount: '2GB',
    validity: '30 days',
    price: 500,
    type: 'sme',
    description: 'SME data share',
  },
  {
    id: 'mtn-sme-5gb',
    networkId: 'mtn',
    name: '5GB SME',
    dataAmount: '5GB',
    validity: '30 days',
    price: 1200,
    type: 'sme',
    description: 'SME data share',
  },
  // Airtel Plans
  {
    id: 'airtel-500mb',
    networkId: 'airtel',
    name: '500MB',
    dataAmount: '500MB',
    validity: '7 days',
    price: 150,
    type: 'regular',
    description: 'Weekly data plan',
  },
  {
    id: 'airtel-1gb',
    networkId: 'airtel',
    name: '1GB',
    dataAmount: '1GB',
    validity: '30 days',
    price: 300,
    type: 'regular',
    description: 'Monthly data plan',
  },
  {
    id: 'airtel-2gb',
    networkId: 'airtel',
    name: '2GB',
    dataAmount: '2GB',
    validity: '30 days',
    price: 500,
    type: 'regular',
    description: 'Monthly data plan',
  },
  {
    id: 'airtel-5gb',
    networkId: 'airtel',
    name: '5GB',
    dataAmount: '5GB',
    validity: '30 days',
    price: 1500,
    type: 'regular',
    description: 'Monthly data plan',
  },
  {
    id: 'airtel-10gb',
    networkId: 'airtel',
    name: '10GB',
    dataAmount: '10GB',
    validity: '30 days',
    price: 2500,
    type: 'regular',
    description: 'Monthly data plan',
  },
  // Glo Plans
  {
    id: 'glo-500mb',
    networkId: 'glo',
    name: '500MB',
    dataAmount: '500MB',
    validity: '7 days',
    price: 100,
    type: 'regular',
    description: 'Weekly data plan',
  },
  {
    id: 'glo-1gb',
    networkId: 'glo',
    name: '1GB',
    dataAmount: '1GB',
    validity: '30 days',
    price: 300,
    type: 'regular',
    description: 'Monthly data plan',
  },
  {
    id: 'glo-2gb',
    networkId: 'glo',
    name: '2GB',
    dataAmount: '2GB',
    validity: '30 days',
    price: 500,
    type: 'regular',
    description: 'Monthly data plan',
  },
  {
    id: 'glo-5gb',
    networkId: 'glo',
    name: '5GB',
    dataAmount: '5GB',
    validity: '30 days',
    price: 1000,
    type: 'regular',
    description: 'Monthly data plan',
  },
  {
    id: 'glo-10gb',
    networkId: 'glo',
    name: '10GB',
    dataAmount: '10GB',
    validity: '30 days',
    price: 2000,
    type: 'regular',
    description: 'Monthly data plan',
  },
  // 9mobile Plans
  {
    id: '9mobile-500mb',
    networkId: '9mobile',
    name: '500MB',
    dataAmount: '500MB',
    validity: '7 days',
    price: 200,
    type: 'regular',
    description: 'Weekly data plan',
  },
  {
    id: '9mobile-1gb',
    networkId: '9mobile',
    name: '1GB',
    dataAmount: '1GB',
    validity: '30 days',
    price: 400,
    type: 'regular',
    description: 'Monthly data plan',
  },
  {
    id: '9mobile-2gb',
    networkId: '9mobile',
    name: '2GB',
    dataAmount: '2GB',
    validity: '30 days',
    price: 800,
    type: 'regular',
    description: 'Monthly data plan',
  },
  {
    id: '9mobile-5gb',
    networkId: '9mobile',
    name: '5GB',
    dataAmount: '5GB',
    validity: '30 days',
    price: 2000,
    type: 'regular',
    description: 'Monthly data plan',
  },
]

export function getNetworkById(id: string): Network | undefined {
  return networks.find((network) => network.id === id)
}

export function getNetworkByCode(code: string): Network | undefined {
  return networks.find((network) => network.code === code)
}

export function getPlansByNetwork(networkId: string, type?: DataPlan['type']): DataPlan[] {
  return dataPlans.filter((plan) => {
    if (plan.networkId !== networkId) return false
    if (type && plan.type !== type) return false
    return true
  })
}

export function getPlanById(id: string): DataPlan | undefined {
  return dataPlans.find((plan) => plan.id === id)
}

export function getNetworksForData(): Network[] {
  return networks.filter((n) => n.supportsData)
}

export function getNetworksForAirtime(): Network[] {
  return networks.filter((n) => n.supportsAirtime)
}

export function getNetworksForSME(): Network[] {
  return networks.filter((n) => n.supportsSME)
}