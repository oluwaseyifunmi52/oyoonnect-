import { useState, useCallback } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Check, Lock, User, Phone, Mail, Save, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { User as UserType } from '../../types/business'
import { Badge } from '../ui/Badge'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import './PersonalInfoSection.css'

const ACCOUNT_TYPE_LABEL: Record<string, string> = {
  admin: 'Administrator',
  business_owner: 'Business Owner',
  service_provider: 'Service Provider',
  customer: 'Customer',
  user: 'Customer',
}

interface PersonalInfoSectionProps {
  user: UserType | null
  onUpdate: (data: Partial<UserType>) => Promise<UserType | null>
}

export function PersonalInfoSection({ user, onUpdate }: PersonalInfoSectionProps) {
  const role = user?.role ?? 'user'
  const accountType = ACCOUNT_TYPE_LABEL[role] ?? 'Customer'

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const validate = useCallback((data: typeof formData) => {
    const newErrors: Record<string, string> = {}
    if (!data.name.trim()) newErrors.name = 'Full name is required'
    else if (data.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters'
    if (!data.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^(\+234|0)[789][01]\d{8}$/.test(data.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid Nigerian phone number (e.g., +234 801 234 5678)'
    }
    return newErrors
  }, [])

  const handleChange = (field: 'name' | 'phone', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleBlur = (field: 'name' | 'phone') => {
    const fieldErrors = validate({ ...formData, [field]: formData[field] })
    if (fieldErrors[field]) {
      setErrors(prev => ({ ...prev, [field]: fieldErrors[field] }))
    }
  }

  const handleCancel = () => {
    setFormData({ name: user?.name || '', phone: user?.phone || '' })
    setErrors({})
    setSaveStatus('idle')
    setIsEditing(false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const fieldErrors = validate(formData)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setSaving(true)
    setSaveStatus('idle')
    try {
      const updated = await onUpdate({ name: formData.name.trim(), phone: formData.phone.trim() })
      if (updated) {
        setSaveStatus('success')
        setIsEditing(false)
        setTimeout(() => setSaveStatus('idle'), 3000)
      } else {
        setSaveStatus('error')
      }
    } catch {
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="personal-info__grid">
      <form onSubmit={handleSubmit} noValidate>
        <div className="personal-info__field personal-info__field--full">
          <label className="personal-info__label">
            Full name <span className="required" aria-hidden="true">*</span>
          </label>
          {isEditing ? (
            <Input
              name="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              error={errors.name}
              autoComplete="name"
              required
              icon={<User size={18} />}
              disabled={saving}
            />
          ) : (
            <div className="personal-info__value">{user?.name || '—'}</div>
          )}
        </div>

        <div className="personal-info__field">
          <label className="personal-info__label">Account type</label>
          <div className="personal-info__value">
            <Badge variant="brand" size="sm">
              <Check size={12} aria-hidden="true" />
              {accountType}
            </Badge>
          </div>
        </div>

        <div className="personal-info__field personal-info__field--full">
          <label className="personal-info__label">
            Phone number <span className="required" aria-hidden="true">*</span>
          </label>
          {isEditing ? (
            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              error={errors.phone}
              autoComplete="tel"
              required
              icon={<Phone size={18} />}
              disabled={saving}
            />
          ) : (
            <div className="personal-info__value">{user?.phone || '—'}</div>
          )}
        </div>

        <div className="personal-info__field personal-info__field--full">
          <label className="personal-info__label">Email address</label>
          <div className="personal-info__value personal-info__value--readonly">
            <span className="personal-info__email-text">{user?.email || '—'}</span>
            <Lock size={14} className="personal-info__lock-icon" aria-hidden="true" />
          </div>
          <p className="personal-info__hint">Email cannot be changed from here. Contact support if you need to update it.</p>
        </div>

        {saveStatus === 'success' && (
          <div className="personal-info__save-success" role="status">
            <CheckCircle2 size={18} aria-hidden="true" />
            <span>Profile updated successfully</span>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="personal-info__save-error" role="alert">
            <AlertCircle size={18} aria-hidden="true" />
            <span>Failed to update profile. Please try again.</span>
          </div>
        )}

        <div className="personal-info__actions">
          {isEditing ? (
            <>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
                <X size={16} aria-hidden="true" />
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? (
                  <>
                    <span className="btn__spinner" aria-hidden="true" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} aria-hidden="true" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button type="button" variant="primary" onClick={() => setIsEditing(true)}>
              <User size={16} aria-hidden="true" />
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}