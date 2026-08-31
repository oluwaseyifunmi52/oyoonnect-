import { useState, useEffect, useMemo, useCallback } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, MessageCircle, Image, MapPin, Phone, Mail, Globe, X, Save, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input, Select } from '../components/ui/Input'
import { Button, ButtonLink } from '../components/ui/Button'
import { SectionHeading } from '../components/ui/SectionHeading'
import { FormProgress } from '../components/common/FormProgress'
import { businessService } from '../services/businessService'
import { notificationService } from '../services/notificationService'
import { draftService } from '../services/businessService'
import { useAuth } from '../context/AuthContext'
import { categories } from '../data/categories'
import { locations, getAreasForLocation, getTownsForLocation, getBusStopsForLocation, getLocationCenter } from '../data/locations'
import { GoogleLocationPicker } from '../components/maps/GoogleLocationPicker'
import type { BusinessLocation } from '../types/business'

const STEPS = [
  { label: 'Basic Info', href: '/list-business?step=1' },
  { label: 'Category & Location', href: '/list-business?step=2' },
  { label: 'Contact', href: '/list-business?step=3' },
  { label: 'Photos', href: '/list-business?step=4' },
  { label: 'Hours', href: '/list-business?step=5' },
  { label: 'Review', href: '/list-business?step=6' },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const initialForm = {
  name: '',
  description: '',
  ownerName: '',
  category: '',
  // New location hierarchy
  lga: '',
  town: '',
  area: '',
  busStop: '',
  // Legacy fields (kept for compatibility)
  address: '',
  city: '',
  state: 'Oyo',
  // Map coordinates
  latitude: 0,
  longitude: 0,
  placeId: '',
  formattedAddress: '',
  phone: '',
  whatsapp: '',
  email: '',
  website: '',
  logo: null as File | null,
  coverImage: null as File | null,
  gallery: [] as File[],
  logoPreview: '',
  coverPreview: '',
  galleryPreviews: [] as string[],
  openingHours: DAYS.reduce((acc, day) => ({ ...acc, [day]: { open: '09:00', close: '18:00', closed: false } }), {} as Record<string, { open: string; close: string; closed: boolean }>),
}

function ListBusiness() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isBusinessOwner: _isBusinessOwner } = useAuth()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<typeof initialForm>({ ...initialForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [maxStepReached, setMaxStepReached] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/list-business' } })
    }
  }, [isAuthenticated, navigate])

  const updateForm = useCallback((field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }, [])

  const updateNestedForm = useCallback((section: string, field: string, value: string | Record<string, string | boolean>) => {
    setForm((prev) => {
      const currentSection = prev[section as keyof typeof prev] as Record<string, unknown> || {}
      const newValue = typeof value === 'string' ? { ...currentSection, [field]: value } : { ...currentSection, ...value }
      return { ...prev, [section]: newValue }
    })
    setErrors((prev) => ({ ...prev, [`${section}.${field}`]: '' }))
  }, [])

  const saveDraft = useCallback(() => {
    if (user) {
      draftService.saveDraft(`business-listing-${user.id}`, form)
      setDraftSaved(true)
      setTimeout(() => setDraftSaved(false), 2000)
    }
  }, [form, user])

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (stepNum) {
      case 1:
        if (!form.name.trim()) newErrors.name = 'Business name is required'
        if (!form.description.trim()) newErrors.description = 'Description is required'
        if (!form.ownerName.trim()) newErrors.ownerName = 'Owner name is required'
        break
      case 2:
        if (!form.category) newErrors.category = 'Category is required'
        if (!form.lga) newErrors.lga = 'LGA is required'
        if (!form.town) newErrors.town = 'Town/City is required'
        if (!form.address.trim()) newErrors.address = 'Address is required'
        break
      case 3:
        if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      saveDraft()
      if (step < 6) {
        const nextStep = step + 1
        setStep(nextStep)
        setMaxStepReached(prev => Math.max(prev, nextStep))
      }
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateStep(step) || !user) return

    setSubmitting(true)
    saveDraft()

    try {
      const openingHours = Object.entries(form.openingHours).map(([days, hours]) => ({
        days,
        hours: hours.closed ? 'Closed' : `${hours.open} – ${hours.close}`,
      }))

      businessService.create({
        name: form.name,
        description: form.description,
        category: form.category,
        address: form.address,
        location: form.town || form.city,
        area: form.area,
        state: form.state,
        phone: form.phone,
        whatsapp: form.whatsapp || form.phone,
        email: form.email,
        website: form.website,
        openingHours,
        image: form.coverPreview || '',
        gallery: form.galleryPreviews.length > 0 ? form.galleryPreviews : [form.coverPreview || ''],
        featured: false,
        priceRange: '##',
        status: 'pending',
        ownerId: user.id,
        verified: false,
        services: [],
        busStop: form.busStop,
        latitude: form.latitude || undefined,
        longitude: form.longitude || undefined,
        locationData: {
          lga: form.lga,
          town: form.town,
          area: form.area,
          busStop: form.busStop,
          address: form.address,
          latitude: form.latitude,
          longitude: form.longitude,
          placeId: form.placeId || undefined,
          formattedAddress: form.formattedAddress || undefined,
        } as BusinessLocation,
      })

      // Create notification for the business owner
      notificationService.addNotification({
        category: 'business',
        title: 'Business Listing Submitted',
        message: `Your listing "${form.name}" has been submitted for review and will be published once verified.`,
        read: false,
        createdAt: new Date().toISOString(),
        href: '/business/dashboard',
      })

      draftService.clearDraft(`business-listing-${user.id}`)
      setSubmitted(true)
    } catch (err) {
      console.error('Failed to submit listing:', err)
      alert('Failed to submit listing. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = (field: 'logo' | 'coverImage' | 'gallery', files: FileList) => {
    const fileArray = Array.from(files)
    const previews = fileArray.map((file) => URL.createObjectURL(file))

    if (field === 'gallery') {
      setForm((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...fileArray],
        galleryPreviews: [...prev.galleryPreviews, ...previews],
      }))
    } else {
      const previewKey = field === 'logo' ? 'logoPreview' : 'coverPreview'
      setForm((prev) => ({
        ...prev,
        [field]: fileArray[0],
        [previewKey]: previews[0],
      }))
    }
  }

  const removeImage = (field: 'logo' | 'coverImage' | 'gallery', index?: number) => {
    if (field === 'gallery' && index !== undefined) {
      setForm((prev) => {
        const newGallery = prev.gallery.filter((_, i) => i !== index)
        const newPreviews = prev.galleryPreviews.filter((_, i) => i !== index)
        URL.revokeObjectURL(prev.galleryPreviews[index])
        return { ...prev, gallery: newGallery, galleryPreviews: newPreviews }
      })
    } else {
      const previewKey = field === 'logo' ? 'logoPreview' : 'coverPreview'
      const previewUrl = form[previewKey] as string | undefined
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setForm((prev) => ({ ...prev, [field]: null, [previewKey]: '' }))
    }
  }

  const completedSteps = useMemo(() => {
    const steps: number[] = []
    // Only mark steps as completed if the user has actually reached them
    for (let i = 1; i <= maxStepReached && i <= 5; i++) {
      steps.push(i)
    }
    // Step 6 (Review) is only completed when all previous steps are done
    if (maxStepReached >= 6) {
      steps.push(6)
    }
    return steps
  }, [maxStepReached])

  if (submitted) {
    return (
      <main className="page container">
        <div className="success-card">
          <div className="success-card__icon" aria-hidden="true">
            <CheckCircle2 size={44} />
          </div>
          <h1 className="success-card__title">Listing submitted for review!</h1>
          <p className="success-card__text">
            Thanks, {form.name}. Your business listing has been submitted and is now <strong>pending review</strong>.
            Our team will review your details and get in touch within 1–2 working days to activate your listing.
          </p>
          <div className="success-card__actions">
            <ButtonLink to="/" variant="outline">
              Back to home
            </ButtonLink>
            <ButtonLink to="/owner/dashboard" variant="primary">
              View my dashboard
            </ButtonLink>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page list-business-page">
      <div className="container container--narrow">
        <SectionHeading
          eyebrow="Grow your reach"
          title="List your business"
          subtitle="Join hundreds of businesses across Oyo State getting discovered every day. Sign up for free and create your listing in minutes."
        />

        <FormProgress
          steps={STEPS}
          currentStep={step}
          completedSteps={completedSteps}
          className="list-business-progress"
        />

        <form onSubmit={handleSubmit} className="list-business-form" noValidate>
          {step === 1 && (
            <div className="form-step" role="step" aria-labelledby="step1-heading">
              <h2 id="step1-heading" className="form-step-title">Basic Information</h2>
              <p className="form-step-description">Tell us about your business</p>

              <Input
                label="Business name"
                name="name"
                placeholder="e.g. Adebayo Auto Works"
                required
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                error={errors.name}
                icon={<User size={18} />}
              />

              <div className="field">
                <label className="field__label" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  className={`input textarea ${errors.description ? 'input--error' : ''}`}
                  rows={5}
                  placeholder="Describe your business, services, and what makes you unique..."
                  required
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                />
                {errors.description && <p className="field__error">{errors.description}</p>}
              </div>

              <Input
                label="Owner name"
                name="ownerName"
                placeholder="Your full name"
                required
                value={form.ownerName}
                onChange={(e) => updateForm('ownerName', e.target.value)}
                error={errors.ownerName}
                icon={<User size={18} />}
              />
            </div>
          )}

          {step === 2 && (
            <div className="form-step" role="step" aria-labelledby="step2-heading">
              <h2 id="step2-heading" className="form-step-title">Category & Location</h2>
              <p className="form-step-description">Where can customers find you? Select your LGA, then town, area, and nearest landmark. Finally, place a pin on the map for the exact location.</p>

              <Select
                label="Category"
                name="category"
                required
                value={form.category}
                onChange={(value) => updateForm('category', value)}
                options={categories.map((c) => ({ value: c.slug, label: c.name }))}
                placeholder="Select a category"
              />

              <div className="location-hierarchy">
                <div className="form-row">
                  <Select
                    label="LGA (Local Government Area)"
                    name="lga"
                    required
                    value={form.lga}
                    onChange={(value) => {
                      updateForm('lga', value)
                      if (value) {
                        updateForm('town', '')
                        updateForm('area', '')
                        updateForm('busStop', '')
                      }
                    }}
                    options={locations.map((l) => ({ value: l.name, label: l.name }))}
                    placeholder="Select LGA"
                  />

                  <Select
                    label="Town / City"
                    name="town"
                    value={form.town}
                    onChange={(value) => {
                      updateForm('town', value)
                      if (value) {
                        updateForm('area', '')
                        updateForm('busStop', '')
                      }
                    }}
                    options={form.lga
                        ? getTownsForLocation(locations.find((l) => l.name === form.lga)?.id ?? '').map((t) => ({ value: t, label: t }))
                        : []}
                    placeholder="Select town"
                    disabled={!form.lga}
                  />
                </div>

                <div className="form-row">
                  <Select
                    label="Area / Neighborhood"
                    name="area"
                    value={form.area}
                    onChange={(value) => updateForm('area', value)}
                    options={form.town ? getAreasForLocation(form.town).map((a) => ({ value: a, label: a })) : []}
                    placeholder="Select area"
                    disabled={!form.town}
                  />

                  <Select
                    label="Nearest Bus Stop / Landmark"
                    name="busStop"
                    value={form.busStop}
                    onChange={(value) => updateForm('busStop', value)}
                    options={form.lga
                        ? getBusStopsForLocation(locations.find((l) => l.name === form.lga)?.id ?? '').map((b) => ({ value: b, label: b }))
                        : []}
                    placeholder="Select landmark"
                    disabled={!form.lga}
                  />
                </div>
              </div>

              <Input
                label="Street address"
                name="address"
                placeholder="e.g. 12 Ring Road, Challenge"
                required
                value={form.address}
                onChange={(e) => updateForm('address', e.target.value)}
                error={errors.address}
                icon={<MapPin size={18} />}
              />

              <div className="map-section">
                <label className="field__label">Exact Location on Map</label>
                <p className="field__hint">Drag the marker or click on the map to set the exact business location. Use the crosshair button to use your current location.</p>
                <GoogleLocationPicker
                  latitude={form.latitude ? Number(form.latitude) : undefined}
                  longitude={form.longitude ? Number(form.longitude) : undefined}
                  onLocationChange={(loc) => {
                    updateForm('latitude', String(loc.lat))
                    updateForm('longitude', String(loc.lng))
                    if (loc.address) updateForm('formattedAddress', loc.address)
                    if (loc.placeId) updateForm('placeId', loc.placeId)
                  }}
                  apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                  height={350}
                  defaultCenter={form.lga
                    ? getLocationCenter(locations.find((l) => l.name === form.lga)?.id ?? '')
                    : { lat: 7.3775, lng: 3.9470 }}
                  defaultZoom={form.lga ? 13 : 12}
                />
                {(form.latitude || form.longitude) && (
                  <div className="map-coords-display">
                    <p><strong>Coordinates:</strong> {form.latitude}, {form.longitude}</p>
                    {form.formattedAddress && <p><strong>Address:</strong> {form.formattedAddress}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step" role="step" aria-labelledby="step3-heading">
              <h2 id="step3-heading" className="form-step-title">Contact Information</h2>
              <p className="form-step-description">How can customers reach you?</p>

              <div className="form-row">
                <Input
                  label="Phone number"
                  name="phone"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  required
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  error={errors.phone}
                  icon={<Phone size={18} />}
                />

                <Input
                  label="WhatsApp number"
                  name="whatsapp"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={form.whatsapp}
                  onChange={(e) => updateForm('whatsapp', e.target.value)}
                  hint="Optional - defaults to phone number"
                  icon={<MessageCircle size={18} />}
                />
              </div>

              <div className="form-row">
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="business@example.com"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  icon={<Mail size={18} />}
                />

                <Input
                  label="Website"
                  name="website"
                  type="url"
                  placeholder="https://yourbusiness.com"
                  value={form.website}
                  onChange={(e) => updateForm('website', e.target.value)}
                  icon={<Globe size={18} />}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-step" role="step" aria-labelledby="step4-heading">
              <h2 id="step4-heading" className="form-step-title">Photos</h2>
              <p className="form-step-description">Add photos to showcase your business (optional)</p>

              <div className="photo-upload-grid">
                <PhotoUploadField
                  label="Logo"
                  preview={form.logoPreview}
                  onUpload={(files) => handleImageUpload('logo', files)}
                  onRemove={() => removeImage('logo')}
                  accept="image/*"
                />

                <PhotoUploadField
                  label="Cover image"
                  preview={form.coverPreview}
                  onUpload={(files) => handleImageUpload('coverImage', files)}
                  onRemove={() => removeImage('coverImage')}
                  accept="image/*"
                />
              </div>

              <div className="photo-upload-field">
                <label className="field__label">Gallery</label>
                <div className="gallery-upload">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleImageUpload('gallery', e.target.files)}
                    className="gallery-file-input"
                    id="gallery-upload"
                  />
                  <label htmlFor="gallery-upload" className="gallery-upload-label">
                    <Image size={24} aria-hidden="true" />
                    <span>Add gallery photos</span>
                    <span className="gallery-count">{form.gallery.length} photos</span>
                  </label>
                  {form.galleryPreviews.length > 0 && (
                    <div className="gallery-previews">
                      {form.galleryPreviews.map((preview, index) => (
                        <div key={index} className="gallery-preview">
                          <img src={preview} alt={`Gallery ${index + 1}`} />
                          <button
                            type="button"
                            className="gallery-remove"
                            onClick={() => removeImage('gallery', index)}
                            aria-label={`Remove photo ${index + 1}`}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="form-step" role="step" aria-labelledby="step5-heading">
              <h2 id="step5-heading" className="form-step-title">Opening Hours</h2>
              <p className="form-step-description">Set your business hours for each day</p>

              <div className="hours-grid">
                {DAYS.map((day) => {
                  const hours = form.openingHours[day] || { open: '09:00', close: '18:00', closed: false }
                  return (
                    <div key={day} className={`hours-day ${hours.closed ? 'closed' : ''}`}>
                      <label className="hours-day-label">
                        <input
                          type="checkbox"
                          checked={hours.closed}
                          onChange={(e) => updateNestedForm('openingHours', day, { ...hours, closed: e.target.checked })}
                        />
                        <span>{day}</span>
                      </label>
                      {!hours.closed && (
                        <div className="hours-inputs">
                          <Input
                            label="Opens"
                            name={`${day}-open`}
                            type="time"
                            value={hours.open}
                            onChange={(e) => updateNestedForm('openingHours', day, { ...hours, open: e.target.value })}
                            className="hours-time-input"
                          />
                          <Input
                            label="Closes"
                            name={`${day}-close`}
                            type="time"
                            value={hours.close}
                            onChange={(e) => updateNestedForm('openingHours', day, { ...hours, close: e.target.value })}
                            className="hours-time-input"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="hours-actions">
                <Button type="button" variant="outline" onClick={() => {
                  const newHours = DAYS.reduce((acc, day) => ({ ...acc, [day]: { open: '09:00', close: '18:00', closed: day === 'Sunday' } }), {} as typeof form.openingHours)
                  setForm((prev) => ({ ...prev, openingHours: newHours }))
                }}>
                  Reset to defaults
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  const newHours = DAYS.reduce((acc, day) => ({ ...acc, [day]: { open: '00:00', close: '00:00', closed: true } }), {} as typeof form.openingHours)
                  setForm((prev) => ({ ...prev, openingHours: newHours }))
                }}>
                  Mark all closed
                </Button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="form-step" role="step" aria-labelledby="step6-heading">
              <h2 id="step6-heading" className="form-step-title">Review & Submit</h2>
              <p className="form-step-description">Please review your listing before submitting</p>

              <div className="review-summary">
                <div className="review-section">
                  <h3>Basic Information</h3>
                  <dl>
                    <dt>Business name</dt>
                    <dd>{form.name || '—'}</dd>
                    <dt>Description</dt>
                    <dd>{form.description.substring(0, 100)}...</dd>
                    <dt>Owner</dt>
                    <dd>{form.ownerName || '—'}</dd>
                  </dl>
                </div>

                <div className="review-section">
                  <h3>Category & Location</h3>
                  <dl>
                    <dt>Category</dt>
                    <dd>{categories.find((c) => c.slug === form.category)?.name || form.category || '—'}</dd>
                    <dt>LGA</dt>
                    <dd>{form.lga || '—'}</dd>
                    <dt>Town / City</dt>
                    <dd>{form.town || '—'}</dd>
                    <dt>Area</dt>
                    <dd>{form.area || '—'}</dd>
                    <dt>Bus Stop / Landmark</dt>
                    <dd>{form.busStop || '—'}</dd>
                    <dt>Street Address</dt>
                    <dd>{form.address || '—'}</dd>
                    {form.latitude && form.longitude && (
                      <>
                        <dt>Coordinates</dt>
                        <dd>{form.latitude}, {form.longitude}</dd>
                      </>
                    )}
                    {form.formattedAddress && (
                      <>
                        <dt>Map Address</dt>
                        <dd>{form.formattedAddress}</dd>
                      </>
                    )}
                  </dl>
                </div>

                <div className="review-section">
                  <h3>Contact</h3>
                  <dl>
                    <dt>Phone</dt>
                    <dd>{form.phone || '—'}</dd>
                    <dt>WhatsApp</dt>
                    <dd>{form.whatsapp || 'Same as phone'}</dd>
                    <dt>Email</dt>
                    <dd>{form.email || '—'}</dd>
                    <dt>Website</dt>
                    <dd>{form.website || '—'}</dd>
                  </dl>
                </div>

                <div className="review-section">
                  <h3>Photos</h3>
                  <dl>
                    <dt>Logo</dt>
                    <dd>{form.logoPreview ? 'Uploaded' : 'Not provided'}</dd>
                    <dt>Cover</dt>
                    <dd>{form.coverPreview ? 'Uploaded' : 'Not provided'}</dd>
                    <dt>Gallery</dt>
                    <dd>{form.gallery.length} photo(s)</dd>
                  </dl>
                </div>

                <div className="review-section">
                  <h3>Opening Hours</h3>
                  <dl>
                    {DAYS.map((day) => {
                      const hours = form.openingHours[day]
                      return hours ? (
                        <>
                          <dt>{day}</dt>
                          <dd>{hours.closed ? 'Closed' : `${hours.open} – ${hours.close}`}</dd>
                        </>
                      ) : null
                    })}
                  </dl>
                </div>
              </div>

              <div className="review-actions">
                <label className="checkbox-wrapper">
                  <input type="checkbox" name="terms" required />
                  <span className="checkbox-custom" aria-hidden="true" />
                  <span>
                    I confirm this information is accurate and agree to the
                    <a href="/terms" className="auth-link">Terms of Service</a>
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="form-navigation">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handleBack} disabled={submitting}>
                <ChevronLeft size={18} /> Back
              </Button>
            )}
            {step < 6 ? (
              <Button type="button" onClick={handleNext} disabled={submitting}>
                Next <ChevronRight size={18} />
              </Button>
            ) : (
              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit for Review'}
              </Button>
            )}
            {step < 6 && (
              <Button type="button" variant="ghost" onClick={saveDraft} disabled={submitting}>
                <Save size={18} /> Save draft
              </Button>
            )}
          </div>
        </form>

        {draftSaved && (
          <div className="draft-saved-toast" role="status">
            <CheckCircle2 size={18} />
            Draft saved automatically
          </div>
        )}
      </div>
    </main>
  )
}

function PhotoUploadField({
  label,
  preview,
  onUpload,
  onRemove,
  accept,
}: {
  label: string
  preview: string
  onUpload: (files: FileList) => void
  onRemove: () => void
  accept: string
}) {
  return (
    <div className="photo-upload-field">
      <label className="field__label">{label}</label>
      <div className="photo-upload-dropzone">
        {preview ? (
          <div className="photo-preview">
            <img src={preview} alt={`${label} preview`} />
            <button type="button" className="photo-remove" onClick={onRemove} aria-label={`Remove ${label}`}>
              <X size={20} />
            </button>
          </div>
        ) : (
          <label className="photo-upload-label">
            <input
              type="file"
              accept={accept}
              onChange={(e) => e.target.files && onUpload(e.target.files)}
              className="photo-file-input"
            />
            <Image size={32} aria-hidden="true" />
            <span>Click to upload {label.toLowerCase()}</span>
            <span className="photo-upload-hint">PNG, JPG up to 5MB</span>
          </label>
        )}
      </div>
    </div>
  )
}

export default ListBusiness