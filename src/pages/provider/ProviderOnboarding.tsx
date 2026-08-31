import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Briefcase, CheckCircle2, Loader2, ArrowRight, ListChecks, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export default function ProviderOnboarding() {
  const { user, isServiceProvider, upgradeToServiceProvider } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!user) return <Navigate to="/login?redirect=/provider/onboarding" replace />
  if (isServiceProvider) return <Navigate to="/provider/dashboard" replace />

  async function becomeProvider() {
    setBusy(true)
    setError('')
    try {
      const res = await upgradeToServiceProvider()
      if (res.success) {
        navigate('/provider/dashboard', { replace: true })
      } else {
        setError(res.message)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page provider-onboarding">
      <div className="provider-onboarding__inner">
        <span className="provider-onboarding__icon"><Briefcase size={32} /></span>
        <h1 className="provider-onboarding__title">Become a Service Provider</h1>
        <p className="provider-onboarding__subtitle">
          Turn your skills into opportunities. Your single OyoConnect account already covers this —
          just switch on the provider workspace.
        </p>

        <div className="provider-onboarding__benefits">
          <Card><CardBody className="provider-benefit"><ListChecks size={18} /> Showcase your skills &amp; trades</CardBody></Card>
          <Card><CardBody className="provider-benefit"><Bell size={18} /> Get matched with customer requests</CardBody></Card>
          <Card><CardBody className="provider-benefit"><ArrowRight size={18} /> Manage leads in one place</CardBody></Card>
        </div>

        {error && (
          <p className="account-page__alert account-page__alert--err"><CheckCircle2 size={16} /> {error}</p>
        )}

        <div className="provider-onboarding__actions">
          <Button variant="primary" size="lg" onClick={becomeProvider} disabled={busy}>
            {busy ? <Loader2 size={16} className="btn__spinner" /> : <CheckCircle2 size={16} />}
            Enable provider workspace
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate('/dashboard')}>
            Maybe later
          </Button>
        </div>
      </div>
    </main>
  )
}
