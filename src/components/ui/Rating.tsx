import { Star, StarHalf } from 'lucide-react'

interface RatingProps {
  value: number
  reviewCount?: number
  size?: 'sm' | 'md'
}

export function Rating({ value, reviewCount, size = 'md' }: RatingProps) {
  const fullStars = Math.floor(value)
  const hasHalf = value - fullStars >= 0.25 && value - fullStars < 0.75
  const rounded = Math.round(value * 10) / 10

  return (
    <span className={`rating rating--${size}`} aria-label={`Rated ${rounded} out of 5`}>
      <span className="rating__stars" aria-hidden="true">
        {Array.from({ length: fullStars }).map((_, index) => (
          <Star key={index} className="rating__star" fill="currentColor" />
        ))}
        {hasHalf ? <StarHalf className="rating__star" fill="currentColor" /> : null}
      </span>
      <span className="rating__value">{rounded.toFixed(1)}</span>
      {reviewCount !== undefined ? (
        <span className="rating__count">({reviewCount})</span>
      ) : null}
    </span>
  )
}