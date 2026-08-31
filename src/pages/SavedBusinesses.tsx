import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { BusinessGrid } from '../components/business/BusinessGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ButtonLink } from '../components/ui/Button'
import { useFavorites } from '../context/FavoritesContext'

function SavedBusinesses() {
  const { favorites, loading } = useFavorites()
  const [localFavorites, setLocalFavorites] = useState<typeof favorites>([])

  useEffect(() => {
    setLocalFavorites(favorites)
  }, [favorites])

  return (
    <main className="page">
      <div className="container">
        <SectionHeading
          eyebrow="Your favorites"
          title="Saved businesses"
          subtitle={localFavorites.length > 0
            ? `You have ${localFavorites.length} saved ${localFavorites.length === 1 ? 'business' : 'businesses'}`
            : 'Start exploring and save businesses you like'}
        />

        {loading ? (
          <BusinessGrid businesses={[]} loading />
        ) : localFavorites.length > 0 ? (
          <>
            <BusinessGrid businesses={localFavorites} />
            <div className="saved-actions">
              <p className="saved-count">
                {localFavorites.length} {localFavorites.length === 1 ? 'business' : 'businesses'} saved
              </p>
            </div>
          </>
        ) : (
          <EmptyState
            icon={<Heart size={36} />}
            title="No saved businesses yet"
            description="Found a business you like? Click the heart icon on any listing to save it for later."
            action={
              <ButtonLink to="/search" variant="primary">
                Explore businesses
              </ButtonLink>
            }
          />
        )}
      </div>
    </main>
  )
}

export default SavedBusinesses