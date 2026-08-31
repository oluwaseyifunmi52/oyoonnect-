import type { Review } from '../types/business'

export const reviews: Review[] = []


export function getReviewsByBusinessId(businessId: string): Review[] {
  return reviews.filter((review) => review.businessId === businessId)
}

export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

export function getReviewCount(businessId: string): number {
  return reviews.filter((review) => review.businessId === businessId).length
}

export function getRatingDistribution(reviews: Review[]): Record<number, number> {
  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      distribution[review.rating]++
    }
  })
  return distribution
}

export function formatReviewDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function sortReviews(reviews: Review[], sortBy: 'newest' | 'highest' | 'lowest'): Review[] {
  const sorted = [...reviews]
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'highest':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'lowest':
      return sorted.sort((a, b) => a.rating - b.rating)
    default:
      return sorted
  }
}

export function filterReviewsByRating(reviews: Review[], rating: number | 'all'): Review[] {
  if (rating === 'all') return reviews
  return reviews.filter((review) => review.rating === rating)
}