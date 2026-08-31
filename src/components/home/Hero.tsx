import { ShieldCheck, Building2, MapPin } from 'lucide-react'
import { siteConfig } from '../../config/site'
import { SearchBar } from '../search/SearchBar'

const stats = [
  { icon: Building2, value: 'Local', label: 'Businesses & services' },
  { icon: ShieldCheck, value: 'Trusted', label: 'Business discovery' },
  { icon: MapPin, value: '33', label: 'LGAs across Oyo State' },
];

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <p className="hero__eyebrow">
          <span className="hero__dot" aria-hidden="true" />
          Trusted local directory for {siteConfig.state}
        </p>
        <h1 className="hero__title">
          Find trusted businesses &amp; services in{' '}
          <span className="hero__title-accent">Oyo State</span>
        </h1>
        <p className="hero__subtitle">
          {siteConfig.description}
        </p>

        <SearchBar />
        
        <div className="hero__hint">
          <span>Popular searches:</span> Mechanics · Restaurants · Tailors · Barbers ·
          Hair Salons · Electricians · Plumbers · Solar Installers · Tutors ·
          Caterers · Phone Repairs · Fashion Designers · Event Planners
        </div>

        <dl className="hero__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="hero__stat">
              <stat.icon className="hero__stat-icon" aria-hidden="true" />
              <dt className="hero__stat-label">{stat.label}</dt>
              <dd className="hero__stat-value">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}