import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image, AlertCircle } from 'lucide-react'

interface PhotoUploadProps {
  images: File[]
  onChange: (images: File[]) => void
  maxImages?: number
  maxSizeMB?: number
}

export function CommunityPhotoUpload({
  images,
  onChange,
  maxImages = 5,
  maxSizeMB = 5,
}: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const generatePreviews = useCallback((files: File[]) => {
    const newPreviews: string[] = []
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        newPreviews.push(preview)
        setPreviews((prev) => [...prev, preview])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const validFiles: File[] = []
      let errorMsg: string | null = null

      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/')) {
          errorMsg = 'Only image files are allowed.'
          return
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          errorMsg = `Each image must be smaller than ${maxSizeMB}MB.`
          return
        }
        validFiles.push(file)
      })

      setError(errorMsg)

      if (validFiles.length === 0) return

      const totalAfter = images.length + validFiles.length
      if (totalAfter > maxImages) {
        setError(`Maximum ${maxImages} photos allowed.`)
        return
      }

      const newImages = [...images, ...validFiles]
      onChange(newImages)
      generatePreviews(validFiles)
    },
    [images, onChange, maxImages, maxSizeMB, generatePreviews],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault()
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
  }, [])

  const handleBrowse = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const removeImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index)
      onChange(newImages)

      const removedPreview = previews[index]
      setPreviews((prev) => prev.filter((p) => p !== removedPreview))
    },
    [images, previews, onChange],
  )

  const totalRemaining = maxImages - images.length

  return (
    <div className="photo-upload">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="photo-input"
        id="community-photo-upload"
        aria-label="Upload photos"
        disabled={images.length >= maxImages}
      />

      {error && (
        <div className="photo-upload__error" role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          {error}
        </div>
      )}

      {images.length < maxImages ? (
        <label htmlFor="community-photo-upload" className="photo-upload__dropzone" onDrop={handleDrop} onDragOver={handleDragOver}>
          <Image size={32} className="photo-upload__icon" aria-hidden="true" />
          <div className="photo-upload__content">
            <span className="photo-upload__title">Upload Photos</span>
            <span className="photo-upload__subtitle">Drag and drop images here or browse</span>
            <span className="photo-upload__hint">Up to {maxImages} photos, {maxSizeMB}MB each</span>
          </div>
        </label>
      ) : (
        <div className="photo-upload__full">
          <Image size={24} className="photo-upload__icon" aria-hidden="true" />
          <span>Maximum photos reached</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="photo-previews">
          {previews.map((preview, index) => (
            <div key={index} className="photo-preview">
              <img src={preview} alt={`Photo preview ${index + 1}`} loading="lazy" />
              <button
                type="button"
                className="photo-preview__remove"
                onClick={() => removeImage(index)}
                aria-label={`Remove photo ${index + 1}`}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {totalRemaining > 0 && images.length > 0 && (
        <button type="button" className="photo-upload__add-more" onClick={handleBrowse}>
          <Upload size={16} aria-hidden="true" />
          Add {totalRemaining} more
        </button>
      )}
    </div>
  )
}
