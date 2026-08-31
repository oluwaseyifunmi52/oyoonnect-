import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Maximize } from 'lucide-react'
import type { Business } from '../../types/business'

interface BusinessGalleryProps {
  business: Business
}

export function BusinessGallery({ business }: BusinessGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const allImages = [business.image, ...business.gallery]
  const currentImage = allImages[selectedIndex]

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isLightboxOpen) return
    if (event.key === 'ArrowRight') nextImage()
    if (event.key === 'ArrowLeft') prevImage()
    if (event.key === 'Escape') setIsLightboxOpen(false)
  }

  return (
    <>
      <div className="gallery">
        <button
          type="button"
          className="gallery__main-wrapper"
          onClick={() => setIsLightboxOpen(true)}
          aria-label={`View ${business.name} gallery`}
        >
          <img
            src={currentImage}
            alt={`${business.name} photo ${selectedIndex + 1}`}
            className="gallery__main"
            loading={selectedIndex === 0 ? 'eager' : 'lazy'}
          />
          {allImages.length > 1 && (
            <div className="gallery__main-overlay">
              <Maximize size={24} aria-hidden="true" />
              <span className="sr-only">View full gallery</span>
            </div>
          )}
        </button>

        {allImages.length > 1 && (
          <div className="gallery__thumbs" role="group" aria-label="Gallery thumbnails">
            {allImages.map((image, index) => (
              <button
                key={index}
                type="button"
                className={`gallery__thumb ${index === selectedIndex ? 'active' : ''}`}
                onClick={() => setSelectedIndex(index)}
                aria-label={`View photo ${index + 1}`}
                aria-current={index === selectedIndex ? 'true' : 'false'}
              >
                <img src={image} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {isLightboxOpen && (
        <div className="lightbox" onKeyDown={handleKeyDown} role="dialog" aria-modal="true" aria-label="Image gallery">
          <button
            type="button"
            className="lightbox__close"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close gallery"
          >
            <X size={24} />
          </button>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="lightbox__content">
            <img
              src={currentImage}
              alt={`${business.name} photo ${selectedIndex + 1}`}
              className="lightbox__image"
            />
          </div>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={nextImage}
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
          <div className="lightbox__counter" aria-live="polite">
            {selectedIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </>
  )
}