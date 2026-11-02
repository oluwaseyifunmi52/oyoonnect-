import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertCircle, ArrowRight, CalendarDays, Check, Flag, Heart, MapPin, MessageCircle, Search, Share2, UsersRound, UserRound } from 'lucide-react'
import { communityReportsService } from '../../services/communityReportsService'
import type { CommunityReport, CommunityReportStats } from '../../types/community'
import { communityCategoryBySlug } from '../../data/communityCategories'
import { SearchInput } from '../../components/ui/SearchInput'
import './CommunityHome.css'

type FeedTab = 'Latest' | 'Updates' | 'Reports' | 'Events' | 'Groups'
const FEED_TABS: FeedTab[] = ['Latest', 'Updates', 'Reports', 'Events', 'Groups']

function postedAt(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000))
  if (minutes < 60) return `${minutes || 1}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function reportStatus(status: CommunityReport['status']) {
  if (status === 'resolved') return { label: 'Resolved', tone: 'resolved' }
  if (status === 'urgent') return { label: 'Urgent', tone: 'urgent' }
  if (status === 'verified') return { label: 'Verified', tone: 'verified' }
  if (status === 'dismissed') return { label: 'Closed', tone: 'closed' }
  return { label: 'Open', tone: 'open' }
}

export function CommunityHome() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [reports, setReports] = useState<CommunityReport[]>([])
  const [stats, setStats] = useState<CommunityReportStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<FeedTab>('Latest')
  const [shareCopied, setShareCopied] = useState<string | null>(null)
  const query = searchParams.get('search') || ''

  const loadCommunity = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [result, statsResult] = await Promise.all([
        communityReportsService.searchPaginated({ sort: 'newest' }, 1, 15),
        communityReportsService.getStats().catch(() => null),
      ])
      setReports(result.reports)
      setStats(statsResult)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Community reports could not be loaded.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadCommunity() }, [loadCommunity])

  const visibleReports = useMemo(() => reports.filter((report) => {
    const text = `${report.title} ${report.description} ${report.category} ${report.location.lga} ${report.location.town}`.toLowerCase()
    const queryMatch = !query || text.includes(query.toLowerCase())
    const typeMatch = activeTab === 'Latest' || activeTab === 'Reports'
      ? true
      : activeTab === 'Updates'
        ? report.category.toLowerCase() === 'general'
        : activeTab === 'Events'
          ? report.category.toLowerCase() === 'events'
          : false
    return queryMatch && typeMatch
  }), [activeTab, query, reports])
  const openReports = useMemo(() => reports.filter((report) => report.status === 'pending' || report.status === 'urgent' || report.status === 'verified').slice(0, 4), [reports])
  const changeSearch = (value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set('search', value.trim())
    else next.delete('search')
    setSearchParams(next, { replace: true })
  }

  const upvote = async (event: MouseEvent<HTMLButtonElement>, report: CommunityReport) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      await communityReportsService.upvote(report.id)
      setReports((current) => current.map((item) => item.id === report.id ? { ...item, upvotes: item.upvotes + 1 } : item))
    } catch {
      setError('Your reaction could not be saved. Please try again.')
    }
  }

  const shareReport = async (event: MouseEvent<HTMLButtonElement>, report: CommunityReport) => {
    event.preventDefault()
    event.stopPropagation()
    const url = `${window.location.origin}/community/report/${report.id}`
    try {
      if (navigator.share) await navigator.share({ title: report.title, url })
      else { await navigator.clipboard.writeText(url); setShareCopied(report.id); window.setTimeout(() => setShareCopied(null), 1800) }
    } catch { /* The share sheet can be dismissed without an action. */ }
  }

  const showNoSource = activeTab === 'Groups' || (activeTab === 'Events' && visibleReports.length === 0)

  return (
    <div className="community-feed-page">
      <div className="community-feed-frame">
        <section className="community-feed-hero">
          <div className="community-feed-hero__content">
            <span className="community-feed-eyebrow">YOUR COMMUNITY · OYO STATE</span>
            <h1>Together for a better Oyo</h1>
            <p>See what’s happening nearby and share verified issues with your community.</p>
            <div className="community-feed-search"><SearchInput value={query} onChange={changeSearch} placeholder="Search reports and updates" ariaLabel="Search community activity" /></div>
          </div>
        </section>

        <div className="community-feed-columns">
          <main className="community-feed-main">
            {stats && <section className="community-feed-stats" aria-label="Community report summary"><div><strong>{stats.totalReports.toLocaleString()}</strong><span>Total reports</span></div><div><strong>{stats.reportsThisWeek.toLocaleString()}</strong><span>This week</span></div><div><strong>{stats.verifiedReports.toLocaleString()}</strong><span>Verified</span></div><div><strong>{stats.resolvedReports.toLocaleString()}</strong><span>Resolved</span></div></section>}
            <div className="community-feed-tabs" role="tablist" aria-label="Community feed filters">{FEED_TABS.map((tab) => <button key={tab} role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'is-active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>

            <section className="community-feed-compose"><span className="community-feed-compose__icon"><UsersRound size={18} /></span><div><strong>Share an update</strong><p>Let your neighbors know about something that needs attention.</p></div><Link to="/community/report"><Flag size={15} /> Report an issue</Link></section>
            {error && reports.length > 0 && <p className="community-feed-inline-error" role="status">{error}</p>}

            {loading ? <div className="community-feed-list" aria-label="Loading community reports">{Array.from({ length: 3 }, (_, index) => <div className="community-feed-skeleton" key={index}><i /><span /><span /><span /></div>)}</div>
              : error && reports.length === 0 ? <div className="community-feed-state community-feed-state--error"><AlertCircle size={22} /><strong>Community updates didn’t load</strong><p>{error}</p><button onClick={() => void loadCommunity()}>Try again</button></div>
                : showNoSource ? <div className="community-feed-state"><UsersRound size={24} /><strong>{activeTab === 'Groups' ? 'Community groups aren’t available yet' : 'No event reports yet'}</strong><p>This feed shows content when it exists in the community report service.</p></div>
                  : visibleReports.length ? <div className="community-feed-list" role="feed" aria-label="Community reports">{visibleReports.map((report) => {
                    const category = communityCategoryBySlug(report.category)
                    const status = reportStatus(report.status)
                    return <article className="community-post-card" key={report.id}>
                      <header className="community-post-head"><span className="community-post-avatar">{report.authorAvatar ? <img src={report.authorAvatar} alt="" /> : report.authorName ? report.authorName.trim().charAt(0).toUpperCase() : <UserRound size={17} />}</span><div className="community-post-author">{report.authorName && <strong>{report.authorName}</strong>}<span>{postedAt(report.createdAt)}{(report.location.town || report.location.lga) && <> · <MapPin size={12} /> {[report.location.town, report.location.lga].filter(Boolean).join(', ')}</>}</span></div><span className={`community-post-tag community-post-tag--${status.tone}`}>{status.label}</span></header>
                      <Link to={`/community/report/${report.id}`} className="community-post-content"><div className="community-post-category">{category?.name || report.category}</div><h2>{report.title}</h2><p>{report.excerpt || report.description}</p>{report.image && <img className="community-post-image" src={report.image} alt={report.title} loading="lazy" />}</Link>
                      <footer className="community-post-actions"><button onClick={(event) => void upvote(event, report)}><Heart size={15} /> Support <span>{report.upvotes}</span></button><Link to={`/community/report/${report.id}#comments`}><MessageCircle size={15} /> Comment <span>{report.commentCount}</span></Link><button onClick={(event) => void shareReport(event, report)}>{shareCopied === report.id ? <Check size={15} /> : <Share2 size={15} />} {shareCopied === report.id ? 'Copied' : 'Share'}</button></footer>
                    </article>
                  })}</div> : <div className="community-feed-state"><Search size={23} /><strong>No updates match your search</strong><p>Try a different word or choose another feed.</p><button onClick={() => changeSearch('')}>Clear search</button></div>}
          </main>

          <aside className="community-feed-aside">
            <section className="community-feed-aside-card community-feed-report-cta"><span><Flag size={18} /></span><h2>See a problem?</h2><p>Report issues in your area to help the community take action.</p><Link to="/community/report">Report an Issue <ArrowRight size={15} /></Link></section>
            <section className="community-feed-aside-card"><header><h2>Upcoming events</h2><CalendarDays size={16} /></header><div className="community-feed-aside-empty"><CalendarDays size={20} /><p>There are no live event records available here yet.</p></div></section>
            <section className="community-feed-aside-card"><header><h2>Open reports</h2><Link to="/community">See all <ArrowRight size={13} /></Link></header>{openReports.length ? <div className="community-open-list">{openReports.map((report) => { const status = reportStatus(report.status); return <Link key={report.id} to={`/community/report/${report.id}`}><span className={`community-open-dot community-open-dot--${status.tone}`} /><span><strong>{report.title}</strong><small>{[report.location.town, report.location.lga].filter(Boolean).join(', ')}</small></span><em className={`community-post-tag community-post-tag--${status.tone}`}>{status.label}</em></Link> })}</div> : <div className="community-feed-aside-empty"><Check size={20} /><p>No open reports are available right now.</p></div>}</section>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CommunityHome
