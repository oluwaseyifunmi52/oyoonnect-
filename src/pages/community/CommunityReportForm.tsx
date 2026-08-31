import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { Button, ButtonLink } from '../../components/ui/Button'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { CommunityPhotoUpload } from '../../components/community/CommunityPhotoUpload'
import { FormProgress } from '../../components/common/FormProgress'
import { GoogleLocationPicker } from '../../components/maps/GoogleLocationPicker'
import { communityCategoryBySlug } from '../../data/communityCategories'
import { communityReportsService } from '../../services/communityReportsService'
import { notificationService } from '../../services/notificationService'
import { locations, getTownsForLocation, getBusStopsForLocation, getLocationCenter } from '../../data/locations'
import { useAuth } from '../../context/AuthContext'
import type { CommunityReportFormData, CommunityCategory } from '../../types/community'

const REPORT_CATEGORIES: CommunityCategory[] = [
  'roads', 'floods', 'traffic', 'power', 'water', 'waste', 'construction', 'security', 'transport', 'photos',
]

const progressSteps = [
  { label: 'Category & Details' },
  { label: 'Location' },
  { label: 'Photos' },
  { label: 'Review & Submit' },
]

export function CommunityReportForm() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [activeStep, setActiveStep] = useState(1)
  const [form, setForm] = useState<Partial<CommunityReportFormData>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const updateForm = useCallback((field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }, [])

  const handleImagesChange = useCallback((images: File[]) => {
    setForm((prev) => ({ ...prev, images }))
  }, [])

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!form.category) newErrors.category = 'Please select a category'
      if (!form.title?.trim()) newErrors.title = 'Title is required'
      if (!form.description?.trim()) newErrors.description = 'Description is required'
      if (form.description && form.description.trim().length < 20) {
        newErrors.description = 'Description must be at least 20 characters'
      }
    }

    if (step === 2) {
      if (!form.lga) newErrors.lga = 'LGA is required'
      if (!form.town) newErrors.town = 'Town/City is required'
      if (!form.address?.trim()) newErrors.address = 'Address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateStep(1) || !validateStep(2) || !user) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const reportData: CommunityReportFormData = {
        title: form.title!.trim(),
        description: form.description!.trim(),
        category: form.category!,
        lga: form.lga!,
        town: form.town!,
        area: form.area,
        busStop: form.busStop,
        address: form.address!.trim(),
        latitude: form.latitude || 0,
        longitude: form.longitude || 0,
        placeId: form.placeId || '',
        formattedAddress: form.formattedAddress || '',
        images: form.images || [],
      }

      await communityReportsService.create({
        ...reportData,
        authorId: user.id,
        authorName: user.name || 'Community Member',
        authorAvatar: user.avatar,
      })

      // Create notification for the reporter
      notificationService.addNotification({
        category: 'community',
        title: 'Community Report Submitted',
        message: `Your report "${form.title}" has been submitted and will be reviewed by our moderation team.`,
        read: false,
        createdAt: new Date().toISOString(),
        href: '/community',
      })

      setSubmitted(true)
    } catch (err) {
      console.error('Failed to submit report:', err)
      setSubmitError('Failed to submit report. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1)
    } else {
      navigate('/community')
    }
  }

  const selectedCategory = form.category ? communityCategoryBySlug(form.category) : null

  if (submitted) {
    return (
      <main className="page community-report-page">
        <div className="container container--narrow">
          <div className="report-success">
            <div className="success-icon">
              <CheckCircle2 size={64} />
            </div>
            <h1>Report Submitted Successfully!</h1>
            <p>
              Thank you for contributing to the community. Your report will be reviewed by
              our moderation team and then made visible on the community page.
            </p>
            <div className="success-actions">
              <ButtonLink to="/community" variant="outline">
                <ArrowLeft size={18} />
                Back to Community
              </ButtonLink>
              <ButtonLink to="/community/report" variant="primary">
                Submit Another Report
              </ButtonLink>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="page community-report-page">
        <div className="container container--narrow">
          <div className="report-auth-required">
            <AlertCircle size={48} />
            <h2>Sign In Required</h2>
            <p>You need to be signed in to submit a community report.</p>
            <ButtonLink to="/login?redirect=/community/report" variant="primary" size="lg">
              Sign In / Sign Up
            </ButtonLink>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page community-report-page">
      <div className="container container--narrow">
        <ButtonLink to="/community" variant="ghost" className="page-back-link" onClick={handleBack}>
          <ArrowLeft size={18} />
        </ButtonLink>

        <FormProgress
          steps={progressSteps}
          currentStep={activeStep}
          completedSteps={activeStep > 1 ? [1] : []}
        />

        {submitError && (
          <div className="error-banner" role="alert">
            <AlertCircle size={20} aria-hidden="true" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="community-report-form" noValidate>
          {activeStep === 1 && (
            <div className="form-step" role="tabpanel" aria-labelledby="step-1-heading">
              <SectionHeading
                id="step-1-heading"
                eyebrow="Step 1 of 4"
                title="What are you reporting?"
                subtitle="Select a category and describe the issue"
              />

              <Select
                label="Category"
                name="category"
                required
                value={form.category || ''}
                onChange={(value) => updateForm('category', value)}
                options={REPORT_CATEGORIES.map((c) => {
                  const cat = communityCategoryBySlug(c)
                  return { value: c, label: cat?.name || c }
                })}
                placeholder="Select a category"
                error={errors.category}
              />

              <Input
                label="Title"
                name="title"
                placeholder="Brief, descriptive title (e.g., 'Pothole on Ring Road near Challenge')"
                required
                value={form.title || ''}
                onChange={(e) => updateForm('title', e.target.value)}
                error={errors.title}
                maxLength={100}
              />

              <Textarea
                label="Description"
                name="description"
                placeholder="Describe the issue in detail. Include what you saw, when, and any relevant details..."
                required
                value={form.description || ''}
                onChange={(e) => updateForm('description', e.target.value)}
                rows={5}
                error={errors.description}
                maxLength={2000}
              />

              <div className="form-step-actions">
                <Button type="button" variant="ghost" onClick={handleBack}>
                  Cancel
                </Button>
                <Button type="button" variant="primary" onClick={() => validateStep(1) && setActiveStep(2)}>
                  Next <ArrowLeft size={18} className="rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="form-step" role="tabpanel" aria-labelledby="step-2-heading">
              <SectionHeading
                id="step-2-heading"
                eyebrow="Step 2 of 4"
                title="Where is this happening?"
                subtitle="Select the location on the map"
              />

              <div className="form-row">
                <Select
                  label="LGA (Local Government Area)"
                  name="lga"
                  required
                  value={form.lga || ''}
                  onChange={(value) => {
                    updateForm('lga', value)
                    updateForm('town', '')
                    updateForm('area', '')
                    updateForm('busStop', '')
                  }}
                  options={locations.map((l) => ({ value: l.name, label: l.name }))}
                  placeholder="Select LGA"
                  error={errors.lga}
                />

                <Select
                  label="Town / City"
                  name="town"
                  required
                  value={form.town || ''}
                  onChange={(value) => {
                    updateForm('town', value)
                    updateForm('area', '')
                    updateForm('busStop', '')
                  }}
                  options={
                    form.lga
                      ? getTownsForLocation(
                          locations.find((l) => l.name === form.lga)?.id || '',
                        ).map((t) => ({ value: t, label: t }))
                      : []
                  }
                  placeholder="Select town"
                  disabled={!form.lga}
                  error={errors.town}
                />
              </div>

              <div className="form-row">
                <Select
                  label="Area / Neighborhood (Optional)"
                  name="area"
                  value={form.area || ''}
                  onChange={(value) => updateForm('area', value)}
                  options={
                    form.town
                      ? getBusStopsForLocation(
                          locations.find((l) => l.name === form.lga)?.id || '',
                        ).map((a) => ({ value: a, label: a }))
                      : []
                  }
                  placeholder="Select area"
                  disabled={!form.town}
                />

                <Select
                  label="Nearest Bus Stop / Landmark (Optional)"
                  name="busStop"
                  value={form.busStop || ''}
                  onChange={(value) => updateForm('busStop', value)}
                  options={
                    form.lga
                      ? getBusStopsForLocation(
                          locations.find((l) => l.name === form.lga)?.id || '',
                        ).map((b) => ({ value: b, label: b }))
                      : []
                  }
                  placeholder="Select landmark"
                  disabled={!form.lga}
                />
              </div>

              <Input
                label="Street Address"
                name="address"
                placeholder="e.g. 12 Ring Road, near Challenge Roundabout"
                required
                value={form.address || ''}
                onChange={(e) => updateForm('address', e.target.value)}
                error={errors.address}
              />

              <div className="map-section">
                <label className="field__label">Location on Map</label>
                <p className="field__hint">Drag the marker or click on the map to set the exact location.</p>
                <GoogleLocationPicker
                  latitude={form.latitude ? Number(form.latitude) : undefined}
                  longitude={form.longitude ? Number(form.longitude) : undefined}
                  onLocationChange={(loc) => {
                    updateForm('latitude', loc.lat)
                    updateForm('longitude', loc.lng)
                    if (loc.address) updateForm('formattedAddress', loc.address)
                    if (loc.placeId) updateForm('placeId', loc.placeId)
                  }}
                  height={300}
                  defaultCenter={
                    form.lga
                      ? getLocationCenter(locations.find((l) => l.name === form.lga)?.id || '')
                      : { lat: 7.3775, lng: 3.947 }
                  }
                  defaultZoom={form.lga ? 13 : 12}
                />
                {(form.latitude || form.longitude) && (
                  <div className="map-coords-display">
                    <p>
                      <strong>Coordinates:</strong> {form.latitude}, {form.longitude}
                    </p>
                    {form.formattedAddress && (
                      <p>
                        <strong>Address:</strong> {form.formattedAddress}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="form-step-actions">
                <Button type="button" variant="ghost" onClick={() => setActiveStep(1)}>
                  <ArrowLeft size={18} /> Back
                </Button>
                <Button type="button" variant="primary" onClick={() => validateStep(2) && setActiveStep(3)}>
                  Next <ArrowLeft size={18} className="rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="form-step" role="tabpanel" aria-labelledby="step-3-heading">
              <SectionHeading
                id="step-3-heading"
                eyebrow="Step 3 of 4"
                title="Add Photos"
                subtitle="Add up to 5 photos to help others understand the situation"
              />

              <CommunityPhotoUpload
                images={form.images || []}
                onChange={handleImagesChange}
                maxImages={5}
                maxSizeMB={5}
              />

              <div className="form-step-actions">
                <Button type="button" variant="ghost" onClick={() => setActiveStep(2)}>
                  <ArrowLeft size={18} /> Back
                </Button>
                <Button type="button" variant="primary" onClick={() => setActiveStep(4)}>
                  Next <ArrowLeft size={18} className="rotate-180" />
                </Button>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="form-step" role="tabpanel" aria-labelledby="step-4-heading">
              <SectionHeading
                id="step-4-heading"
                eyebrow="Step 4 of 4"
                title="Review & Submit"
                subtitle="Please verify your report details before submitting"
              />

              <div className="review-section">
                <div className="review-item">
                  <span className="review-label">Category</span>
                  <span className="review-value">
                    {selectedCategory ? selectedCategory.name : 'Not selected'}
                  </span>
                </div>
                <div className="review-item">
                  <span className="review-label">Title</span>
                  <span className="review-value">{form.title || 'Not provided'}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Description</span>
                  <span className="review-value">{form.description || 'Not provided'}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Location</span>
                  <span className="review-value">
                    {form.address}, {form.town}, {form.lga}, Oyo State
                    {form.area && ` (${form.area})`}
                  </span>
                </div>
                {form.images && form.images.length > 0 && (
                  <div className="review-item">
                    <span className="review-label">Photos</span>
                    <div className="review-images">
                      {form.images.slice(0, 4).map((_, i) => (
                        <div key={i} className="review-image-placeholder" />
                      ))}
                      {form.images.length > 4 && (
                        <div className="review-image-more">+{form.images.length - 4} more</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="disclaimer">
                <AlertCircle size={18} aria-hidden="true" />
                <div>
                  <strong>Community Report Disclaimer:</strong> Your report will be publicly visible
                  and marked as a "Community Report" until verified by OyoConnect moderation.
                  Do not include personal information about others.
                  For emergencies, contact emergency services directly.
                </div>
              </div>

              <div className="form-step-actions">
                <Button type="button" variant="ghost" onClick={() => setActiveStep(3)}>
                  <ArrowLeft size={18} /> Back
                </Button>
                <Button type="submit" size="lg" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="spinning" aria-hidden="true" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  )
}

export default CommunityReportForm
