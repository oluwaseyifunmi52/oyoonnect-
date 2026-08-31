import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Send, CheckCircle2 } from 'lucide-react'
import { categories } from '../../data/categories'
import { locations } from '../../data/locations'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Card, CardBody } from '../../components/ui/Card'

export default function ServiceRequest() {
  const [params] = useSearchParams()
  const presetCategory = params.get('category') ?? ''

  const [form, setForm] = useState({
    category: presetCategory,
    title: '',
    description: '',
    lga: '',
    budget: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const categoryOptions = categories.map((c) => ({ value: c.slug, label: c.name }))
  const lgaOptions = locations.map((l) => ({ value: l.name, label: l.name }))

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="page services-page">
        <Card variant="elevated" className="services-success">
          <CardBody>
            <span className="services-success__icon"><CheckCircle2 size={36} /></span>
            <h1>Request submitted</h1>
            <p>
              We've recorded your request{presetCategory ? ` for "${categories.find((c) => c.slug === presetCategory)?.name}"` : ''}.
              Service providers in your area will be able to respond.
            </p>
            <div className="services-success__actions">
              <Button variant="ghost" onClick={() => { setSubmitted(false); setForm({ category: '', title: '', description: '', lga: '', budget: '' }) }}>
                Submit another
              </Button>
            </div>
          </CardBody>
        </Card>
      </main>
    )
  }

  return (
    <main className="page services-page">
      <header className="services-hero services-hero--compact">
        <h1 className="services-hero__title">Request a service</h1>
        <p className="services-hero__subtitle">Tell us what you need and we'll match you with providers.</p>
      </header>

      <Card>
        <CardBody>
          <form className="service-request-form" onSubmit={submit}>
            <Select
              label="Service category"
              value={form.category}
              onChange={(v) => set('category', v)}
              options={[{ value: '', label: 'Select a category' }, ...categoryOptions]}
              required
            />
            <Input
              label="Short title"
              placeholder="e.g. Fix leaking pipe in kitchen"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
            />
            <Textarea
              label="Describe what you need"
              placeholder="Share details so providers can help accurately."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
            />
            <div className="service-request-form__row">
              <Select
                label="Location (LGA)"
                value={form.lga}
                onChange={(v) => set('lga', v)}
                options={[{ value: '', label: 'Select LGA' }, ...lgaOptions]}
              />
              <Input label="Budget (optional)" placeholder="e.g. ₦15,000" value={form.budget} onChange={(e) => set('budget', e.target.value)} />
            </div>

            <div className="service-request-form__actions">
              <Button type="submit" variant="primary"><Send size={16} /> Submit request</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  )
}
