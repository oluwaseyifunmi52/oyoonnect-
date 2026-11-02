import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, MapPin, Search, SlidersHorizontal } from 'lucide-react'
import { homeMockSearchItems } from '../data/homeDashboard'
import type { HomeCategory } from '../data/homeDashboard'
import './HomeSearchResults.css'
import { DashboardLayout } from '../components/layout/DashboardLayout'

const categories: ('All' | HomeCategory)[] = ['All', 'Jobs', 'Businesses', 'Community']

export default function HomeSearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<'All' | HomeCategory>('All')
  const query = searchParams.get('q')?.trim() ?? ''
  const location = searchParams.get('location')?.trim() ?? 'Oyo State'
  const results = useMemo(() => homeMockSearchItems.filter((item) => {
    const textMatch = !query || `${item.title} ${item.description} ${item.category} ${item.location}`.toLowerCase().includes(query.toLowerCase())
    const locationMatch = !location || location === 'Oyo State' || item.location.toLowerCase().includes(location.toLowerCase()) || (location.toLowerCase().includes('ibadan') && item.location === 'Ibadan')
    return textMatch && locationMatch && (activeCategory === 'All' || item.category === activeCategory)
  }), [query, location, activeCategory])

  const changeLocation = (value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('location', value)
    else next.delete('location')
    setSearchParams(next)
  }

  return <DashboardLayout><main className="home-search-page">
    <header className="home-search-header"><Link to="/" className="home-search-back"><ArrowLeft size={16} /> Home</Link><Link to="/" className="home-search-logo"><span>O</span> OyoConnect</Link><span /></header>
    <div className="home-search-content">
      <div className="home-search-title"><span className="home-search-kicker"><Search size={14} /> OYOCONNECT SEARCH</span><h1>Find what you need in Oyo.</h1><p>Explore local jobs, businesses and community updates.</p></div>
      <section className="home-search-filterbar" aria-label="Search filters"><label className="home-search-query"><Search size={17} /><input value={query} aria-label="Search query" placeholder="Try plumber, jobs or food..." onChange={(event) => { const next = new URLSearchParams(searchParams); if (event.target.value) { next.set('q', event.target.value) } else { next.delete('q') }; setSearchParams(next, { replace: true }) }} /></label><label className="home-search-location"><MapPin size={16} /><select aria-label="Filter by location" value={location} onChange={(event) => changeLocation(event.target.value)}><option>Oyo State</option><option>Ibadan</option><option>Ogbomoso</option><option>Oyo</option><option>Iseyin</option><option>Saki</option></select><SlidersHorizontal size={15} /></label></section>
      <div className="home-search-results-heading"><div><h2>{query ? `Results for “${query}”` : `Explore ${location}`}</h2><p>{results.length} local {results.length === 1 ? 'result' : 'results'} near {location}</p></div><div className="home-search-tabs" aria-label="Filter by category">{categories.map((category) => <button key={category} className={activeCategory === category ? 'is-active' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}</div></div>
      {results.length ? <div className="home-search-result-list">{results.map((item) => <Link to={item.href} className="home-search-result" key={item.id}><img src={item.image ?? '/images/oyo-hero.jpg'} alt="" loading="lazy"/><span className="home-search-result-info"><span className={`home-search-tag ${item.category.toLowerCase()}`}>{item.category}</span><strong>{item.title}</strong><small>{item.description}</small><em><MapPin size={13} /> {item.location}, Oyo State</em></span><span className="home-search-result-arrow"><ArrowUpRight size={17} /></span></Link>)}</div> : <div className="home-search-empty"><span><Search size={24} /></span><h2>No results found yet</h2><p>Try another keyword or choose a wider location to see more of Oyo State.</p><button onClick={() => { setActiveCategory('All'); const next = new URLSearchParams(); if (query) next.set('q', query); next.set('location', 'Oyo State'); setSearchParams(next) }}>Search all Oyo State</button></div>}
    </div>
  </main></DashboardLayout>
}
