import { Phone, MessageCircle, Navigation } from 'lucide-react'
import type { Business } from '../../types/business'
import { formatPhone, telHref, directionsHref } from '../../utils/phone'
import { whatsappHref } from '../../utils/whatsapp'

interface ContactButtonsProps {
  business: Business
}

export function ContactButtons({ business }: ContactButtonsProps) {
  return (
    <div className="contact-actions">
      <a
        href={telHref(business.phone)}
        className="btn btn--primary"
        aria-label={`Call ${business.name} on ${formatPhone(business.phone)}`}
      >
        <Phone size={17} /> Call {formatPhone(business.phone)}
      </a>
      <a
        href={whatsappHref(
          business.whatsapp,
          `Hello ${business.name}, I found you on OyoConnect.`,
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn--whatsapp"
        aria-label={`Message ${business.name} on WhatsApp`}
      >
        <MessageCircle size={17} /> WhatsApp
      </a>
      <a
        href={directionsHref(business.address)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn--outline"
        aria-label={`Get directions to ${business.name}`}
      >
        <Navigation size={17} /> Directions
      </a>
    </div>
  )
}