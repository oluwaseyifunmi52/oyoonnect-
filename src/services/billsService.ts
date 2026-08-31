import type {
  Network,
  DataPlan,
  ElectricityProvider,
  ElectricityPayment,
  ElectricityVerification,
  TVProvider,
  TVPackage,
  TVSubscription,
  EducationProduct,
  EducationPurchase,
  RechargePinProduct,
  RechargePinPurchase,
  SocialMediaPlatform,
  SocialMediaService,
  SocialMediaPurchase,
  DigitalProduct,
  GameProduct,
  Transaction,
  PurchaseResponse,
  VerificationResponse,
} from '../types/bills'
import { getPlansByNetwork, getNetworksForAirtime } from '../data/networks'
import { electricityProviders, getElectricityProviderById } from '../data/electricityProviders'
import { educationProducts, getEducationProductById } from '../data/educationProducts'
import { rechargePinProducts, getRechargePinProductById } from '../data/rechargePinProducts'
import {
  socialMediaPlatforms,
  getSocialMediaPlatformById,
  getSocialMediaServiceById,
  getAllSocialMediaServices,
} from '../data/socialMediaServices'
import { tvProviders, getTVProviderById, getPackagesByProvider, getPackageById } from '../data/tvProviders'
import { digitalProducts } from '../data/digitalProducts'
import { gameProducts } from '../data/gameProducts'

function generateTransactionId(): string {
  return 'txn_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-6)
}

function createTransaction(opts: {
  type: Transaction['type']
  service: string
  provider: string
  amount: number
  fee: number
  customerDetails: Record<string, string>
  walletBalanceBefore: number
  walletBalanceAfter: number
}): Transaction {
  return {
    id: generateTransactionId(),
    userId: 'dev-user',
    type: opts.type,
    service: opts.service,
    provider: opts.provider,
    amount: opts.amount,
    fee: opts.fee,
    total: opts.amount + opts.fee,
    currency: 'NGN',
    customerDetails: opts.customerDetails,
    reference: `ref_${Date.now()}`,
    walletBalanceBefore: opts.walletBalanceBefore,
    walletBalanceAfter: opts.walletBalanceAfter,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    status: 'success',
    receiptUrl: `https://oyoconnect.com/receipts/${generateTransactionId()}`,
  }
}

const PLATFORM_FEE = 50

export const billsService = {
  async getNetworksForAirtime(): Promise<Network[]> {
    return getNetworksForAirtime()
  },

  async getElectricityProviders(): Promise<ElectricityProvider[]> {
    return electricityProviders
  },

  async getDataPlans(networkId: string): Promise<DataPlan[]> {
    return getPlansByNetwork(networkId)
  },

  async getTelecomDataPlans(networkId: string): Promise<DataPlan[]> {
    return getPlansByNetwork(networkId)
  },

  async getDigitalProducts(): Promise<DigitalProduct[]> {
    return digitalProducts
  },

  async getGameProducts(): Promise<GameProduct[]> {
    return gameProducts
  },

  async purchaseAirtime(request: {
    networkId: string
    phoneNumber: string
    amount: number
  }): Promise<PurchaseResponse> {
    const network = getNetworksForAirtime().find((n) => n.id === request.networkId)
    if (!network) {
      return { success: false, message: 'Invalid network selected' }
    }

    const transaction = createTransaction({
      type: 'airtime',
      service: 'Airtime Recharge',
      provider: network.name,
      amount: request.amount,
      fee: PLATFORM_FEE,
      customerDetails: { phoneNumber: request.phoneNumber, network: network.name },
      walletBalanceBefore: 0,
      walletBalanceAfter: 0,
    })

    return {
      success: true,
      message: `₦${request.amount} airtime recharge successful for ${request.phoneNumber}`,
      transaction,
    }
  },

  async purchaseData(request: {
    networkId: string
    phoneNumber: string
    planId: string
    planName: string
    amount: number
  }): Promise<PurchaseResponse> {
    const network = getNetworksForAirtime().find((n) => n.id === request.networkId)
    if (!network) {
      return { success: false, message: 'Invalid network selected' }
    }

    const plan = getPlansByNetwork(request.networkId).find((p) => p.id === request.planId)
    if (!plan) {
      return { success: false, message: 'Invalid data plan selected' }
    }

    const transaction = createTransaction({
      type: 'data',
      service: `Data: ${request.planName}`,
      provider: network.name,
      amount: request.amount,
      fee: PLATFORM_FEE,
      customerDetails: { phoneNumber: request.phoneNumber, network: network.name, plan: request.planName },
      walletBalanceBefore: 0,
      walletBalanceAfter: 0,
    })

    return {
      success: true,
      message: `₦${request.amount} data plan (${request.planName}) activated for ${request.phoneNumber}`,
      transaction,
    }
  },

  async getRechargePinNetworks(): Promise<Network[]> {
    return getNetworksForAirtime()
  },

  async getRechargePinProducts(networkId: string): Promise<RechargePinProduct[]> {
    return rechargePinProducts.filter((p) => p.networkId === networkId)
  },

  async purchaseRechargePin(request: RechargePinPurchase): Promise<PurchaseResponse> {
    const network = getNetworksForAirtime().find((n) => n.id === request.networkId)
    if (!network) {
      return { success: false, message: 'Invalid network selected' }
    }

    const product = getRechargePinProductById(request.productId)
    if (!product) {
      return { success: false, message: 'Invalid product selected' }
    }

    const totalAmount = product.price * request.quantity
    const transaction = createTransaction({
      type: 'recharge-pin',
      service: `${network.name} Recharge PIN`,
      provider: network.name,
      amount: totalAmount,
      fee: PLATFORM_FEE,
      customerDetails: {
        phoneNumber: request.phoneNumber,
        network: network.name,
        productId: request.productId,
        denomination: String(product.denomination),
        quantity: String(request.quantity),
      },
      walletBalanceBefore: 0,
      walletBalanceAfter: 0,
    })

    return {
      success: true,
      message: `${request.quantity} x ₦${product.denomination} ${network.name} recharge PIN(s) purchased for ${request.phoneNumber}`,
      transaction,
    }
  },

  async getEducationProducts(): Promise<EducationProduct[]> {
    return educationProducts
  },

  async purchaseEducation(request: EducationPurchase): Promise<PurchaseResponse> {
    const product = getEducationProductById(request.productId)
    if (!product) {
      return { success: false, message: 'Invalid product selected' }
    }

    const transaction = createTransaction({
      type: 'education',
      service: product.name,
      provider: product.provider,
      amount: request.amount,
      fee: PLATFORM_FEE,
      customerDetails: {
        candidateName: request.candidateName,
        phoneNumber: request.phoneNumber,
        email: request.email || '',
        examType: request.examType,
        productId: request.productId,
      },
      walletBalanceBefore: 0,
      walletBalanceAfter: 0,
    })

    return {
      success: true,
      message: `${product.name} registration processed for ${request.candidateName}`,
      transaction,
    }
  },

  async getSocialMediaPlatforms(): Promise<SocialMediaPlatform[]> {
    return socialMediaPlatforms
  },

  async getSocialMediaServices(platformId: string): Promise<SocialMediaService[]> {
    return getAllSocialMediaServices().filter((s) => s.platformId === platformId)
  },

  async purchaseSocialMedia(request: SocialMediaPurchase): Promise<PurchaseResponse> {
    const platform = getSocialMediaPlatformById(request.platformId)
    if (!platform) {
      return { success: false, message: 'Invalid platform selected' }
    }

    const service = getSocialMediaServiceById(request.serviceId)
    if (!service) {
      return { success: false, message: 'Invalid service selected' }
    }

    const transaction = createTransaction({
      type: 'social-media',
      service: service.name,
      provider: platform.name,
      amount: request.amount,
      fee: PLATFORM_FEE,
      customerDetails: {
        targetUrl: request.targetUrl,
        service: service.name,
        quantity: String(request.quantity),
        platform: platform.name,
      },
      walletBalanceBefore: 0,
      walletBalanceAfter: 0,
    })

    return {
      success: true,
      message: `${service.name} order for ${request.quantity} quantity placed successfully`,
      transaction,
    }
  },

  async getTVProviders(): Promise<TVProvider[]> {
    return tvProviders
  },

  async getTVPackages(providerId: string): Promise<TVPackage[]> {
    return getPackagesByProvider(providerId)
  },

  async verifyTVCustomer(provider: string, smartCardNumber: string): Promise<VerificationResponse> {
    const tvProvider = getTVProviderById(provider)
    if (!tvProvider) {
      return { success: false, error: 'Invalid TV provider' }
    }

    if (!smartCardNumber || smartCardNumber.length < 8) {
      return { success: false, error: 'Invalid smart card number' }
    }

    const data: ElectricityVerification = {
      customerName: 'TV Subscriber',
      smartCardNumber,
      provider: tvProvider.name,
    }

    return {
      success: true,
      data,
    }
  },

  async subscribeTV(request: TVSubscription): Promise<PurchaseResponse> {
    const tvProvider = getTVProviderById(request.providerId)
    if (!tvProvider) {
      return { success: false, message: 'Invalid TV provider' }
    }

    const pkg = getPackageById(request.packageId)
    if (!pkg) {
      return { success: false, message: 'Invalid package selected' }
    }

    const transaction = createTransaction({
      type: 'tv',
      service: `${pkg.name} (${tvProvider.name})`,
      provider: tvProvider.name,
      amount: request.amount,
      fee: PLATFORM_FEE,
      customerDetails: {
        smartCardNumber: request.smartCardNumber,
        packageName: pkg.name,
        duration: request.duration,
      },
      walletBalanceBefore: 0,
      walletBalanceAfter: 0,
    })

    return {
      success: true,
      message: `${tvProvider.name} ${pkg.name} subscription renewed successfully`,
      transaction,
    }
  },

  async verifyMeter(request: {
    providerId: string
    meterNumber: string
    meterType: 'prepaid' | 'postpaid'
  }): Promise<VerificationResponse> {
    const provider = getElectricityProviderById(request.providerId)
    if (!provider) {
      return { success: false, error: 'Invalid electricity provider' }
    }

    if (!request.meterNumber || request.meterNumber.length < 5) {
      return { success: false, error: 'Invalid meter number' }
    }

    const data: ElectricityVerification = {
      customerName: '',
      meterNumber: request.meterNumber,
      provider: provider.name,
      meterType: request.meterType,
      address: '',
      outstandingBalance: request.meterType === 'postpaid' ? 0 : 0,
    }

    return {
      success: true,
      data,
    }
  },

  async payElectricity(request: ElectricityPayment): Promise<PurchaseResponse> {
    const provider = getElectricityProviderById(request.providerId)
    if (!provider) {
      return { success: false, message: 'Invalid electricity provider' }
    }

    const transaction = createTransaction({
      type: 'electricity',
      service: `${provider.shortName} ${request.meterType === 'prepaid' ? 'Prepaid' : 'Postpaid'} Meter`,
      provider: provider.name,
      amount: request.amount,
      fee: PLATFORM_FEE,
      customerDetails: {
        meterNumber: request.meterNumber,
        customerName: request.customerName || '',
        phoneNumber: request.phoneNumber || '',
        email: request.email || '',
        meterType: request.meterType,
      },
      walletBalanceBefore: 0,
      walletBalanceAfter: 0,
    })

    return {
      success: true,
      message: `${provider.shortName} ${request.meterType} meter payment of ₦${request.amount} successful`,
      transaction,
    }
  },
}
