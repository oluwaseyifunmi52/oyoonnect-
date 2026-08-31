import { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, SearchX, Star, MessageCircle, CheckCircle2 } from 'lucide-react'
import { BusinessHeader } from '../components/business/BusinessHeader'
import { BusinessGallery } from '../components/business/BusinessGallery'
import { BusinessInfo } from '../components/business/BusinessInfo'
import { BusinessHours } from '../components/business/BusinessHours'
import { BusinessGrid } from '../components/business/BusinessGrid'
import { SectionHeading } from '../components/ui/SectionHeading'
import { EmptyState } from '../components/ui/EmptyState'
import { Button, ButtonLink } from '../components/ui/Button'
import { Rating } from '../components/ui/Rating'
import { businessService } from '../services/businessService'
import { reviewService } from '../services/businessService'
import { formatReviewDate, sortReviews, filterReviewsByRating } from '../data/reviews'
import { BusinessLocationMap } from '../components/maps/BusinessLocationMap'
import type { Review, Business } from '../types/business'
import { useAuth } from '../context/AuthContext'
import { AuthRequiredModal } from '../components/common/AuthRequiredModal'

function BusinessProfile() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const [business, setBusiness] = useState<Business | undefined>()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [reviewForm, setReviewForm] = useState({ userName: '', rating: 0, comment: '' })
  const [formErrors, setFormErrors] = useState<{ userName?: string; rating?: string; comment?: string }>({})
  const [submittingReview, setSubmittingReview] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest')
  const [filterRating, setFilterRating] = useState<number | 'all'>('all')

  useEffect(() => {
    if (id) {
      const loadData = async () => {
        try {
          const biz = await businessService.getById(id)
          setBusiness(biz)
          if (biz) {
            const reviewsData = await reviewService.getByBusiness(biz.id)
            setReviews(reviewsData)
          }
        } catch {
          setBusiness(undefined)
        } finally {
          setLoading(false)
        }
      }
      loadData()
    }
  }, [id])

  const similar = useMemo(() => {
    if (!business) return []
    return []
  }, [business])

  const [averageRating, setAverageRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })

  useEffect(() => {
    if (business?.id) {
      const loadReviews = async () => {
        try {
          const [avgRating, count, distribution] = await Promise.all([
            reviewService.getAverageRating(business.id),
            reviewService.getReviewCount(business.id),
            reviewService.getRatingDistribution(business.id),
          ])
          setAverageRating(avgRating)
          setReviewCount(count)
          setRatingDistribution(distribution)
        } catch {
          setAverageRating(0)
          setReviewCount(0)
          setRatingDistribution({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
        }
      }
      loadReviews()
    }
  }, [business?.id])

  const sortedAndFilteredReviews = useMemo(() => {
    let result = [...reviews]
    result = filterReviewsByRating(result, filterRating)
    result = sortReviews(result, sortBy)
    return result
  }, [reviews, sortBy, filterRating])

  const validateForm = (): boolean => {
    const errors: { userName?: string; rating?: string; comment?: string } = {}
    
    if (!reviewForm.userName.trim()) {
      errors.userName = 'Name is required'
    } else if (reviewForm.userName.trim().length < 2) {
      errors.userName = 'Name must be at least 2 characters'
    } else if (reviewForm.userName.trim().length > 50) {
      errors.userName = 'Name must be less than 50 characters'
    }

    if (reviewForm.rating === 0) {
      errors.rating = 'Please select a rating'
    } else if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5'
    }

    const trimmedComment = reviewForm.comment.trim()
    if (!trimmedComment) {
      errors.comment = 'Please enter your review'
    } else if (trimmedComment.length < 10) {
      errors.comment = 'Review must be at least 10 characters'
    } else if (trimmedComment.length > 2000) {
      errors.comment = 'Review must be less than 2000 characters'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    if (!validateForm()) return

    if (!business) return

    setSubmittingReview(true)
    try {
      const newReview = await reviewService.addMockReview({
        businessId: business.id,
        userName: reviewForm.userName.trim(),
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
        verified: false,
        status: 'pending',
      })
      setReviews((prev) => [newReview, ...prev])
      setReviewForm({ userName: '', rating: 0, comment: '' })
      setFormErrors({})
      setShowReviewForm(false)
      setReviewCount((prev) => prev + 1)
      
      const newAvg = ((averageRating * reviewCount) + reviewForm.rating) / (reviewCount + 1)
      setAverageRating(Math.round(newAvg * 10) / 10)
      
      setRatingDistribution((prev) => ({
        ...prev,
        [reviewForm.rating]: (prev[reviewForm.rating] || 0) + 1,
      }))
    } catch {
      alert('Failed to submit review. Please try again.')
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleInputChange = (field: 'userName' | 'rating' | 'comment', value: string | number) => {
    setReviewForm((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="profile-skeleton">
            <div className="skeleton skeleton--text skeleton--wide" style={{ maxWidth: '400px', marginBottom: '16px' }} />
            <div className="skeleton skeleton--media" style={{ width: '100%', aspectRatio: '16/9', borderRadius: '16px', marginBottom: '24px' }} />
            <div className="skeleton skeleton--text" style={{ width: '60%', marginBottom: '12px' }} />
            <div className="skeleton skeleton--text" style={{ width: '40%', marginBottom: '24px' }} />
          </div>
        </div>
      </main>
    )
  }

  if (!business) {
    return (
      <main className="page container">
        <EmptyState
          icon={<SearchX size={36} />}
          title="Business not found"
          description="This listing may have been removed or the link is incorrect."
          action={
            <ButtonLink to="/search" variant="primary">
              Browse businesses
            </ButtonLink>
          }
        />
      </main>
    )
  }

  const hasReviews = reviewCount > 0

  return (
    <main className="page">
      <div className="container">
        <Link to="/search" className="back-link">
          <ArrowLeft size={16} /> Back to search
        </Link>

        <BusinessHeader business={business} />
        <BusinessGallery business={business} />
        <BusinessInfo business={business} />
        <BusinessHours hours={business.openingHours} />

        {business.latitude && business.longitude && (
          <section className="section" aria-labelledby="location-heading">
            <div className="location-section">
              <SectionHeading
                eyebrow="Find us"
                title="Location"
                subtitle={`${business.locationData?.busStop ? `${business.locationData.busStop}, ` : ''}${business.locationData?.area ? `${business.locationData.area}, ` : ''}${business.locationData?.town || business.location}, Oyo State`}
              />
              <BusinessLocationMap
                latitude={business.latitude}
                longitude={business.longitude}
                address={business.locationData?.formattedAddress || business.address}
                businessName={business.name}
                height={350}
                interactive={true}
                showDirectionsButton={true}
              />
            </div>
          </section>
        )}

        <section className="section" aria-labelledby="reviews-heading">
          <div className="reviews-section">
            <div className="reviews-header">
              <SectionHeading
                eyebrow="Customer feedback"
                title="Reviews"
                subtitle={`${reviewCount} review${reviewCount !== 1 ? 's' : ''} • ${averageRating.toFixed(1)} average`}
              />
              <Button
                variant="secondary"
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowAuthModal(true)
                    return
                  }
                  setShowReviewForm(true)
                }}
                className="write-review-btn"
              >
                <MessageCircle size={18} />
                Write a review
              </Button>
            </div>

            {hasReviews && (
              <div className="review-summary" role="region" aria-label="Review summary">
                <div className="review-summary__overview">
                  <div className="review-summary__score">
                    <span className="review-summary__number">{averageRating.toFixed(1)}</span>
                    <Rating value={averageRating} size="md" />
                    <span className="review-summary__count">Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="review-summary__distribution">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingDistribution[star] || 0
                      const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0
                      return (
                        <div key={star} className="rating-bar">
                          <span className="rating-bar__label">{star} <Star size={14} fill="currentColor" className="rating-bar__star" /></span>
                          <div className="rating-bar__track" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${star} star rating: ${count} reviews`}>
                            <div className="rating-bar__fill" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="rating-bar__count">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="review-form" noValidate>
                <h3>Write your review</h3>
                
                <div className="field">
                  <label className="field__label" htmlFor="review-name">
                    Your Name <span className="required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    className={`input ${formErrors.userName ? 'input--error' : ''}`}
                    placeholder="Enter your name"
                    value={reviewForm.userName}
                    onChange={(e) => handleInputChange('userName', e.target.value.trim())}
                    maxLength={50}
                    aria-describedby={formErrors.userName ? 'name-error' : undefined}
                    aria-invalid={!!formErrors.userName}
                  />
                  {formErrors.userName && (
                    <span id="name-error" className="field__error" role="alert">{formErrors.userName}</span>
                  )}
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="review-rating">
                    Your Rating <span className="required" aria-hidden="true">*</span>
                  </label>
                  <div className="star-rating-input" role="radiogroup" aria-label="Select rating" aria-required="true" aria-invalid={!!formErrors.rating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-input ${reviewForm.rating >= star ? 'filled' : ''}`}
                        onClick={() => handleInputChange('rating', star)}
                        aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                        aria-pressed={reviewForm.rating === star}
                      >
                        <Star size={28} fill={reviewForm.rating >= star ? 'currentColor' : 'none'} strokeWidth={2} />
                      </button>
                    ))}
                  </div>
                  {formErrors.rating && (
                    <span id="rating-error" className="field__error" role="alert">{formErrors.rating}</span>
                  )}
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="review-comment">
                    Your Review <span className="required" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="review-comment"
                    className={`input textarea ${formErrors.comment ? 'input--error' : ''}`}
                    rows={4}
                    placeholder="Share your experience..."
                    value={reviewForm.comment}
                    onChange={(e) => handleInputChange('comment', e.target.value)}
                    maxLength={2000}
                    aria-describedby={formErrors.comment ? 'comment-error' : 'comment-hint'}
                    aria-invalid={!!formErrors.comment}
                  />
                  {formErrors.comment ? (
                    <span id="comment-error" className="field__error" role="alert">{formErrors.comment}</span>
                  ) : (
                    <span id="comment-hint" className="field__hint">{reviewForm.comment.trim().length}/2000 characters</span>
                  )}
                </div>

                <div className="review-form-actions">
                  <Button type="button" variant="ghost" onClick={() => { setShowReviewForm(false); setFormErrors({}); setReviewForm({ userName: '', rating: 0, comment: '' }) }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit review'}
                  </Button>
                </div>
              </form>
            )}

            <div className="reviews-toolbar">
              <div className="reviews-sort">
                <label htmlFor="sort-reviews" className="reviews-sort__label">Sort by:</label>
                <select
                  id="sort-reviews"
                  className="input input--select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest' | 'lowest')}
                >
                  <option value="newest">Newest</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
              <div className="reviews-filter">
                <label htmlFor="filter-rating" className="reviews-filter__label">Filter:</label>
                <select
                  id="filter-rating"
                  className="input input--select"
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                >
                  <option value="all">All</option>
                  <option value={5}>5 stars</option>
                  <option value={4}>4 stars</option>
                  <option value={3}>3 stars</option>
                  <option value={2}>2 stars</option>
                  <option value={1}>1 star</option>
                </select>
              </div>
            </div>

            {sortedAndFilteredReviews.length > 0 ? (
              <div className="reviews-list">
                {sortedAndFilteredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<SearchX size={36} />}
                title={hasReviews ? 'No reviews match your filter' : 'No reviews yet'}
                description={hasReviews ? 'Try adjusting your filter to see more reviews.' : 'Be the first to share your experience with this business.'}
              />
            )}
          </div>
        </section>

        {similar.length > 0 ? (
          <section className="section">
            <SectionHeading
              eyebrow="You might also like"
              title={`More ${business.category} in Oyo State`}
            />
            <BusinessGrid businesses={similar} />
          </section>
        ) : null}
      </div>

      <AuthRequiredModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        actionLabel="write a review"
      />
    </main>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const date = formatReviewDate(review.createdAt)

  return (
    <article className="review-card">
      <header className="review-card-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar" aria-hidden="true">
            {review.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="reviewer-name-row">
              <span className="reviewer-name">{review.userName}</span>
              {review.verified && (
                <span className="verified-badge" title="Verified customer">
                  <CheckCircle2 size={14} aria-hidden="true" />
                  Verified Customer
                </span>
              )}
            </div>
            <time className="review-date" dateTime={review.createdAt}>{date}</time>
          </div>
        </div>
        <Rating value={review.rating} size="sm" />
      </header>
      <p className="review-comment">{review.comment}</p>
    </article>
  )
}

export default BusinessProfile