import { waNumber } from './phone'

export function whatsappHref(phone: string, message?: string): string {
  const base = `https://wa.me/${waNumber(phone)}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}