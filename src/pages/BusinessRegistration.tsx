import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User, Phone, Mail, Lock, Building2, MapPin, Plus, Trash2, ArrowLeft, ArrowRight,
  CheckCircle2, AlertCircle, Info, Eye, FolderOpen, ShieldCheck, Image as ImageIcon,
  Loader2,
} from 'lucide-react'
import { Input, Select, Textarea } from '../components/ui/Input'
import { Button, ButtonLink } from '../components/ui/Button'
import { FormProgress } from '../components/common/FormProgress'
import { MediaUpload } from '../components/business/MediaUpload'
import type { MediaItem } from '../components/business/MediaUpload'
import { categories } from '../data/categories'
import { locations, townsByLocation } from '../data/locations'
import { businessService } from '../services/businessService'
import { apiClient } from '../services/apiClient'
import { useAuth } from '../context/AuthContext'

interface ServiceEntry {
  name: string
  category: string
  description: string
  price: string
  contactForPrice: boolean
}

interface WizardData {
  // Step 1 — Owner
  fullName: string
  phone: string
  email: string
  password: string
  confirmPassword: string
  // Step 2 — Business info
  businessName: string
  category: string
  description: string
  businessPhone: string
  businessEmail: string
  website: string
  // Step 3 — Location
  state: string
  lga: string
  town: string
  area: string
  address: string
  busStop: string
  // Opening hours
  openingHours: Record<
    string,
    {
      open: string
      close: string
      closed: boolean
    }
  >
  // Step 4 — Services
  services: ServiceEntry[]
  // Step 5 — Media
  logo: MediaItem[]
  cover: MediaItem[]
  photos: MediaItem[]
  // Social links
  socialLinks: Record<string, string>
  // Price range
  priceRange: '#' | '##' | '###' | '####' | ''
  // Location coordinates
  latitude: number
  longitude: number
  placeId: string
  formattedAddress: string
}

const initialData: WizardData = {
  fullName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  businessName: '',
  category: '',
  description: '',
  businessPhone: '',
  businessEmail: '',
  website: '',
  state: 'Oyo',
  lga: '',
  town: '',
  area: '',
  address: '',
  busStop: '',
  openingHours: {
    Monday: { open: '09:00', close: '18:00', closed: false },
    Tuesday: { open: '09:00', close: '18:00', closed: false },
    Wednesday: { open: '09:00', close: '18:00', closed: false },
    Thursday: { open: '09:00', close: '18:00', closed: false },
    Friday: { open: '09:00', close: '18:00', closed: false },
    Saturday: { open: '09:00', close: '18:00', closed: false },
    Sunday: { open: '09:00', close: '18:00', closed: true },
  },
  services: [],
  logo: [],
  cover: [],
  photos: [],
  socialLinks: {},
  priceRange: '##',
  latitude: 0,
  longitude: 0,
  placeId: '',
  formattedAddress: '',
}

const STEPS = [
  { label: 'Owner' },
  { label: 'Business' },
  { label: 'Location' },
  { label: 'Services' },
  { label: 'Media' },
  { label: 'Review' },
]

const isValidPhone = (value: string) => {
  const phoneRegex = /^(\+234|0)[789][01]\d{8}$/
  return phoneRegex.test(value.replace(/\s/g, ''))
}
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export function BusinessRegistration() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<WizardData>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { user } = useAuth()

  const setField = <K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!(key in prev)) return prev
      const next = { ...prev }
      delete next[key as string]
      return next
    })
  }

  const uploadMedia = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.upload<{ url: string }>('/upload/image', formData)
    if (!response.success) {
      throw new Error(response.message || 'Upload failed')
    }
    return response.data.url
  }

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c.slug, label: c.name })),
    [],
  )
  const locationOptions = useMemo(
    () => locations.map((l) => ({ value: l.id, label: l.name })),
    [],
  )
  const townOptions = useMemo(
    () => (data.lga ? (townsByLocation[data.lga] ?? []).map((t) => ({ value: t, label: t })) : []),
    [data.lga],
  )

  const updateService = (index: number, patch: Partial<ServiceEntry>) => {
    setData((prev) => {
      const services = prev.services.map((s, i) => (i === index ? { ...s, ...patch } : s))
      return { ...prev, services }
    })
  }

  const addService = () => {
    setData((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { name: '', category: '', description: '', price: '', contactForPrice: false },
      ],
    }))
  }

  const removeService = (index: number) => {
    setData((prev) => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }))
  }

  const validateStep = (target: number): boolean => {
    const next = { ...errors }
    let ok = true

    if (target === 1) {
      if (!data.fullName.trim()) { next.fullName = 'Full name is required'; ok = false }
      else if (data.fullName.trim().length < 2) { next.fullName = 'Name must be at least 2 characters'; ok = false }
      if (!data.phone.trim()) { next.phone = 'Phone number is required'; ok = false }
      else if (!isValidPhone(data.phone)) { next.phone = 'Enter a valid Nigerian phone (e.g. +234 801 234 5678)'; ok = false }
      if (!data.email.trim()) { next.email = 'Email address is required'; ok = false }
      else if (!isValidEmail(data.email)) { next.email = 'Enter a valid email address'; ok = false }
      if (!data.password) { next.password = 'Password is required'; ok = false }
      else if (data.password.length < 8) { next.password = 'Password must be at least 8 characters'; ok = false }
      if (!data.confirmPassword) { next.confirmPassword = 'Confirm your password'; ok = false }
      else if (data.confirmPassword !== data.password) { next.confirmPassword = 'Passwords do not match'; ok = false }
    }

    if (target === 2) {
      if (!data.businessName.trim()) { next.businessName = 'Business name is required'; ok = false }
      if (!data.category) { next.category = 'Select a business category'; ok = false }
      if (!data.description.trim()) { next.description = 'Describe your business'; ok = false }
      else if (data.description.trim().length < 20) { next.description = 'Description should be at least 20 characters'; ok = false }
      if (!data.businessPhone.trim()) { next.businessPhone = 'Business phone is required'; ok = false }
      else if (!isValidPhone(data.businessPhone)) { next.businessPhone = 'Enter a valid Nigerian phone'; ok = false }
      if (data.businessEmail && !isValidEmail(data.businessEmail)) { next.businessEmail = 'Enter a valid email'; ok = false }
    }

    if (target === 3) {
      if (!data.state.trim()) { next.state = 'State is required'; ok = false }
      if (!data.lga) { next.lga = 'Select your LGA'; ok = false }
      if (!data.town.trim()) { next.town = 'Select your city/town'; ok = false }
      if (data.address.trim().length < 8) { next.address = 'Enter a complete business address'; ok = false }
    }

    if (target === 4) {
      data.services.forEach((service, i) => {
        if (!service.name.trim()) { next[`svc-name-${i}`] = 'Service name is required'; ok = false }
        if (!service.category.trim()) { next[`svc-category-${i}`] = 'Category is required'; ok = false }
        if (!service.contactForPrice && !service.price.trim()) { next[`svc-price-${i}`] = 'Add a price or enable "Contact for price"'; ok = false }
      })
    }

    setErrors(next)
    return ok
  }

  const goNext = () => {
    if (!validateStep(step)) {
      return
    }
    setStep((s) => Math.min(s + 1, 6))
  }

  const goBack = () => {
    if (step === 2) setErrors({})
    setStep((s) => Math.max(s - 1, 1))
  }

  const goToStep = (target: number) => {
    // Allow navigation only forward through validated steps or back to prior steps.
    if (target < step) {
      setErrors({})
      setStep(target)
      return
    }
    for (let s = step; s < target; s += 1) {
      if (!validateStep(s)) return
    }
    setStep(target)
  }

  const completedSteps = useMemo(() => {
    const done: number[] = []
    for (let s = 1; s < step; s += 1) done.push(s)
    return done
  }, [step])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateStep(6)) return
    if (!user) {
      setSubmitError('You must be logged in to register a business')
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const openingHoursArray = Object.entries(data.openingHours).map(([days, hours]) => ({
        days,
        hours: hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`,
      }))

      const servicesWithPrices: Record<string, string> = {}
      data.services.forEach((service, index) => {
        if (service.name && service.price) {
          servicesWithPrices[service.name] = service.price
        }
      })

      const businessData = {
        name: data.businessName,
        description: data.description,
        category: data.category,
        state: data.state,
        lga: data.lga,
        town: data.town,
        area: data.area,
        busStop: data.busStop || '',
        address: data.address,
        phone: data.businessPhone,
        whatsapp: data.businessPhone,
        email: data.businessEmail,
        website: data.website,
        logo: data.logo[0]?.uploadedUrl || data.logo[0]?.src || '',
        coverImage: data.cover[0]?.uploadedUrl || data.cover[0]?.src || '',
        gallery: data.photos.map(p => p.uploadedUrl || p.src),
        services: data.services.map(s => s.name),
        servicePrices: servicesWithPrices,
        openingHours: openingHoursArray,
        socialLinks: data.socialLinks,
        priceRange: data.priceRange,
        latitude: data.latitude,
        longitude: data.longitude,
        placeId: data.placeId,
        formattedAddress: data.formattedAddress,
        locationData: {
          state: data.state,
          lga: data.lga,
          town: data.town,
          area: data.area,
          busStop: data.busStop || '',
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          placeId: data.placeId,
          formattedAddress: data.formattedAddress,
        },
        status: 'pending',
        featured: false,
      }

      await businessService.create(businessData)
      setSubmitted(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit registration. Please try again.'
      setSubmitError(message)
    } finally {
      setSubmitting(false)
    }
  }

  // Clean up any errors that reference removed services
  const serviceError = (key: string, index: number) => errors[`${key}-${index}`]

  if (submitted) {
    return (
      <main className="page business-registration-page">
        <div className="container container--narrow">
          <div className="auth-card success-state">
            <div className="success-icon">
              <CheckCircle2 size={48} />
            </div>
            <h1>Registration Submitted</h1>
            <p className="business-registration__demo-message">
              Your business registration has been submitted for review. You will be notified once it's approved.
            </p>
            <div className="business-registration__demo-actions">
              <ButtonLink to="/business/dashboard" variant="primary">Go to Dashboard</ButtonLink>
              <ButtonLink to="/" variant="outline">Return Home</ButtonLink>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page business-registration-page">
      <div className="container container--narrow">
        <div className="business-registration__header">
          <Link to="/business" className="auth-back-link" aria-label="Back to business portal">
            <ArrowLeft size={20} />
          </Link>
          <div className="business-registration__title-wrap">
            <div className="business-registration__brand" aria-hidden="true">
              <Building2 size={28} />
            </div>
            <div>
              <h1 className="business-registration__title">Register Your Business</h1>
              <p className="business-registration__subtitle">Step {step} of {STEPS.length} — {STEPS[step - 1].label}</p>
            </div>
          </div>
        </div>

        <FormProgress
          steps={STEPS}
          currentStep={step}
          completedSteps={completedSteps}
          className="business-registration__progress"
        />

        <form onSubmit={step === 6 ? handleSubmit : (e) => e.preventDefault()} className="business-registration__card" noValidate>

        {submitError && (
            <div className="auth-error" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{submitError}</span>
            </div>
          )}
          {step === 1 && (
            <div className="business-registration__section">
              <h2 className="business-registration__section-title">Owner Details</h2>
              <div className="form-grid">
                <Input
                  label="Full Name" name="fullName" placeholder="Enter your full name" autoComplete="name"
                  value={data.fullName} error={errors.fullName} icon={<User size={18} />}
                  onChange={(e) => setField('fullName', e.target.value)}
                />
                <Input
                  label="Phone Number" name="phone" type="tel" placeholder="+234 XXX XXX XXXX" autoComplete="tel"
                  value={data.phone} error={errors.phone} icon={<Phone size={18} />}
                  onChange={(e) => setField('phone', e.target.value)}
                />
                <Input
                  label="Email Address" name="email" type="email" placeholder="you@example.com" autoComplete="email"
                  value={data.email} error={errors.email} icon={<Mail size={18} />}
                  onChange={(e) => setField('email', e.target.value)}
                />
                <Input
                  label="Password" name="password" type="password" placeholder="At least 8 characters" autoComplete="new-password"
                  value={data.password} error={errors.password} icon={<Lock size={18} />}
                  onChange={(e) => setField('password', e.target.value)}
                />
                <Input
                  label="Confirm Password" name="confirmPassword" type="password" placeholder="Re-enter your password" autoComplete="new-password"
                  value={data.confirmPassword} error={errors.confirmPassword} icon={<Lock size={18} />}
                  onChange={(e) => setField('confirmPassword', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="business-registration__section">
              <h2 className="business-registration__section-title">Business Information</h2>
              <div className="form-grid">
                <Input
                  label="Business Name" name="businessName" placeholder="Enter your business name" autoComplete="organization"
                  value={data.businessName} error={errors.businessName} icon={<Building2 size={18} />}
                  onChange={(e) => setField('businessName', e.target.value)}
                />
                <Select
                  label="Business Category" name="category" options={categoryOptions} placeholder="Select a category"
                  value={data.category} error={errors.category} icon={<FolderOpen size={18} />}
                  onChange={(v) => setField('category', v)}
                />
                <div className="form-grid__full">
                  <Textarea
                    label="Business Description" name="description" rows={4}
                    placeholder="Tell customers what your business does"
                    value={data.description} error={errors.description}
                    onChange={(e) => setField('description', e.target.value)}
                  />
                </div>
                <Input
                  label="Business Phone" name="businessPhone" type="tel" placeholder="+234 XXX XXX XXXX" autoComplete="tel"
                  value={data.businessPhone} error={errors.businessPhone} icon={<Phone size={18} />}
                  onChange={(e) => setField('businessPhone', e.target.value)}
                />
                <Input
                  label="Business Email" name="businessEmail" type="email" placeholder="business@example.com" autoComplete="email"
                  value={data.businessEmail} error={errors.businessEmail} icon={<Mail size={18} />}
                  onChange={(e) => setField('businessEmail', e.target.value)}
                />
                <Input
                  label="Website (optional)" name="website" type="url" placeholder="https://example.com"
                  value={data.website} error={errors.website} icon={<GlobeIcon />}
                  onChange={(e) => setField('website', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="business-registration__section">
              <h2 className="business-registration__section-title">Business Location</h2>
              <p className="business-registration__section-hint">
                Select from the Oyo State locations already on OyoConnect.
              </p>
              <div className="form-grid">
                <Select
                  label="State" name="state" options={[{ value: 'Oyo', label: 'Oyo' }]} placeholder="Select state"
                  value={data.state} error={errors.state} icon={<MapPin size={18} />}
                  onChange={(v) => setField('state', v)}
                />
                <Select
                  label="LGA" name="lga" options={locationOptions} placeholder="Select your LGA"
                  value={data.lga} error={errors.lga} icon={<MapPin size={18} />}
                  onChange={(v) => { setField('lga', v); setField('town', '') }}
                />
                <Select
                  label="City / Town" name="town" options={townOptions} placeholder={data.lga ? 'Select your city/town' : 'Select an LGA first'}
                  value={data.town} error={errors.town} icon={<MapPin size={18} />}
                  onChange={(v) => setField('town', v)}
                />
                <Input
                  label="Area" name="area" placeholder="Neighbourhood / area"
                  value={data.area} error={errors.area} icon={<MapPin size={18} />}
                  onChange={(e) => setField('area', e.target.value)}
                />
                <div className="form-grid__full">
                  <Textarea
                    label="Business Address" name="address" rows={2} placeholder="Street, house number, landmarks"
                    value={data.address} error={errors.address}
                    onChange={(e) => setField('address', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="business-registration__section">
              <div className="business-registration__section-row">
                <div>
                  <h2 className="business-registration__section-title">Services</h2>
                  <p className="business-registration__section-hint">Add the services your business offers.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addService}>
                  <Plus size={16} /> Add Service
                </Button>
              </div>

              {data.services.length === 0 ? (
                <div className="business-registration__empty">
                  <FolderOpen size={48} aria-hidden="true" />
                  <p>No services added yet. Add your first service to help customers understand what you offer.</p>
                  <Button type="button" variant="primary" onClick={addService}>
                    <Plus size={16} /> Add Your First Service
                  </Button>
                </div>
              ) : (
                <div className="business-registration__services">
                  {data.services.map((service, index) => (
                    <div key={index} className="business-registration__service">
                      <div className="business-registration__service-head">
                        <h3 className="business-registration__service-title">Service {index + 1}</h3>
                        {data.services.length > 1 && (
                          <button type="button" className="business-registration__service-remove" onClick={() => removeService(index)}>
                            <Trash2 size={16} /> Remove
                          </button>
                        )}
                      </div>
                      <div className="form-grid">
                        <Input
                          label="Service Name" name={`svc-name-${index}`} placeholder="e.g. Haircut & styling"
                          value={service.name} error={serviceError('svc-name', index)}
                          onChange={(e) => updateService(index, { name: e.target.value })}
                        />
                        <Select
                          label="Category" name={`svc-category-${index}`} options={categoryOptions} placeholder="Select category"
                          value={service.category} error={serviceError('svc-category', index)}
                          onChange={(v) => updateService(index, { category: v })}
                        />
                        <div className="form-grid__full">
                          <Textarea
                            label="Description" name={`svc-desc-${index}`} rows={2} placeholder="Describe this service"
                            value={service.description}
                            onChange={(e) => updateService(index, { description: e.target.value })}
                          />
                        </div>
                        <div className={`form-grid__field ${service.contactForPrice ? 'form-grid__field--disabled' : ''}`}>
                          <Input
                            label="Price (₦)" name={`svc-price-${index}`} type="number" min="0" placeholder="Enter price (optional if set below)"
                            value={service.price} error={serviceError('svc-price', index)} disabled={service.contactForPrice}
                            onChange={(e) => updateService(index, { price: e.target.value })}
                          />
                        </div>
                        <div className="form-grid__field">
                          <label className="checkbox-wrapper business-registration__contact-price">
                            <input
                              type="checkbox"
                              checked={service.contactForPrice}
                              onChange={(e) => updateService(index, { contactForPrice: e.target.checked, price: e.target.checked ? '' : service.price })}
                            />
                            <span className="checkbox-custom" aria-hidden="true" />
                            <span>Contact for price</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="business-registration__section">
              <h2 className="business-registration__section-title">Business Media</h2>
              <p className="business-registration__section-hint">Images will be uploaded to the server when you submit.</p>
              <div className="business-registration__media">
                <MediaUpload
                  label="Business Logo" variant="single" maxFiles={1} recommended="Square · PNG or JPG"
                  value={data.logo} onChange={(items) => setField('logo', items.slice(-1))}
                  onUpload={uploadMedia}
                />
                <MediaUpload
                  label="Cover Image" variant="single" maxFiles={1} recommended="Wide banner · 1200×400px"
                  value={data.cover} onChange={(items) => setField('cover', items.slice(-1))}
                  onUpload={uploadMedia}
                />
                <MediaUpload
                  label="Business Photos" variant="grid" maxFiles={6} recommended="PNG or JPG"
                  value={data.photos} onChange={(items) => setField('photos', items)}
                  onUpload={uploadMedia}
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="business-registration__section">
              <h2 className="business-registration__section-title">Review Your Information</h2>
              <p className="business-registration__section-hint">Check everything looks right before submitting.</p>

              <div className="review-card">
                <div className="review-card__header">
                  <h3 className="review-card__title">Owner Details</h3>
                  <button type="button" className="review-card__edit" onClick={() => goToStep(1)}><Eye size={15} /> Edit</button>
                </div>
                <ReviewRow label="Full Name" value={data.fullName} />
                <ReviewRow label="Phone" value={data.phone} />
                <ReviewRow label="Email" value={data.email} />
              </div>

              <div className="review-card">
                <div className="review-card__header">
                  <h3 className="review-card__title">Business Information</h3>
                  <button type="button" className="review-card__edit" onClick={() => goToStep(2)}><Eye size={15} /> Edit</button>
                </div>
                <ReviewRow label="Business Name" value={data.businessName} />
                <ReviewRow label="Category" value={categories.find((c) => c.slug === data.category)?.name || data.category} />
                <ReviewRow label="Phone" value={data.businessPhone} />
                <ReviewRow label="Email" value={data.businessEmail || '—'} />
                <ReviewRow label="Website" value={data.website || '—'} />
                <ReviewRow label="Description" value={data.description} multiline />
              </div>

              <div className="review-card">
                <div className="review-card__header">
                  <h3 className="review-card__title">Location</h3>
                  <button type="button" className="review-card__edit" onClick={() => goToStep(3)}><Eye size={15} /> Edit</button>
                </div>
                <ReviewRow label="State" value={data.state} />
                <ReviewRow label="LGA" value={locations.find((l) => l.id === data.lga)?.name || data.lga} />
                <ReviewRow label="City / Town" value={data.town} />
                <ReviewRow label="Area" value={data.area || '—'} />
                <ReviewRow label="Address" value={data.address} />
              </div>

              <div className="review-card">
                <div className="review-card__header">
                  <h3 className="review-card__title">Services ({data.services.length})</h3>
                  <button type="button" className="review-card__edit" onClick={() => goToStep(4)}><Eye size={15} /> Edit</button>
                </div>
                {data.services.length === 0 ? (
                  <p className="review-card__empty">No services added.</p>
                ) : (
                  data.services.map((service, index) => (
                    <ReviewRow
                      key={index}
                      label={service.name || `Service ${index + 1}`}
                      value={`${service.category ? `${categories.find((c) => c.slug === service.category)?.name || service.category} · ` : ''}${service.contactForPrice ? 'Contact for price' : `₦${service.price}`}`}
                    />
                  ))
                )}
              </div>

              <div className="review-card">
                <div className="review-card__header">
                  <h3 className="review-card__title">Business Media</h3>
                  <button type="button" className="review-card__edit" onClick={() => goToStep(5)}><Eye size={15} /> Edit</button>
                </div>
                <div className="review-card__media">
                  <div>
                    <span className="review-card__media-label">Logo</span>
                    {data.logo[0] ? <img src={data.logo[0].src} alt="Business logo preview" className="review-card__thumb" /> : <span className="review-card__media-empty"><ImageIcon size={16} /> Not added</span>}
                  </div>
                  <div>
                    <span className="review-card__media-label">Cover</span>
                    {data.cover[0] ? <img src={data.cover[0].src} alt="Cover preview" className="review-card__thumb" /> : <span className="review-card__media-empty"><ImageIcon size={16} /> Not added</span>}
                  </div>
                  <div>
                    <span className="review-card__media-label">Photos</span>
                    <span className="review-card__media-empty"><ImageIcon size={16} /> {data.photos.length} added</span>
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className="auth-error" role="alert">
                  <AlertCircle size={18} aria-hidden="true" />
                  <span>{errors.submit}</span>
                </div>
              )}
            </div>
          )}

          <div className="business-registration__nav">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={goBack}>
                <ArrowLeft size={16} /> Back
              </Button>
            )}
            {step < 6 ? (
              <Button type="button" variant="primary" onClick={goNext} className="business-registration__nav-next">
                Continue <ArrowRight size={16} />
              </Button>
            ) : (
              <p className="business-registration__agree-hint">
                <ShieldCheck size={16} aria-hidden="true" />
                By submitting, you agree to our Terms of Service and Privacy Policy.
              </p>
            )}
          </div>

          {step === 6 && (
            <div className="business-registration__submit-row">
              <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Registration <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </div>
          )}
        </form>
      </div>
    </main>
  )
}

function ReviewRow({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="review-row">
      <span className="review-row__label">{label}</span>
      <span className={`review-row__value ${multiline ? 'review-row__value--multiline' : ''}`}>{value || '—'}</span>
    </div>
  )
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

export default BusinessRegistration
