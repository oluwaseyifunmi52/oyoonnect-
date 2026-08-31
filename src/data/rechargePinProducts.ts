import type { RechargePinProduct } from '../types/bills'

export const rechargePinProducts: RechargePinProduct[] = [
  // MTN
  {
    id: 'mtn-100',
    networkId: 'mtn',
    denomination: 100,
    price: 100,
    description: 'MTN ₦100 Recharge PIN',
  },
  {
    id: 'mtn-200',
    networkId: 'mtn',
    denomination: 200,
    price: 200,
    description: 'MTN ₦200 Recharge PIN',
  },
  {
    id: 'mtn-500',
    networkId: 'mtn',
    denomination: 500,
    price: 500,
    description: 'MTN ₦500 Recharge PIN',
  },
  {
    id: 'mtn-1000',
    networkId: 'mtn',
    denomination: 1000,
    price: 1000,
    description: 'MTN ₦1,000 Recharge PIN',
  },
  {
    id: 'mtn-2000',
    networkId: 'mtn',
    denomination: 2000,
    price: 2000,
    description: 'MTN ₦2,000 Recharge PIN',
  },
  {
    id: 'mtn-5000',
    networkId: 'mtn',
    denomination: 5000,
    price: 5000,
    description: 'MTN ₦5,000 Recharge PIN',
  },
  // Airtel
  {
    id: 'airtel-100',
    networkId: 'airtel',
    denomination: 100,
    price: 100,
    description: 'Airtel ₦100 Recharge PIN',
  },
  {
    id: 'airtel-200',
    networkId: 'airtel',
    denomination: 200,
    price: 200,
    description: 'Airtel ₦200 Recharge PIN',
  },
  {
    id: 'airtel-500',
    networkId: 'airtel',
    denomination: 500,
    price: 500,
    description: 'Airtel ₦500 Recharge PIN',
  },
  {
    id: 'airtel-1000',
    networkId: 'airtel',
    denomination: 1000,
    price: 1000,
    description: 'Airtel ₦1,000 Recharge PIN',
  },
  {
    id: 'airtel-2000',
    networkId: 'airtel',
    denomination: 2000,
    price: 2000,
    description: 'Airtel ₦2,000 Recharge PIN',
  },
  {
    id: 'airtel-5000',
    networkId: 'airtel',
    denomination: 5000,
    price: 5000,
    description: 'Airtel ₦5,000 Recharge PIN',
  },
  // Glo
  {
    id: 'glo-100',
    networkId: 'glo',
    denomination: 100,
    price: 100,
    description: 'Glo ₦100 Recharge PIN',
  },
  {
    id: 'glo-200',
    networkId: 'glo',
    denomination: 200,
    price: 200,
    description: 'Glo ₦200 Recharge PIN',
  },
  {
    id: 'glo-500',
    networkId: 'glo',
    denomination: 500,
    price: 500,
    description: 'Glo ₦500 Recharge PIN',
  },
  {
    id: 'glo-1000',
    networkId: 'glo',
    denomination: 1000,
    price: 1000,
    description: 'Glo ₦1,000 Recharge PIN',
  },
  {
    id: 'glo-2000',
    networkId: 'glo',
    denomination: 2000,
    price: 2000,
    description: 'Glo ₦2,000 Recharge PIN',
  },
  {
    id: 'glo-5000',
    networkId: 'glo',
    denomination: 5000,
    price: 5000,
    description: 'Glo ₦5,000 Recharge PIN',
  },
  // 9mobile
  {
    id: '9mobile-100',
    networkId: '9mobile',
    denomination: 100,
    price: 100,
    description: '9mobile ₦100 Recharge PIN',
  },
  {
    id: '9mobile-200',
    networkId: '9mobile',
    denomination: 200,
    price: 200,
    description: '9mobile ₦200 Recharge PIN',
  },
  {
    id: '9mobile-500',
    networkId: '9mobile',
    denomination: 500,
    price: 500,
    description: '9mobile ₦500 Recharge PIN',
  },
  {
    id: '9mobile-1000',
    networkId: '9mobile',
    denomination: 1000,
    price: 1000,
    description: '9mobile ₦1,000 Recharge PIN',
  },
  {
    id: '9mobile-2000',
    networkId: '9mobile',
    denomination: 2000,
    price: 2000,
    description: '9mobile ₦2,000 Recharge PIN',
  },
  {
    id: '9mobile-5000',
    networkId: '9mobile',
    denomination: 5000,
    price: 5000,
    description: '9mobile ₦5,000 Recharge PIN',
  },
]

export function getRechargePinProductById(id: string): RechargePinProduct | undefined {
  return rechargePinProducts.find((product) => product.id === id)
}

export function getRechargePinProductsByNetwork(networkId: string): RechargePinProduct[] {
  return rechargePinProducts.filter((product) => product.networkId === networkId)
}

export function getAllRechargePinProducts(): RechargePinProduct[] {
  return rechargePinProducts
}