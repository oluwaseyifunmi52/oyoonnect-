import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { ButtonLink } from '../ui/Button'

interface CommunityHeroProps {
  onReportClick: () => void
  onBrowseClick: () => void
}

export function CommunityHero({ onReportClick, onBrowseClick }: CommunityHeroProps) {
  return (
    <section className="community-hero">
      <div className="community-hero__content">
        <h1 className="community-hero__title">Community Updates</h1>
        <p className="community-hero__subtitle">
          Stay informed about what&#39;s happening in your neighborhood across Oyo State.
          Report issues, share updates, and help your community stay connected.
        </p>
        <div className="community-hero__actions">
          <ButtonLink to="/community/report" variant="primary" size="lg">
            <Plus size={20} />
            Report an Issue
          </ButtonLink>
          <ButtonLink to="/community" variant="outline" size="lg">
            <Search size={20} />
            Browse All Reports
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
