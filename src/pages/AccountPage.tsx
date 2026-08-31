import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User, Briefcase, Building2, ArrowRight, ShieldCheck, CheckCircle2, Loader2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Button, ButtonLink } from '../components/ui/Button'

const ROLE_LABEL: Record<string, string> = {
  customer: 'Customer',
  service_provider: 'Service Provider',
  business_owner: 'Business Owner',
  admin: 'Administrator',
  user: 'Customer',
}

export default function AccountPage() {
  const { user, isServiceProvider, isBusinessOwner, hasCapability, upgradeToServiceProvider, upgradeToBusinessOwner } = useAuth()
  const [busy, setBusy] = useState<null | 'provider' | 'business'>(null)
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)

  async function doUpgrade(kind: 'provider' | 'business') {
    setBusy(kind)
    setMessage(null)
    try {
      const res = kind === 'provider' ? await upgradeToServiceProvider() : await upgradeToBusinessOwner()
      if (res.success) {
        setMessage({ kind: 'ok', text: res.message })
      } else {
        setMessage({ kind: 'err', text: res.message })
      }
    } finally {
      setBusy(null)
    }
  }

  return (
    <main className="page account-page">
      <div className="account-page__inner">
        <header className="account-page__header">
          <h1 className="account-page__title">Account &amp; workspaces</h1>
          <p className="account-page__subtitle">
            One OyoConnect account powers every workspace. Upgrade anytime — no new login required.
          </p>
        </header>

        <Card>
          <CardHeader>
            <h2 className="card__title">Profile</h2>
          </CardHeader>
          <CardBody className="account-page__profile">
            <div className="account-page__avatar">{user?.name?.charAt(0)?.toUpperCase() ?? 'U'}</div>
            <div>
              <p className="account-page__name">{user?.name}</p>
              <p className="account-page__meta">{user?.email}</p>
              <span className="badge badge--info">{ROLE_LABEL[user?.role ?? 'customer']}</span>
            </div>
          </CardBody>
        </Card>

        {message && (
          <div className={`account-page__alert account-page__alert--${message.kind}`}>
            {message.kind === 'ok' ? <CheckCircle2 size={16} /> : <ShieldCheck size={16} />}
            {message.text}
          </div>
        )}

        <h2 className="account-page__section">Workspaces</h2>
        <div className="account-page__grid">
          <Card className="account-workspace">
            <CardBody>
              <span className="account-workspace__icon"><User size={20} /></span>
              <h3>Customer</h3>
              <p>Find workers, services, jobs &amp; request help.</p>
              <ButtonLink to="/dashboard" variant="ghost" size="sm">Open <ArrowRight size={14} /></ButtonLink>
            </CardBody>
          </Card>

          <Card className={`account-workspace ${isServiceProvider ? '' : 'is-pending'}`}>
            <CardBody>
              <span className="account-workspace__icon"><Briefcase size={20} /></span>
              <h3>Service Provider</h3>
              <p>Offer your skills and manage incoming requests.</p>
              {isServiceProvider ? (
                <ButtonLink to="/provider/dashboard" variant="ghost" size="sm">Open <ArrowRight size={14} /></ButtonLink>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => doUpgrade('provider')}
                  disabled={busy !== null || user?.role === 'admin'}
                >
                  {busy === 'provider' ? <Loader2 size={14} className="btn__spinner" /> : null}
                  Become a provider
                </Button>
              )}
            </CardBody>
          </Card>

          <Card className={`account-workspace ${isBusinessOwner ? '' : 'is-pending'}`}>
            <CardBody>
              <span className="account-workspace__icon"><Building2 size={20} /></span>
              <h3>Business Owner</h3>
              <p>List your business and manage your services.</p>
              {isBusinessOwner ? (
                <ButtonLink to="/business/dashboard" variant="ghost" size="sm">Open <ArrowRight size={14} /></ButtonLink>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => doUpgrade('business')}
                  disabled={busy !== null || user?.role === 'admin'}
                >
                  {busy === 'business' ? <Loader2 size={14} className="btn__spinner" /> : null}
                  Become a business
                </Button>
              )}
            </CardBody>
          </Card>
        </div>

        <p className="account-page__caps">
          Active capabilities:{' '}
          {(user?.capabilities ?? []).map((c) => c.replace('_', ' ')).join(', ')}
        </p>

        <div className="account-page__links">
          <Link to="/services" className="account-page__link">Browse services</Link>
          <Link to="/services/request" className="account-page__link">Request a service</Link>
          <Link to="/my-requests" className="account-page__link">My requests</Link>
          {!hasCapability('business_owner') && <Link to="/business/register" className="account-page__link">Register a business</Link>}
        </div>
      </div>
    </main>
  )
}
