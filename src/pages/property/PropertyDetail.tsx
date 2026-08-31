import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Bed, Bath, Square, MapPin, Phone, MessageCircle, Share2, Heart, CheckCircle2, Navigation } from 'lucide-react'
import { Button, ButtonLink } from '../../components/ui/Button'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { Modal } from '../../components/common/Modal'
import { propertyService } from '../../services/propertyService'
import { propertyFavoritesService } from '../../services/propertyService'
import { useAuth } from '../../context/AuthContext'
import { useFavorites } from '../../context/FavoritesContext'
import type { Property } from '../../types/rental'

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'Apartment / Flat',
  house: 'House',
  duplex: 'Duplex',
  bungalow: 'Bungalow',
  terrace: 'Terrace',
  block_of_flats: 'Block of Flats',
  shortlet: 'Shortlet / Airbnb',
  hostel: 'Hostel / Student Housing',
  commercial: 'Commercial Property',
  office: 'Office Space',
  shop: 'Shop / Retail Space',
  warehouse: 'Warehouse / Industrial',
  land: 'Land / Plot',
}

function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const { user, isAuthenticated } = useAuth()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [inquiryMessage, setInquiryMessage] = useState('')
  const [sendingInquiry, setSendingInquiry] = useState(false)

  useEffect(() => {
    if (!id) return
    const loadProperty = async () => {
      try {
        const data = await propertyService.getById(id)
        if (data) {
          setProperty(data)
          await propertyService.incrementViews(id)
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    loadProperty()
  }, [id])

  const favorite = property ? isFavorite(property.id) : false

  const handleFavoriteClick = () => {
    if (!property) return
    propertyFavoritesService.toggle(property.id)
    toggleFavorite(property.id)
  }

  const handleInquiry = async () => {
    if (!property || !user) return
    setSendingInquiry(true)
    try {
      await propertyService.incrementInquiries(property.id)
      setShowInquiryModal(false)
      setInquiryMessage('')
      alert('Your inquiry has been sent to the property owner.')
    } catch {
      alert('Failed to send inquiry. Please try again.')
    } finally {
      setSendingInquiry(false)
    }
  }

  const handleShare = async () => {
    if (!property) return
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: property.title, url })
      } catch {
        // ignore
      }
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard')
    }
  }

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="page-skeleton">
            <div className="skeleton skeleton--media" style={{ height: '400px', borderRadius: '12px', marginBottom: '24px' }} />
            <div className="skeleton skeleton--text skeleton--wide" style={{ maxWidth: '600px', marginBottom: '16px' }} />
            <div className="skeleton skeleton--text" style={{ width: '40%', marginBottom: '24px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '60px', borderRadius: '8px' }} />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (notFound || !property) {
    return (
      <main className="page">
        <div className="container">
          <SectionHeading
            title="Property not found"
            subtitle="The property you are looking for does not exist or has been removed."
          />
          <ButtonLink to="/rentals" variant="primary">
            <ArrowLeft size={18} />
            Back to Rentals
          </ButtonLink>
        </div>
      </main>
    )
  }

  const propertyTypeLabel = PROPERTY_TYPE_LABELS[property.propertyType] || property.propertyType
  const listingLabel = property.listingType === 'rent' ? 'For Rent' : property.listingType === 'sale' ? 'For Sale' : 'Shortlet'
  const pricePeriodLabel = property.pricePeriod === 'monthly' ? '/month' : property.pricePeriod === 'annually' ? '/year' : ''

  return (
    <main className="page property-detail">
      <div className="container">
        <div className="property-detail__header">
          <ButtonLink to="/rentals" variant="ghost" size="sm">
            <ArrowLeft size={18} />
            Back to Rentals
          </ButtonLink>
          <div className="property-detail__actions">
            <button
              type="button"
              onClick={handleShare}
              className="btn btn--ghost btn--sm"
              aria-label="Share property"
            >
              <Share2 size={18} />
            </button>
            <button
              type="button"
              onClick={handleFavoriteClick}
              className={`btn btn--ghost btn--sm ${favorite ? 'favorited' : ''}`}
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={18} className={favorite ? 'filled' : ''} />
            </button>
          </div>
        </div>

        <div className="property-detail__media">
          <img src={property.images.cover} alt={property.title} className="property-detail__cover" />
          {property.images.gallery.length > 0 && (
            <div className="property-detail__gallery">
              {property.images.gallery.map((img, idx) => (
                <img key={idx} src={img} alt={`${property.title} ${idx + 1}`} className="property-detail__gallery-img" />
              ))}
            </div>
          )}
        </div>

        <div className="property-detail__content">
          <div className="property-detail__main">
            <div className="property-detail__badges">
              {property.verified && (
                <span className="card__badge card__badge--verified">
                  <CheckCircle2 size={14} /> Verified Listing
                </span>
              )}
              {property.featured && (
                <span className="card__badge card__badge--featured">Featured</span>
              )}
              <span className="card__badge card__badge--listing-type">{listingLabel}</span>
            </div>

            <h1 className="property-detail__title">{property.title}</h1>
            <p className="property-detail__location">
              <MapPin size={18} aria-hidden="true" />
              {property.location.busStop ? `${property.location.busStop}, ` : ''}
              {property.location.area ? `${property.location.area}, ` : ''}
              {property.location.lga}, {property.location.state}
            </p>

            <p className="property-detail__price">
              <span className="property-detail__price-amount">₦{property.price.toLocaleString()}</span>
              <span className="property-detail__price-period">{pricePeriodLabel}</span>
              {property.negotiable && <span className="property-detail__price-note">Negotiable</span>}
            </p>

            <p className="property-detail__description">{property.description}</p>

            <div className="property-detail__features">
              <h2 className="property-detail__section-title">Features</h2>
              <div className="property-detail__features-grid">
                {property.features.bedrooms > 0 && (
                  <div className="property-detail__feature">
                    <Bed size={20} aria-hidden="true" />
                    <div>
                      <strong>{property.features.bedrooms}</strong>
                      <span>Bedrooms</span>
                    </div>
                  </div>
                )}
                {property.features.bathrooms > 0 && (
                  <div className="property-detail__feature">
                    <Bath size={20} aria-hidden="true" />
                    <div>
                      <strong>{property.features.bathrooms}</strong>
                      <span>Bathrooms</span>
                    </div>
                  </div>
                )}
                {property.features.toilets > 0 && (
                  <div className="property-detail__feature">
                    <Square size={20} aria-hidden="true" />
                    <div>
                      <strong>{property.features.toilets}</strong>
                      <span>Toilets</span>
                    </div>
                  </div>
                )}
                {property.features.livingRooms > 0 && (
                  <div className="property-detail__feature">
                    <Square size={20} aria-hidden="true" />
                    <div>
                      <strong>{property.features.livingRooms}</strong>
                      <span>Living Rooms</span>
                    </div>
                  </div>
                )}
                {property.features.kitchens > 0 && (
                  <div className="property-detail__feature">
                    <Square size={20} aria-hidden="true" />
                    <div>
                      <strong>{property.features.kitchens}</strong>
                      <span>Kitchens</span>
                    </div>
                  </div>
                )}
                {property.features.floors > 0 && (
                  <div className="property-detail__feature">
                    <Square size={20} aria-hidden="true" />
                    <div>
                      <strong>{property.features.floors}</strong>
                      <span>Floors</span>
                    </div>
                  </div>
                )}
                {property.features.plotSize ? (
                  <div className="property-detail__feature">
                    <Square size={20} aria-hidden="true" />
                    <div>
                      <strong>{property.features.plotSize}</strong>
                      <span>{property.features.plotSizeUnit || 'sqm'} Plot</span>
                    </div>
                  </div>
                ) : null}
                {property.features.yearBuilt ? (
                  <div className="property-detail__feature">
                    <Square size={20} aria-hidden="true" />
                    <div>
                      <strong>{property.features.yearBuilt}</strong>
                      <span>Year Built</span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="property-detail__amenities">
              <h2 className="property-detail__section-title">Amenities</h2>
              <div className="property-detail__amenities-grid">
                {Object.entries(property.amenities).filter(([, v]) => v === true).map(([key]) => (
                  <span key={key} className="property-amenity-badge">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>

            <div className="property-detail__owner">
              <h2 className="property-detail__section-title">Listed By</h2>
              <div className="property-detail__owner-card">
                <div>
                  <p className="property-detail__owner-name">{property.ownerName}</p>
                  <p className="property-detail__owner-phone">{property.ownerPhone}</p>
                  {property.ownerWhatsApp && (
                    <p className="property-detail__owner-whatsapp">WhatsApp: {property.ownerWhatsApp}</p>
                  )}
                </div>
                <div className="property-detail__owner-actions">
                  <a href={`tel:${property.ownerPhone}`} className="btn btn--outline">
                    <Phone size={16} />
                    Call
                  </a>
                  {property.ownerWhatsApp && (
                    <a
                      href={`https://wa.me/${property.ownerWhatsApp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--whatsapp"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="property-detail__sidebar">
            <div className="property-detail__sticky">
              <div className="property-detail__price-card">
                <p className="property-detail__sidebar-price">
                  ₦{property.price.toLocaleString()}
                  <span>{pricePeriodLabel}</span>
                </p>
                {property.negotiable && (
                  <p className="property-detail__sidebar-negotiable">Price is negotiable</p>
                )}
                {property.availableFrom && (
                  <p className="property-detail__sidebar-available">
                    Available from: {new Date(property.availableFrom).toLocaleDateString()}
                  </p>
                )}
                {isAuthenticated ? (
                  <Button
                    variant="primary"
                    size="lg"
                    className="property-detail__inquiry-btn"
                    onClick={() => setShowInquiryModal(true)}
                  >
                    Send Inquiry
                  </Button>
                ) : (
                  <ButtonLink to="/login" variant="primary" size="lg" className="property-detail__inquiry-btn">
                    Sign in to Inquire
                  </ButtonLink>
                )}
              </div>

              <div className="property-detail__meta-card">
                <h3 className="property-detail__meta-title">Property Details</h3>
                <div className="property-detail__meta-list">
                  <div className="property-detail__meta-item">
                    <span>Property Type</span>
                    <strong>{propertyTypeLabel}</strong>
                  </div>
                  <div className="property-detail__meta-item">
                    <span>Listing Type</span>
                    <strong>{listingLabel}</strong>
                  </div>
                  <div className="property-detail__meta-item">
                    <span>Condition</span>
                    <strong>{property.features.propertyCondition.replace('_', ' ')}</strong>
                  </div>
                  {property.features.plotSize && (
                    <div className="property-detail__meta-item">
                      <span>Plot Size</span>
                      <strong>{property.features.plotSize} {property.features.plotSizeUnit || 'sqm'}</strong>
                    </div>
                  )}
                  {property.location.latitude && property.location.longitude && (
                    <div className="property-detail__meta-item">
                      <a
                        href={`https://www.google.com/maps?q=${property.location.latitude},${property.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--ghost btn--sm"
                      >
                        <Navigation size={14} />
                        View on Map
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Modal
        isOpen={showInquiryModal}
        onClose={() => setShowInquiryModal(false)}
        title="Send Inquiry"
        size="md"
      >
        <p className="property-detail__inquiry-text">
          Send a message to <strong>{property.ownerName}</strong> about <strong>{property.title}</strong>.
        </p>
        <textarea
          className="input property-detail__inquiry-textarea"
          rows={4}
          placeholder="Hi, I'm interested in this property. Is it still available?"
          value={inquiryMessage}
          onChange={(e) => setInquiryMessage(e.target.value)}
        />
        <div className="modal-actions">
          <Button variant="outline" onClick={() => setShowInquiryModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleInquiry} loading={sendingInquiry}>
            Send Inquiry
          </Button>
        </div>
      </Modal>
    </main>
  )
}

export default PropertyDetail
