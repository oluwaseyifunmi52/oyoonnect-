const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')

export type VTUNetwork = { id: string; name: string; code: string; logo?: string; color?: string }
export type VTUPlan = { id: string; networkId: string; serviceId: string; value: string; name: string; dataAmount: string; validity: string; priceKobo: number; type: string }
export type VTUPricing = { customerFeeKobo: number }
export type VTUOrder = { reference: string; type: 'airtime' | 'data'; paymentMethod: 'wallet' | 'paystack'; paymentStatus: string; status: 'pending' | 'processing' | 'success' | 'failed' | 'refunded'; networkId: string; phoneNumber: string; planName?: string; dataAmount?: string; validity?: string; amount: number; fee: number; total: number; paymentUrl?: string; failureReason?: string; createdAt: string; completedAt?: string }

async function request<T>(endpoint: string, token?: string, init: RequestInit = {}): Promise<T> {
  const send = (bearer?: string) => fetch(`${API_BASE}${endpoint}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}), ...init.headers },
  })
  const activeToken = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('oyoconnect_vtu_backend_token') || token : token
  let response = await send(activeToken)
  if (response.status === 401 && activeToken && typeof sessionStorage !== 'undefined') {
    const refreshToken = sessionStorage.getItem('oyoconnect_vtu_backend_refresh')
    if (refreshToken) {
      const refresh = await fetch(`${API_BASE}/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }) })
      const refreshed = await refresh.json().catch(() => ({}))
      if (refresh.ok && refreshed.accessToken && refreshed.refreshToken) {
        sessionStorage.setItem('oyoconnect_vtu_backend_token', refreshed.accessToken)
        sessionStorage.setItem('oyoconnect_vtu_backend_refresh', refreshed.refreshToken)
        response = await send(refreshed.accessToken)
      }
    }
  }
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.message || body.error || `Request failed (${response.status})`)
  return body && typeof body === 'object' && 'data' in body ? body.data : body
}

export const vtuService = {
  login: (email: string, password: string) => request<{ accessToken: string; refreshToken: string }>('/auth/login', undefined, { method: 'POST', body: JSON.stringify({ identifier: email, password }) }),
  networks: (type: 'airtime' | 'data') => request<VTUNetwork[]>(`/services/vtu/networks/${type}`),
  pricing: () => request<VTUPricing>('/services/vtu/pricing'),
  plans: (networkId: string) => request<VTUPlan[]>(`/services/vtu/data-plans/${encodeURIComponent(networkId)}`),
  wallet: (token: string) => request<{ balance: number }>('/wallet', token),
  history: (token: string) => request<VTUOrder[]>('/services/vtu/history', token),
  order: (token: string, reference: string, verify = false) => request<VTUOrder>(`/services/vtu/${encodeURIComponent(reference)}${verify ? '?verify=1' : ''}`, token),
  purchase: (token: string, value: { type: 'airtime' | 'data'; networkId: string; phoneNumber: string; paymentMethod: 'wallet' | 'paystack'; amountNaira?: number; planId?: string; idempotencyKey: string }) => request<VTUOrder>('/services/vtu/purchase', token, { method: 'POST', body: JSON.stringify(value) }),
}

export const formatVtuMoney = (kobo: number) => `₦${(kobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`
