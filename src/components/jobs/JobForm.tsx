import { useState, useCallback, useRef, useEffect } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { MapPin, ChevronUp, ChevronDown, X, Loader2, Save } from 'lucide-react'
import { Input, Select, Textarea } from '../ui/Input'
import { Button, ButtonLink } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'
import { GoogleLocationPicker } from '../maps/GoogleLocationPicker'
import { locations, getAreasForLocation, getTownsForLocation, getBusStopsForLocation, getLocationCenter } from '../../data/locations'
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS, SALARY_PERIODS, APPLICATION_METHODS } from '../../types/jobs'
import { jobCategories } from '../../data/jobCategories'
import type { JobFormData } from '../../types/jobs'
import { useAuth } from '../../context/AuthContext'
import { jobService } from '../../services/jobService'
import { draftService } from '../../services/businessService'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function JobForm({ initialData, onSubmit, onCancel, isEditing = false }: {
  initialData?: Partial<JobFormData>
  onSubmit: (data: JobFormData) => Promise<void>
  onCancel: () => void
  isEditing?: boolean
}) {
  const { user } = useAuth()
  const [form, setForm] = useState<JobFormData>({
    ...emptyJobFormData,
    ...initialData,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [showResponsibilities, setShowResponsibilities] = useState(false)
  const [showRequirements, setShowRequirements] = useState(false)
  const [showSkills, setShowSkills] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateForm = useCallback((field: keyof JobFormData, value: string | number | boolean | undefined) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }, [])

  const handleTextAreaChange = useCallback((field: 'responsibilities' | 'requirements' | 'skills', value: string) => {
    const items = value.split('\n').map(s => s.trim()).filter(Boolean)
    updateForm(field, items.join('\n'))
  }, [updateForm])

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    if (!form.title.trim()) newErrors.title = 'Job title is required'
    if (!form.category) newErrors.category = 'Category is required'
    if (!form.description.trim()) newErrors.description = 'Job description is required'
    if (!form.lga) newErrors.lga = 'LGA is required'
    if (!form.town) newErrors.town = 'Town/City is required'
    if (!form.address.trim()) newErrors.address = 'Address is required'
    if (!form.applicationContact && form.applicationMethod !== 'platform') {
      newErrors.applicationContact = 'Contact information is required for this application method'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [form])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateForm() || !user) return

    setSubmitting(true)
    try {
      await onSubmit(form)
    } finally {
      setSubmitting(false)
    }
  }

  const saveDraft = useCallback(() => {
    if (user) {
      setSavingDraft(true)
      draftService.saveDraft(`job-${isEditing ? 'edit' : 'create'}-${user.id}`, form)
      setTimeout(() => setSavingDraft(false), 1000)
    }
  }, [form, user, isEditing])

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  return (
    <form onSubmit={handleSubmit} className="job-form" noValidate>
      <SectionHeading
        eyebrow={isEditing ? 'Update Listing' : 'Post a Job'}
        title={isEditing ? 'Edit Job Posting' : 'Create New Job Posting'}
        subtitle={isEditing
          ? 'Update your job details below. Changes will be reviewed before going live.'
          : 'Fill in the details below to post a job on OyoConnect. Free to post, takes about 10 minutes.'}
      />

      <SectionHeading
        eyebrow="Step 1 of 4"
        title="Job Details"
        subtitle="Basic information about the position"
      />

      <Input
        label="Job Title"
        name="title"
        placeholder="e.g. Senior Software Developer, Sales Representative"
        required
        value={form.title}
        onChange={(e) => updateForm('title', e.target.value)}
        error={errors.title}
      />

      <Select
        label="Job Category"
        name="category"
        required
        value={form.category}
        onChange={(value) => updateForm('category', value)}
        options={jobCategories.map((c) => ({ value: c.slug, label: c.name }))}
        placeholder="Select a category"
        error={errors.category}
      />

      <Textarea
        label="Job Description"
        name="description"
        placeholder="Describe the role, company culture, and what makes this opportunity unique..."
        required
        value={form.description}
        onChange={(e) => updateForm('description', e.target.value)}
        rows={5}
        error={errors.description}
      />

      <div className="form-row">
        <Select
          label="Employment Type"
          name="employmentType"
          required
          value={form.employmentType}
          onChange={(value) => updateForm('employmentType', value as any)}
          options={EMPLOYMENT_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          placeholder="Select type"
        />
        <Select
          label="Experience Level"
          name="experienceLevel"
          required
          value={form.experienceLevel}
          onChange={(value) => updateForm('experienceLevel', value as any)}
          options={EXPERIENCE_LEVELS.map((l) => ({ value: l.value, label: `${l.label} (${l.years})` }))}
          placeholder="Select level"
        />
      </div>

      <SectionHeading
        eyebrow="Step 2 of 4"
        title="Requirements & Skills"
        subtitle="What you're looking for in a candidate"
      />

      <div className="collapsible-section">
        <button
          type="button"
          className={`collapsible-trigger ${showResponsibilities ? 'open' : ''}`}
          onClick={() => setShowResponsibilities(!showResponsibilities)}
          aria-expanded={showResponsibilities}
        >
          <span>Key Responsibilities</span>
          <ChevronDown size={18} className={showResponsibilities ? 'rotate' : ''} />
        </button>
        {showResponsibilities && (
          <Textarea
            label="Responsibilities (one per line)"
            name="responsibilities"
            placeholder="e.g.\nDesign and develop web applications\nMentor junior developers\nParticipate in code reviews"
            value={form.responsibilities}
            onChange={(e) => handleTextAreaChange('responsibilities', e.target.value)}
            rows={4}
          />
        )}
      </div>

      <div className="collapsible-section">
        <button
          type="button"
          className={`collapsible-trigger ${showRequirements ? 'open' : ''}`}
          onClick={() => setShowRequirements(!showRequirements)}
          aria-expanded={showRequirements}
        >
          <span>Requirements</span>
          <ChevronDown size={18} className={showRequirements ? 'rotate' : ''} />
        </button>
        {showRequirements && (
          <Textarea
            label="Requirements (one per line)"
            name="requirements"
            placeholder="e.g.\n5+ years experience\nStrong React/TypeScript skills\nAWS certification preferred"
            value={form.requirements}
            onChange={(e) => handleTextAreaChange('requirements', e.target.value)}
            rows={4}
          />
        )}
      </div>

      <div className="collapsible-section">
        <button
          type="button"
          className={`collapsible-trigger ${showSkills ? 'open' : ''}`}
          onClick={() => setShowSkills(!showSkills)}
          aria-expanded={showSkills}
        >
          <span>Required Skills</span>
          <ChevronDown size={18} className={showSkills ? 'rotate' : ''} />
        </button>
        {showSkills && (
          <Textarea
            label="Skills (one per line)"
            name="skills"
            placeholder="e.g.\nReact\nTypeScript\nNode.js\nPostgreSQL"
            value={form.skills}
            onChange={(e) => handleTextAreaChange('skills', e.target.value)}
            rows={3}
          />
        )}
      </div>

      <SectionHeading
        eyebrow="Step 3 of 4"
        title="Compensation & Location"
        subtitle="Salary details and workplace location"
      />

      <div className="salary-section">
        <h4>Salary Range (Optional)</h4>
        <div className="salary-grid">
          <Input
            label="Min Salary (₦)"
            name="salaryMin"
            type="number"
            placeholder="e.g. 150000"
            value={form.salaryMin ?? ''}
            onChange={(e) => updateForm('salaryMin', e.target.value ? parseInt(e.target.value) : undefined)}
          />
          <Input
            label="Max Salary (₦)"
            name="salaryMax"
            type="number"
            placeholder="e.g. 300000"
            value={form.salaryMax ?? ''}
            onChange={(e) => updateForm('salaryMax', e.target.value ? parseInt(e.target.value) : undefined)}
          />
          <Select
            label="Salary Period"
            name="salaryPeriod"
            value={form.salaryPeriod}
            onChange={(value) => updateForm('salaryPeriod', value as any)}
            options={SALARY_PERIODS.map((p) => ({ value: p.value, label: p.label }))}
            placeholder="Period"
          />
        </div>
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            name="salaryNegotiable"
            checked={form.salaryNegotiable}
            onChange={(e) => updateForm('salaryNegotiable', e.target.checked)}
          />
          <span className="checkbox-custom" aria-hidden="true" />
          <span>Negotiable</span>
        </label>
      </div>

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
            error={errors.lga}
          />

          <Select
            label="Town / City"
            name="town"
            required
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
            error={errors.town}
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
        label="Street Address"
        name="address"
        placeholder="e.g. 12 Ring Road, Challenge"
        required
        value={form.address}
        onChange={(e) => updateForm('address', e.target.value)}
        error={errors.address}
      />

      <div className="map-section">
        <label className="field__label">Workplace Location on Map</label>
        <p className="field__hint">Drag the marker or click on the map to set the exact job location.</p>
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

      <SectionHeading
        eyebrow="Step 4 of 4"
        title="Application & Contact"
        subtitle="How candidates should apply"
      />

      <Select
        label="Application Method"
        name="applicationMethod"
        required
        value={form.applicationMethod}
        onChange={(value) => updateForm('applicationMethod', value as any)}
        options={APPLICATION_METHODS.map((m) => ({ value: m.value, label: `${m.label} - ${m.description}` }))}
        placeholder="How should candidates apply?"
      />

      {form.applicationMethod !== 'platform' && (
        <Input
          label="Application Contact"
          name="applicationContact"
          placeholder={form.applicationMethod === 'whatsapp' ? '+234 800 111 2222' : form.applicationMethod === 'email' ? 'jobs@company.com' : '+234 800 111 2222'}
          required
          value={form.applicationContact ?? ''}
          onChange={(e) => updateForm('applicationContact', e.target.value)}
          error={errors.applicationContact}
          hint={`Provide ${form.applicationMethod === 'whatsapp' ? 'WhatsApp number' : form.applicationMethod === 'email' ? 'email address' : 'phone number'} for applications`}
        />
      )}

      <Input
        label="Application Deadline (Optional)"
        name="applicationDeadline"
        type="date"
        value={form.applicationDeadline ?? ''}
        onChange={(e) => updateForm('applicationDeadline', e.target.value)}
      />

      <label className="checkbox-wrapper">
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={(e) => updateForm('featured', e.target.checked)}
        />
        <span className="checkbox-custom" aria-hidden="true" />
        <span>Feature this job (appears at top of search results)</span>
      </label>

      <div className="form-submit">
        <Button type="button" variant="ghost" onClick={saveDraft} disabled={submitting || savingDraft}>
          <Save size={18} /> {savingDraft ? 'Saving...' : 'Save Draft'}
        </Button>
        <ButtonLink to="/" onClick={onCancel} variant="outline" disabled={submitting}>
          Cancel
        </ButtonLink>
        <Button type="submit" size="lg" disabled={submitting} className="submit-btn">
          {submitting ? (
            <>
              <Loader2 size={18} className="spinning" aria-hidden="true" />
              {isEditing ? 'Updating...' : 'Posting...'}
            </>
          ) : (
            isEditing ? 'Update Job' : 'Post Job'
          )}
        </Button>
      </div>

      <p className="terms-note">
        By posting, you agree to our <a href="/terms" className="auth-link">Terms of Service</a> and confirm this information is accurate.
      </p>
    </form>
  )
}

const emptyJobFormData: JobFormData = {
  title: '',
  category: '',
  description: '',
  responsibilities: '',
  requirements: '',
  skills: '',
  employmentType: 'full-time',
  experienceLevel: 'entry',
  salaryMin: undefined,
  salaryMax: undefined,
  salaryPeriod: 'monthly',
  salaryNegotiable: true,
  lga: '',
  town: '',
  area: '',
  busStop: '',
  address: '',
  latitude: 0,
  longitude: 0,
  placeId: '',
  formattedAddress: '',
  applicationMethod: 'platform',
  applicationContact: '',
  applicationDeadline: '',
  featured: false,
}