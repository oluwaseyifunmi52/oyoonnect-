import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'
import { locations } from '../../data/locations'

export default function ProviderProfile() {
  const { user, updateProfile, loading } = useAuth()
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

  return (
    <div className="provider-profile">
      <h1 className="provider-page-title">Provider profile</h1>
      <p className="provider-page-sub">Help customers find and trust you. This info appears on your public provider card.</p>

      <Card>
        <CardBody>
          <form className="provider-form" onSubmit={save}>
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
              {saved && <span className="provider-form__saved">Saved</span>}
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
