import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, NavLink, Route, Routes, useParams } from 'react-router-dom'
import {
  ArrowLeft, Bookmark, CircleAlert, Clapperboard, Film, History, Info, Link2,
  LogIn, MessageCircle, Play, Plus, Search, Settings, Tv, Users,
  type LucideIcon,
} from 'lucide-react'
import { WatchPlayerPreview } from './WatchPlayerPreview'
import { watchService, type WatchGenre, type WatchMediaType, type WatchTitle } from '../../services/watchService'
import './watch.css'

type BrowseMode = 'discover' | 'movies' | 'series'
type RoomDraft = {
  name: string; description: string; title: string; source: string; visibility: 'public' | 'private'
  maxParticipants: number; hostOnly: boolean; chatEnabled: boolean; scheduledAt: string
}

const watchSections = [
  { label: 'Discover', to: '/watch', icon: Clapperboard, end: true },
  { label: 'Movies', to: '/watch/movies', icon: Film },
  { label: 'Series', to: '/watch/series', icon: Tv },
  { label: 'Watch Parties', to: '/watch/parties', icon: Users },
  { label: 'My Watchlist', to: '/watch/watchlist', icon: Bookmark },
  { label: 'Watch History', to: '/watch/history', icon: History },
  { label: 'Create Room', to: '/watch/create-room', icon: Plus },
  { label: 'Join Room', to: '/watch/join-room', icon: LogIn },
]

function IntegrationNotice({ title, children }: { title: string; children: ReactNode }) {
  return <div className="watch-integration" role="status"><Info size={18} aria-hidden="true" /><div><strong>{title}</strong><p>{children}</p></div></div>
}
function EmptyPanel({ title, children, icon: Icon = Film }: { title: string; children: ReactNode; icon?: LucideIcon }) {
  return <div className="watch-empty"><span className="watch-empty__icon"><Icon size={23} aria-hidden="true" /></span><h3>{title}</h3><p>{children}</p></div>
}

function TitleCard({ title }: { title: WatchTitle }) {
  const year = title.releaseDate?.slice(0, 4)
  return (
    <Link className="watch-title-card" to={`/watch/title/${title.mediaType}/${title.id}`} aria-label={`View details for ${title.title}`}>
      <div className="watch-title-card__poster">
        {title.posterUrl ? <img src={title.posterUrl} alt={`${title.title} poster`} loading="lazy" /> : <span className="watch-title-card__placeholder" aria-label="Poster unavailable"><Film size={26} aria-hidden="true" /></span>}
        {title.voteAverage > 0 && <span className="watch-title-card__rating">★ {title.voteAverage.toFixed(1)}</span>}
      </div>
      <div className="watch-title-card__copy"><h4>{title.title}</h4><p>{year || (title.mediaType === 'series' ? 'Series' : 'Movie')} <span>·</span> {title.mediaType === 'series' ? 'Series' : 'Movie'}</p></div>
    </Link>
  )
}

function TitleCollection({ title, titles, loading, error }: { title: string; titles: WatchTitle[]; loading: boolean; error: string }) {
  return <section className="watch-title-collection" aria-label={title}>
    <div className="watch-title-collection__heading"><h3>{title}</h3></div>
    {loading ? <p className="watch-muted" role="status">Loading titles…</p>
      : error ? <p className="watch-inline-error" role="alert"><CircleAlert size={16} />{error}</p>
        : titles.length ? <div className="watch-title-grid">{titles.map((item) => <TitleCard key={`${item.mediaType}-${item.id}`} title={item} />)}</div>
          : <EmptyPanel title="No titles found">Try another search or browse a different collection.</EmptyPanel>}
  </section>
}

function WatchShell() {
  return (
    <section className="watch-shell" aria-label="OyoConnect Watch">
      <header className="watch-header">
        <div className="watch-header__brand"><span className="watch-logo"><Clapperboard size={20} aria-hidden="true" /></span><div><p className="watch-eyebrow">OYOCONNECT</p><h1>Watch</h1></div></div>
        <p className="watch-header__copy">Discover. Watch. Enjoy together.</p>
      </header>
      <nav className="watch-nav" aria-label="Watch sections">
        {watchSections.map(({ label, to, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `watch-nav__link${isActive ? ' is-active' : ''}`}><Icon size={16} aria-hidden="true" /><span>{label}</span></NavLink>)}
      </nav>
      <div className="watch-route-content">
        <Routes>
          <Route index element={<BrowseScreen mode="discover" />} />
          <Route path="movies" element={<BrowseScreen mode="movies" />} />
          <Route path="series" element={<BrowseScreen mode="series" />} />
          <Route path="parties" element={<PartiesScreen />} />
          <Route path="watchlist" element={<LibraryScreen kind="watchlist" />} />
          <Route path="history" element={<LibraryScreen kind="history" />} />
          <Route path="create-room" element={<CreateRoomScreen />} />
          <Route path="join-room" element={<JoinRoomScreen />} />
          <Route path="player-preview" element={<WatchPlayerPreview />} />
          <Route path="title/:mediaType/:id" element={<DetailsScreen />} />
          <Route path="room/:roomId/settings" element={<RoomScreen settings />} />
          <Route path="room/:roomId" element={<RoomScreen />} />
          <Route path="*" element={<EmptyPanel title="Watch page not found">Choose a section from the Watch menu.</EmptyPanel>} />
        </Routes>
      </div>
    </section>
  )
}

function BrowseScreen({ mode }: { mode: BrowseMode }) {
  const [query, setQuery] = useState('')
  const [genreId, setGenreId] = useState('all')
  const [genres, setGenres] = useState<{ movies: WatchGenre[]; series: WatchGenre[] }>({ movies: [], series: [] })
  const [collections, setCollections] = useState<Record<string, WatchTitle[]>>({})
  const [searchResults, setSearchResults] = useState<WatchTitle[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [searchError, setSearchError] = useState('')
  const heading = mode === 'series' ? 'Series' : mode === 'movies' ? 'Movies' : 'Discover'
  const mediaType: WatchMediaType | undefined = mode === 'movies' ? 'movie' : mode === 'series' ? 'series' : undefined
  const availableGenres = mediaType === 'series' ? genres.series : genres.movies
  const visibleTitles = (titles: WatchTitle[]) => genreId === 'all' ? titles : titles.filter((item) => item.genreIds?.includes(Number(genreId)))

  useEffect(() => {
    let active = true
    void watchService.genres().then((result) => { if (active) setGenres(result) }).catch(() => {
      // Catalog titles remain usable if the optional genre endpoint is unavailable.
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    const lists = mode === 'discover'
      ? [
        ['trendingMovies', watchService.list('movie', 'trending')],
        ['popularMovies', watchService.list('movie', 'popular')],
        ['latestMovies', watchService.list('movie', 'latest')],
        ['trendingSeries', watchService.list('series', 'trending')],
      ] as const
      : (['trending', 'popular', 'latest'] as const).map((sort) => [`${sort}${mode}`, watchService.list(mediaType!, sort)] as const)
    void Promise.all(lists.map(async ([key, request]) => [key, await request] as const)).then((results) => {
      if (active) setCollections(Object.fromEntries(results))
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'The catalog could not be loaded. Please try again.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [mode, mediaType])

  useEffect(() => {
    const value = query.trim()
    if (!value) {
      setSearchResults([])
      setSearchError('')
      setSearching(false)
      return
    }
    let active = true
    setSearching(true)
    setSearchError('')
    const timer = window.setTimeout(() => {
      void watchService.search(value, mediaType).then((results) => {
        if (active) setSearchResults(results)
      }).catch((cause: unknown) => {
        if (active) setSearchError(cause instanceof Error ? cause.message : 'Search failed. Please try again.')
      }).finally(() => { if (active) setSearching(false) })
    }, 300)
    return () => { active = false; window.clearTimeout(timer) }
  }, [query, mediaType])

  const sections = mode === 'discover'
    ? [
      { key: 'trendingMovies', title: 'Trending movies' },
      { key: 'popularMovies', title: 'Popular movies' },
      { key: 'latestMovies', title: 'Recently added movies' },
      { key: 'trendingSeries', title: 'Trending series' },
    ]
    : [
      { key: `trending${mode}`, title: `Trending ${heading.toLowerCase()}` },
      { key: `popular${mode}`, title: `Popular ${heading.toLowerCase()}` },
      { key: `latest${mode}`, title: `Recently added ${heading.toLowerCase()}` },
    ]
  const featured = collections.trendingMovies?.[0]
  return (
    <div className="watch-page">
      {mode === 'discover' ? (
        <section className="watch-hero" aria-labelledby="watch-hero-title" style={featured?.backdropUrl ? { backgroundImage: `linear-gradient(90deg, rgba(5, 12, 8, .97) 0%, rgba(5, 12, 8, .88) 43%, rgba(5, 12, 8, .58) 100%), url("${featured.backdropUrl}")` } : undefined}>
          <div className="watch-hero__copy">
            <p className="watch-eyebrow">YOUR NEXT MOVIE NIGHT STARTS HERE</p>
            <h2 id="watch-hero-title">Discover. Watch.<br /><span>Enjoy together.</span></h2>
            <p>Explore films and series, keep your favourites close, and make room for a shared watch.</p>
            <div className="watch-hero__actions">
              <Link className="watch-button watch-button--primary" to="/watch/movies"><Film size={17} /> Explore movies</Link>
              <Link className="watch-button watch-button--hero-secondary" to="/watch/parties"><Users size={17} /> Watch together</Link>
            </div>
            <p className="watch-hero__availability"><Info size={14} /> {featured ? <>Featured: <Link to={`/watch/title/movie/${featured.id}`}>{featured.title}</Link></> : 'Explore films and series from the OyoConnect catalog.'}</p>
          </div>
          <div className="watch-hero__art" aria-hidden="true">
            <span className="watch-hero__halo" />
            <span className="watch-art-card watch-art-card--back"><span className="watch-art-card__glow" /></span>
            <span className="watch-art-card watch-art-card--front"><Clapperboard size={48} strokeWidth={1.25} /><span>OyoConnect</span><strong>WATCH</strong><i>Stories worth sharing</i></span>
            <span className="watch-hero__reel"><Film size={52} strokeWidth={1.1} /></span>
          </div>
        </section>
      ) : (
        <div className="watch-page-heading watch-page-heading--banner"><p className="watch-eyebrow">{mode === 'series' ? 'SERIES' : 'MOVIES'}</p><h2>Explore {heading.toLowerCase()}.</h2><p>Discover titles and details from the connected catalog.</p></div>
      )}
      <div className="watch-search-row">
        <label className="watch-search"><Search size={18} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${heading.toLowerCase()}…`} aria-label={`Search ${heading}`} /></label>
        <label className="watch-field watch-field--compact"><span>Genre</span><select value={genreId} onChange={(event) => setGenreId(event.target.value)}><option value="all">All genres</option>{availableGenres.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      </div>
      {query.trim() ? <TitleCollection title={`Search results for “${query.trim()}”`} titles={visibleTitles(searchResults)} loading={searching} error={searchError} /> : null}
      {!query.trim() && error && <p className="watch-inline-error" role="alert"><CircleAlert size={16} />{error}</p>}
      {mode === 'discover' && <div className="watch-discovery-grid">
        <section className="watch-discovery-card watch-discovery-card--continue"><div className="watch-discovery-card__heading"><span className="watch-discovery-icon"><History size={17} /></span><div><p className="watch-eyebrow">PICK UP WHERE YOU LEFT OFF</p><h3>Continue watching</h3></div></div><p>Playback history will appear here when the account session is connected to Watch.</p><Link className="watch-text-link" to="/watch/history">View watch history <ArrowLeft className="watch-arrow-forward" size={14} /></Link></section>
        <section className="watch-discovery-card watch-discovery-card--together"><div className="watch-discovery-icon"><Users size={19} /></div><p className="watch-eyebrow">WATCH TOGETHER</p><h3>Make it a movie night.</h3><p>Create a room draft or join a party when room services are ready.</p><div className="watch-actions"><Link className="watch-button watch-button--primary" to="/watch/create-room"><Plus size={16} /> Create a room</Link><Link className="watch-text-link" to="/watch/join-room">Join with a code <ArrowLeft className="watch-arrow-forward" size={14} /></Link></div></section>
      </div>}
      {!query.trim() && sections.map((section) => <TitleCollection key={section.key} title={section.title} titles={visibleTitles(collections[section.key] || [])} loading={loading} error={error} />)}
      <div className="watch-actions watch-actions--bottom"><Link className="watch-button watch-button--secondary" to="/watch/watchlist"><Bookmark size={16} /> My watchlist</Link><Link className="watch-button watch-button--secondary" to="/watch/parties"><Users size={16} /> Watch parties</Link><Link className="watch-button watch-button--secondary" to="/watch/player-preview"><Play size={16} /> Test a permitted source</Link></div>
    </div>
  )
}

function LibraryScreen({ kind }: { kind: 'watchlist' | 'history' }) {
  const isHistory = kind === 'history'
  return <div className="watch-page"><div className="watch-page-heading"><p className="watch-eyebrow">YOUR LIBRARY</p><h2>{isHistory ? 'Watch history' : 'My watchlist'}</h2><p>{isHistory ? 'Continue titles from where you left off.' : 'Keep the films and series you want to watch in one place.'}</p></div><IntegrationNotice title={isHistory ? 'Watch history needs an account connection' : 'Watchlist needs an account connection'}>{isHistory ? 'History is available from the Watch API, but this web sign-in session does not provide the backend authentication needed to load your account history.' : 'Watchlist is available from the Watch API, but this web sign-in session does not provide the backend authentication needed to load or save your list.'}</IntegrationNotice><EmptyPanel title={isHistory ? 'History unavailable' : 'Watchlist unavailable'} icon={isHistory ? History : Bookmark}>{isHistory ? 'Connect an authenticated backend account to view your saved playback history.' : 'Connect an authenticated backend account to manage your saved titles.'}</EmptyPanel><Link className="watch-text-link" to="/watch">Explore Watch</Link></div>
}

function PartiesScreen() {
  return <div className="watch-page"><div className="watch-page-heading"><p className="watch-eyebrow">WATCH PARTIES</p><h2>Find your people and press play together.</h2><p>Public rooms, invitations and live playback need a room service.</p></div><IntegrationNotice title="Watch rooms aren’t connected">No room-list endpoint or real-time room service exists in this frontend. Public-room cards, member counts and online indicators are therefore not shown.</IntegrationNotice><EmptyPanel title="Public rooms will appear here" icon={Users}>When a room service is available, you’ll be able to preview public rooms and settings before joining.</EmptyPanel><div className="watch-actions"><Link className="watch-button watch-button--primary" to="/watch/create-room"><Plus size={16} /> Create a room draft</Link><Link className="watch-button watch-button--secondary" to="/watch/join-room"><LogIn size={16} /> Join with a code</Link></div></div>
}

function CreateRoomScreen() {
  const [draft, setDraft] = useState<RoomDraft | null>(null)
  const [error, setError] = useState('')
  const submitDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const source = String(form.get('source') || '').trim()
    const visibility = String(form.get('visibility') || 'public') as RoomDraft['visibility']
    const maxParticipants = Number(form.get('maxParticipants'))
    if (!source.startsWith('https://')) { setError('Use a secure HTTPS video URL that you are authorized to share.'); return }
    if (visibility === 'private' && !String(form.get('password') || '').trim()) { setError('Add a password for a private room draft.'); return }
    if (!form.get('authorized')) { setError('Confirm that you are allowed to access and share this video source.'); return }
    setError('')
    setDraft({ name: String(form.get('name') || '').trim(), description: String(form.get('description') || '').trim(), title: String(form.get('title') || '').trim(), source, visibility, maxParticipants, hostOnly: form.get('hostOnly') === 'on', chatEnabled: form.get('chatEnabled') === 'on', scheduledAt: String(form.get('scheduledAt') || '') })
  }
  return (
    <div className="watch-page">
      <div className="watch-page-heading"><p className="watch-eyebrow">CREATE ROOM</p><h2>Set up a watch party.</h2><p>Review a local draft before room creation is available.</p></div>
      <IntegrationNotice title="Room creation is a preview only">Submitting this form does not create a server room, generate a code or invite participants. Those actions need a room API and real-time service.</IntegrationNotice>
      <form className="watch-form" onSubmit={submitDraft}>
        <label className="watch-field"><span>Room name</span><input name="name" required maxLength={80} placeholder="Friday movie night" /></label>
        <label className="watch-field"><span>Description <small>Optional</small></span><textarea name="description" rows={3} maxLength={300} placeholder="What should people know before joining?" /></label>
        <div className="watch-form-grid"><label className="watch-field"><span>Movie or series title</span><input name="title" required maxLength={120} placeholder="Enter a title" /></label><label className="watch-field"><span>Maximum participants</span><input name="maxParticipants" type="number" min={2} max={50} defaultValue={8} required /></label></div>
        <label className="watch-field"><span>Permitted video source (HTTPS)</span><input name="source" type="url" required placeholder="https://example.com/video.mp4" /></label>
        <label className="watch-checkbox"><input name="authorized" type="checkbox" required /><span>I’m authorized to access this source and share it with invited viewers.</span></label>
        <div className="watch-form-grid"><label className="watch-field"><span>Room access</span><select name="visibility"><option value="public">Public</option><option value="private">Private</option></select></label><label className="watch-field"><span>Scheduled start <small>Optional</small></span><input name="scheduledAt" type="datetime-local" /></label></div>
        <label className="watch-field"><span>Private room password <small>Required for private rooms</small></span><input name="password" type="password" autoComplete="new-password" maxLength={80} /></label>
        <div className="watch-toggle-grid"><label className="watch-checkbox"><input name="hostOnly" type="checkbox" defaultChecked /><span>Host controls playback</span></label><label className="watch-checkbox"><input name="chatEnabled" type="checkbox" defaultChecked /><span>Enable room chat</span></label></div>
        {error && <p className="watch-inline-error" role="alert"><CircleAlert size={16} />{error}</p>}
        <button className="watch-button watch-button--primary" type="submit">Preview room draft</button>
      </form>
      {draft && <section className="watch-draft" aria-live="polite"><p className="watch-eyebrow">LOCAL PREVIEW · NOT CREATED</p><h3>{draft.name}</h3><p>{draft.description || 'No description supplied.'}</p><dl><div><dt>Title</dt><dd>{draft.title}</dd></div><div><dt>Source host</dt><dd>{new URL(draft.source).host}</dd></div><div><dt>Access</dt><dd>{draft.visibility === 'private' ? 'Private' : 'Public'}</dd></div><div><dt>Maximum participants</dt><dd>{draft.maxParticipants}</dd></div><div><dt>Playback control</dt><dd>{draft.hostOnly ? 'Host only' : 'Shared controls requested'}</dd></div><div><dt>Room chat</dt><dd>{draft.chatEnabled ? 'Requested' : 'Disabled'}</dd></div>{draft.scheduledAt && <div><dt>Scheduled</dt><dd>{new Date(draft.scheduledAt).toLocaleString()}</dd></div>}</dl><IntegrationNotice title="No room code or invitation link yet">A real room service must create the room before it can be shared or started.</IntegrationNotice><div className="watch-actions"><button className="watch-button watch-button--secondary" type="button" disabled title="Available after a room service is connected"><Link2 size={16} /> Copy invitation</button><button className="watch-button watch-button--primary" type="button" disabled title="Available after a room service is connected"><Play size={16} /> Start watching</button></div></section>}
    </div>
  )
}

function JoinRoomScreen() {
  const [submitted, setSubmitted] = useState(false)
  const [code, setCode] = useState('')
  return <div className="watch-page"><div className="watch-page-heading"><p className="watch-eyebrow">JOIN ROOM</p><h2>Enter a room code.</h2><p>Private room access is checked by the room service, not on this screen.</p></div><form className="watch-form watch-form--narrow" onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }}><label className="watch-field"><span>Room code</span><input value={code} onChange={(event) => setCode(event.target.value.trim())} required minLength={4} maxLength={24} autoCapitalize="characters" placeholder="Enter code" /></label><label className="watch-field"><span>Password <small>Only if the host provided one</small></span><input type="password" autoComplete="current-password" /></label><button className="watch-button watch-button--primary" type="submit"><LogIn size={16} /> Check room</button>{submitted && <IntegrationNotice title="Room lookup is not connected">The code was not sent or validated. A room API is required to join or preview this room.</IntegrationNotice>}</form></div>
}

function DetailsScreen() {
  const { mediaType: routeType, id = '' } = useParams()
  const mediaType: WatchMediaType = routeType === 'series' ? 'series' : 'movie'
  const category = mediaType === 'series' ? 'series' : 'movies'
  const [title, setTitle] = useState<WatchTitle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    void watchService.details(mediaType, id).then((result) => {
      if (active) setTitle(result)
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'Title details could not be loaded.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, mediaType])

  return <div className="watch-page">
    <Link className="watch-text-link" to={`/watch/${category}`}><ArrowLeft size={16} /> Back to {category}</Link>
    {loading ? <p className="watch-muted" role="status">Loading title…</p>
      : error ? <><p className="watch-inline-error" role="alert"><CircleAlert size={16} />{error}</p><Link className="watch-button watch-button--secondary" to={`/watch/${category}`}>Browse {category}</Link></>
        : title ? <>
          <article className="watch-detail" style={title.backdropUrl ? { backgroundImage: `linear-gradient(90deg, rgba(5, 12, 8, .97), rgba(5, 12, 8, .72)), url("${title.backdropUrl}")` } : undefined}>
            {title.posterUrl ? <img className="watch-detail__poster" src={title.posterUrl} alt={`${title.title} poster`} /> : <div className="watch-detail__poster-placeholder" aria-label="Poster unavailable"><Film size={34} aria-hidden="true" /></div>}
            <div className="watch-detail__content"><p className="watch-eyebrow">{title.mediaType === 'series' ? 'SERIES' : 'MOVIE'}{title.releaseDate ? ` · ${title.releaseDate.slice(0, 4)}` : ''}</p>
              <h2>{title.title}</h2><p className="watch-detail__meta">{title.voteAverage > 0 ? `★ ${title.voteAverage.toFixed(1)}${title.voteCount ? ` (${title.voteCount.toLocaleString()} ratings)` : ''}` : 'Rating unavailable'}{title.runtime ? ` · ${title.runtime} min` : ''}{title.numberOfSeasons ? ` · ${title.numberOfSeasons} seasons` : ''}</p>
              <p className="watch-detail__genres">{title.genres?.length ? title.genres.map((item) => item.name).join(' · ') : 'Genre information unavailable'}</p>
              <p className="watch-detail__overview">{title.overview || 'No description is available for this title.'}</p>
              <div className="watch-actions">
                {title.trailer?.url && <a className="watch-button watch-button--primary" href={title.trailer.url} target="_blank" rel="noreferrer"><Play size={16} /> View trailer</a>}
                <button className="watch-button watch-button--secondary" type="button" disabled title="Watchlist requires an authenticated backend account session"><Bookmark size={16} /> Add to watchlist</button>
                <Link className="watch-button watch-button--secondary" to="/watch/create-room"><Plus size={16} /> Create party draft</Link>
              </div>
            </div>
          </article>
          {!title.trailer?.url && <p className="watch-muted">No trailer is available for this title. Full movie playback is not provided by the catalog.</p>}
        </> : <EmptyPanel title="Title not found">This title is not available in the connected catalog.</EmptyPanel>}
  </div>
}

function RoomScreen({ settings = false }: { settings?: boolean }) {
  const { roomId } = useParams()
  const [panel, setPanel] = useState<'chat' | 'participants' | 'settings'>('chat')
  const panelIcon = panel === 'chat' ? MessageCircle : panel === 'participants' ? Users : Settings
  const PanelIcon = panelIcon
  const panelTitle = panel === 'chat' ? 'Live chat is unavailable' : panel === 'participants' ? 'No participant data' : 'Room settings unavailable'
  const panelCopy = panel === 'chat' ? 'Messages are not sent or stored from this panel. A real-time room service is required.' : panel === 'participants' ? 'Participant names, avatars, counts and online states are not fabricated.' : 'Host transfer, remove, report and playback permissions require a room service.'
  return <div className="watch-page"><div className="watch-room-heading"><div><p className="watch-eyebrow">{settings ? 'ROOM SETTINGS' : 'WATCH ROOM'}</p><h2>{settings ? 'Room settings' : 'The room is not connected.'}</h2><p>Room IDs cannot be resolved without a room service.</p></div><Link className="watch-button watch-button--secondary" to="/watch/parties"><ArrowLeft size={16} /> Leave preview</Link></div><div className="watch-room-layout"><div className="watch-room-player"><div className="watch-video-empty"><Film size={30} /><p>Player will be enabled when this room provides a permitted video source.</p></div><IntegrationNotice title="Playback is waiting for room data">No title, playback position, host state or source is available for this room.</IntegrationNotice></div><aside className="watch-room-side"><div className="watch-room-tabs" role="tablist" aria-label="Watch room panels">{(['chat', 'participants', 'settings'] as const).map((name) => { const Icon = name === 'chat' ? MessageCircle : name === 'participants' ? Users : Settings; return <button key={name} className={panel === name ? 'is-active' : ''} role="tab" aria-selected={panel === name} onClick={() => setPanel(name)}><Icon size={15} />{name}</button> })}</div><EmptyPanel icon={PanelIcon} title={panelTitle}>{panelCopy}</EmptyPanel><button className="watch-button watch-button--secondary" type="button" disabled title="Available when room invitations are connected"><Link2 size={16} /> Invite friends</button>{roomId && <p className="watch-muted">Room link is waiting for server validation.</p>}</aside></div><IntegrationNotice title="Watch parties require backend support">Room lookup, invitation, membership, chat, presence and synchronized playback are not connected in either frontend.</IntegrationNotice></div>
}

export default function WatchExperience() {
  return <WatchShell />
}
