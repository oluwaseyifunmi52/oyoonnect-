import { Link } from 'react-router-dom'
import { siteConfig } from '../../config/site'
import LogoIcon from '../../assets/logo.svg'



interface LogoProps {
  to?: string
  subtitle?: boolean
}

export function Logo({ to = '/', subtitle = false }: LogoProps) {
  return (
    <Link to={to} className="logo" aria-label={`${siteConfig.name} home`}>
      <img src={LogoIcon} alt="" className="logo__icon" aria-hidden="true" />
      <span className="logo__text">
        <span className="logo__name">{siteConfig.name}</span>
        {subtitle ? <span className="logo__subtitle">{siteConfig.state}</span> : null}
      </span>
    </Link>
  )
}