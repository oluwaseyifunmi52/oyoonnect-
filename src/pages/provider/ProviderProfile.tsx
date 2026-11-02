import { useRef, useState } from 'react'
import { CheckCircle2, Circle, Mail, MapPin, PencilLine, Phone, UserRound } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { Avatar } from '../../components/profile/Avatar'
import { locations } from '../../data/locations'

export default function ProviderProfile() {
  const { user, updateProfile, loading } = useAuth()
  const formRef = useRef<HTMLFormElement>(null)
  const [form, setForm] = useState({
    headline: '',
    skill: '',
    lga: '',
    area: '',
    bio: '',
  })
  const [saved, setSaved] = useState(false)

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    await updateProfile({ name: user?.name })
    setSaved(true)
  }

  const lgaOptions = locations.map((l) => ({ value: l.name, label: l.name }))
  const profileFields = [
    { label: 'Full name', complete: Boolean(user?.name) },
    { label: 'Email address', complete: Boolean(user?.email) },
    { label: 'Phone number', complete: Boolean(user?.phone) },
    { label: 'Profile photo', complete: Boolean(user?.avatar) },
  ]
  const completion = Math.round((profileFields.filter((field) => field.complete).length / profileFields.length) * 100)

  function focusForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    formRef.current?.querySelector('input')?.focus({ preventScroll: true })
  }

  return (
    <div className="provider-view provider-profile">
      <header className="provider-view__page-header">
        <div>
          <h1 className="provider-view__heading">My Profile</h1>
          <p className="provider-view__subheading">Manage the account details customers use to recognize and contact you.</p>
        </div>
      </header>

      <div className="provider-profile-layout">
        <main className="provider-content-main">
          <section className="provider-profile-header" aria-label="Provider account details">
            <Avatar src={user?.avatar} initials={user?.name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'SP'} size="lg" variant={user?.avatar ? 'image' : 'gradient'} />
            <div className="provider-profile-header__copy">
              <h2 className="provider-profile-header__name">{user?.name || 'Service Provider'}</h2>
              <p className="provider-profile-header__meta">{user?.role?.replaceAll('_', ' ') || 'Service provider'}</p>
            </div>
            <div className="provider-view__page-header-actions">
              <Button type="button" variant="outline" size="sm" onClick={focusForm}><PencilLine className="provider-view__button-icon" /> Edit profile</Button>
            </div>
          </section>

          <Card className="provider-panel provider-profile-form-card">
            <CardBody>
              <form className="provider-form" onSubmit={save} ref={formRef} id="provider-profile-form">
                <div className="provider-panel__header"><div><span className="provider-panel__eyebrow">PROFESSIONAL DETAILS</span><h2 className="provider-panel__title">About your work</h2></div></div>
                <div className="provider-form__row">
                  <Input label="Headline" placeholder="e.g. Plumber & Water Systems Expert" value={form.headline} onChange={(e) => set('headline', e.target.value)} />
                  <Input label="Primary skill / trade" placeholder="e.g. Plumbing" value={form.skill} onChange={(e) => set('skill', e.target.value)} />
                </div>

                <div className="provider-form__row">
                  <Select
                    label="Local Government Area"
                    value={form.lga}
                    onChange={(v) => set('lga', v)}
                    options={[{ value: '', label: 'Select LGA' }, ...lgaOptions]}
                  />
                  <Input label="Area / Town" placeholder="e.g. Bodija" value={form.area} onChange={(e) => set('area', e.target.value)} />
                </div>

                <Textarea label="Short bio" placeholder="Tell customers about your experience and what you offer." value={form.bio} onChange={(e) => set('bio', e.target.value)} />

                <div className="provider-form__actions">
                  <Button type="submit" variant="primary" loading={loading}>Save profile</Button>
                  {saved && <span className="provider-form__saved" role="status">Saved</span>}
                </div>
              </form>
            </CardBody>
          </Card>

          <section className="provider-panel" aria-labelledby="provider-contact-title">
            <header className="provider-panel__header"><div><span className="provider-panel__eyebrow">ACCOUNT DETAILS</span><h2 className="provider-panel__title" id="provider-contact-title">Contact information</h2></div></header>
            <dl className="provider-contact-list">
              {user?.email && <div><dt><Mail size={14} /> Email</dt><dd>{user.email}</dd></div>}
              {user?.phone && <div><dt><Phone size={14} /> Phone</dt><dd>{user.phone}</dd></div>}
              {!user?.email && !user?.phone && <div><dt>Contact details</dt><dd>No contact information is available on this account.</dd></div>}
            </dl>
          </section>
        </main>

        <aside className="provider-content-aside">
          <section className="provider-panel" aria-labelledby="provider-completion-title">
            <span className="provider-panel__eyebrow">PROFILE CHECKLIST</span>
            <h2 className="provider-panel__title" id="provider-completion-title">Account completeness</h2>
            <div className="provider-completion__score"><strong>{completion}%</strong><span>complete</span></div>
            <div className="provider-completion__track" role="progressbar" aria-label="Account completeness" aria-valuenow={completion} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${completion}%` }} /></div>
            <ul className="provider-completion__list">
              {profileFields.map(({ label, complete }) => <li key={label}>{complete ? <CheckCircle2 /> : <Circle />}{label}</li>)}
            </ul>
          </section>

          <section className="provider-panel">
            <span className="provider-panel__eyebrow">YOUR LOCATION</span>
            <div className="provider-help-card"><span className="provider-help-card__icon"><MapPin /></span><p>Location details can be added in your professional profile fields.</p></div>
          </section>

          <section className="provider-panel">
            <span className="provider-panel__eyebrow">PUBLIC PROFILE</span>
            <div className="provider-help-card"><span className="provider-help-card__icon"><UserRound /></span><p>A public provider profile page is not available yet.</p></div>
          </section>
        </aside>
      </div>
    </div>
  )
}
