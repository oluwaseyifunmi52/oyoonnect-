import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { siteConfig } from '../../config/site'
import { Logo } from './Logo'
import { categories } from '../../data/categories'
import { locations } from '../../data/locations'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo />
          <p className="footer__about">{siteConfig.description}</p>
          <ul className="footer__contact">
            <li>
              <MapPin size={16} /> {siteConfig.state}
            </li>
            <li>
              <Phone size={16} /> {siteConfig.phone}
            </li>
            <li>
              <Mail size={16} /> {siteConfig.email}
            </li>
          </ul>
        </div>

        <div className="footer__col footer-explore">
          <h3 className="footer__title">Explore</h3>
          <ul className="footer__links">
            {siteConfig.nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/search">Search Businesses</Link>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__title">Categories</h3>
          <ul className="footer__links">
            {categories.slice(0, 6).map((category) => (
              <li key={category.id}>
                <Link to={`/search?category=${category.slug}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__title">Locations</h3>
          <ul className="footer__links">
            {locations.slice(0, 6).map((location) => (
              <li key={location.id}>
                <Link to={`/search?location=${location.name}`}>{location.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <p>{siteConfig.tagline}.</p>
        </div>
      </div>
    </footer>
  )
}