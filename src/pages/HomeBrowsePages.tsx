import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin, Navigation, Search, ShoppingBag, Sparkles } from 'lucide-react'
import { homeMockEvents, homeMockMarketListings, homeMockPlaces } from '../data/homeDashboard'
import type { HomeEvent } from '../data/homeDashboard'
import './HomeBrowsePages.css'
import { DashboardLayout } from '../components/layout/DashboardLayout'

type BrowseVariant = 'nearby' | 'marketplace' | 'events'
type Coordinates = { latitude: number; longitude: number }

function distanceKm(from: Coordinates, to: Coordinates) {
  const radians = (value: number) => (value * Math.PI) / 180
  const deltaLat = radians(to.latitude - from.latitude)
  const deltaLon = radians(to.longitude - from.longitude)
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude)) * Math.sin(deltaLon / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function eventDate(event: HomeEvent) {
  const date = new Date(event.startsAt)
  return { day: date.toLocaleDateString('en-NG', { day: '2-digit' }), month: date.toLocaleDateString('en-NG', { month: 'short' }).toUpperCase(), full: date.toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) }
}

function eventTime(event: HomeEvent) {
  const format = (value: string) => new Date(value).toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' })
  return `${format(event.startsAt)} – ${format(event.endsAt)}`
}

export default function HomeBrowsePages({ variant }: { variant: BrowseVariant }) {
  const { id } = useParams()
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null)
  const [locationState, setLocationState] = useState<'asking' | 'ready' | 'denied'>('asking')
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const selectedLocation = localStorage.getItem('oyoconnect-home-location') || 'Ibadan'
  const events = useMemo(() => homeMockEvents.filter((event) => new Date(event.startsAt).getTime() >= Date.now()).sort((a, b) => a.startsAt.localeCompare(b.startsAt)), [])
  const activeEvent = events.find((event) => event.id === id)

  useEffect(() => {
    if (variant !== 'nearby') return
    if (!navigator.geolocation) { setLocationState('denied'); return }
    navigator.geolocation.getCurrentPosition(
      (position) => { setCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude }); setLocationState('ready') },
      () => setLocationState('denied'),
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 300_000 },
    )
  }, [variant])

  if (variant === 'events' && id) return <main className="home-browse-page"><header className="home-browse-header"><Link to="/"><span>O</span> OyoConnect</Link><Link to="/community/events">All events</Link></header>{activeEvent ? <article className="home-event-detail"><Link to="/community/events" className="home-browse-back"><ArrowLeft size={15} /> Events</Link><div className="home-event-detail-hero"><img src="/images/oyo-hero.jpg" alt="Oyo State monument and landscape" /><div><span className="home-browse-tag"><Sparkles size={12} /> UPCOMING EVENT</span><h1>{activeEvent.title}</h1><p>Meet neighbors, learn together and make a difference in Oyo State.</p></div></div><div className="home-event-detail-content"><section><h2>About this event</h2><p>{activeEvent.title} brings local people together for a welcoming and useful community gathering. Everyone in the OyoConnect community is invited.</p><h2>Event details</h2><p><MapPin size={16} /> {activeEvent.venue}, {activeEvent.location}, Oyo State</p><p><CalendarDays size={16} /> {eventDate(activeEvent).full}</p><p><Clock3 size={16} /> {eventTime(activeEvent)}</p></section><aside><strong>Save your spot</strong><p>Interested in joining your community?</p><button onClick={(event) => { event.currentTarget.textContent = 'You’re on the list!' }}>I’m interested <ArrowRight size={15} /></button><small>This is a local preview interaction.</small></aside></div></article> : <div className="home-browse-empty"><h1>Event not found</h1><Link to="/community/events">Browse upcoming events</Link></div>}</main>

  const page = (
    <main className="home-browse-page">
      <header className="home-browse-header">
        <Link to="/"><span>O</span> OyoConnect</Link>
        <Link to={variant === 'events' ? '/community/events' : '/'}><ArrowLeft size={14} /> Home</Link>
      </header>
      {variant === 'events' && id ? (
        activeEvent ? (
          <article className="home-event-detail">
            <Link to="/community/events" className="home-browse-back"><ArrowLeft size={15} /> Events</Link>
            <div className="home-event-detail-hero">
              <img src="/images/oyo-hero.jpg" alt="Oyo State monument and landscape" />
              <div><span className="home-browse-tag"><Sparkles size={12} /> UPCOMING EVENT</span><h1>{activeEvent.title}</h1><p>Meet neighbors, learn together and make a difference in Oyo State.</p></div>
            </div>
            <div className="home-event-detail-content">
              <section><h2>About this event</h2><p>{activeEvent.title} brings local people together for a welcoming and useful community gathering. Everyone in the OyoConnect community is invited.</p><h2>Event details</h2><p><MapPin size={16} /> {activeEvent.venue}, {activeEvent.location}, Oyo State</p><p><CalendarDays size={16} /> {eventDate(activeEvent).full}</p><p><Clock3 size={16} /> {eventTime(activeEvent)}</p></section>
              <aside><strong>Save your spot</strong><p>Interested in joining your community?</p><button onClick={(event) => { event.currentTarget.textContent = 'You’re on the list!' }}>I’m interested <ArrowRight size={15} /></button><small>This is a local preview interaction.</small></aside>
            </div>
          </article>
        ) : <div className="home-browse-empty"><h1>Event not found</h1><Link to="/community/events">Browse upcoming events</Link></div>
      ) : (
        <div className="home-browse-content">
          {variant === 'nearby' && <>
            <div className="home-browse-title"><span className="home-browse-tag"><MapPin size={12} /> DISCOVER OYO</span><h1>Nearby places</h1><p>Find useful services, local businesses and places around you.</p></div>
            <div className="home-location-status">{locationState === 'asking' ? <><Navigation size={16} /> Checking your location. You can allow access in your browser.</> : locationState === 'ready' ? <><Navigation size={16} /> Showing places nearest to your current location.</> : <><MapPin size={16} /> Location access unavailable. Showing places near {selectedLocation} instead.</>}</div>
            <div className="home-place-grid">{[...homeMockPlaces].map((place) => ({ ...place, distance: coordinates ? distanceKm(coordinates, place) : place.location.toLowerCase().includes(selectedLocation.toLowerCase()) || (selectedLocation.toLowerCase().startsWith('ibadan') && place.location === 'Ibadan') || selectedLocation === 'Oyo State' ? ({ Ibadan: 1.2, Ogbomoso: 2.1, Oyo: 1.6 }[place.location] ?? 2.4) : 99 })).filter((place) => place.distance < 99).sort((a, b) => a.distance - b.distance).map((place) => <Link to={place.href} className="home-place-card" key={place.id}><div className="home-place-image"><img src="/images/oyo-hero.jpg" alt="" loading="lazy" /><span>{place.distance.toFixed(1)} km away</span></div><div className="home-place-body"><small>{place.category}</small><strong>{place.name}</strong><p>{place.description}</p><span><MapPin size={13} /> {place.location}, Oyo State <ArrowRight size={14} /></span></div></Link>)}</div>
          </>}
          {variant === 'marketplace' && <>
            <div className="home-browse-title"><span className="home-browse-tag"><ShoppingBag size={12} /> MADE CLOSE TO HOME</span><h1>Oyo local marketplace</h1><p>Find useful goods and services from people across Oyo State.</p></div>
            <div className="home-market-controls"><label><Search size={16} /><input aria-label="Search marketplace" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search local goods and services..." /></label><div>{['All', 'Fashion', 'Food', 'Services'].map((item) => <button key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
            <div className="home-market-grid">{homeMockMarketListings.filter((item) => (category === 'All' || item.category === category) && `${item.name} ${item.description} ${item.location}`.toLowerCase().includes(search.toLowerCase())).map((item) => <article className="home-market-card" key={item.id}><img src="/images/oyo-hero.jpg" alt="" loading="lazy" /><span>{item.category}</span><h2>{item.name}</h2><p>{item.description}</p><footer><strong>{item.price}</strong><small><MapPin size={12} /> {item.location}</small></footer></article>)}</div>
          </>}
          {variant === 'events' && <>
            <div className="home-browse-title"><span className="home-browse-tag"><CalendarDays size={12} /> CONNECT LOCALLY</span><h1>Upcoming events</h1><p>Meet, learn and make good things happen around Oyo State.</p></div>
            {events.length ? <div className="home-event-calendar">{events.map((event) => { const date = eventDate(event); return <Link className="home-calendar-row" to={event.href} key={event.id}><span className="home-calendar-date"><small>{date.month}</small><strong>{date.day}</strong></span><span><small>{date.full}</small><strong>{event.title}</strong><em><MapPin size={13} /> {event.venue}, {event.location}</em><em><Clock3 size={13} /> {eventTime(event)}</em></span><ArrowRight size={17} /></Link> })}</div> : <div className="home-browse-empty"><CalendarDays size={24} /><strong>No upcoming events yet</strong><p>Check back soon for more local gatherings.</p></div>}
          </>}
        </div>
      )}
    </main>
  )

  return variant === 'events' ? page : <DashboardLayout>{page}</DashboardLayout>
}
