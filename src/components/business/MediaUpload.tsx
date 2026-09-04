import { useRef, useState } from 'react'
import type { DragEvent, ChangeEvent, KeyboardEvent } from 'react'
import { ImagePlus, UploadCloud, X, AlertCircle, Loader2 } from 'lucide-react'
import { apiClient } from '../../services/apiClient'

export interface MediaItem {
  id: string
  name: string
  src: string
  file: File
  uploadedUrl?: string
  uploading?: boolean
  uploadError?: boolean
}

interface MediaUploadProps {
  label: string
  hint?: string
  maxFiles?: number
  recommended?: string
  maxSizeMb?: number
  variant?: 'single' | 'grid'
  value: MediaItem[]
  onChange: (items: MediaItem[]) => void
  onUpload?: (file: File) => Promise<string>
}

let mediaCounter = 0
function nextId() {
  mediaCounter += 1
  return `media-${Date.now()}-${mediaCounter}`
}

export function MediaUpload({
  label,
  hint,
  maxFiles = 6,
  recommended = 'PNG or JPG',
  maxSizeMb = 4,
  variant = 'grid',
  value,
  onChange,
  onUpload,
}: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')

  const setMediaItems = (updater: MediaItem[] | ((prev: MediaItem[]) => MediaItem[])) => {
    onChange(typeof updater === 'function' ? updater(value) : updater)
  }

  const readFile = (file: File): Promise<MediaItem> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () =>
        resolve({ id: nextId(), name: file.name, src: reader.result as string, file })
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })

  const addFiles = async (files: FileList | File[]) => {
    setError('')
    const fileArray = Array.from(files)
    const images = fileArray.filter((f) => f.type.startsWith('image/'))
    if (images.length !== fileArray.length) {
      setError('Only image files are accepted.')
      return
    }
    const oversized = images.filter((f) => f.size > maxSizeMb * 1024 * 1024)
    if (oversized.length > 0) {
      setError(`Some images exceed the ${maxSizeMb}MB size limit.`)
      return
    }
    const remaining = maxFiles - value.length
    if (remaining <= 0) {
      setError(`You can upload up to ${maxFiles} image(s).`)
      return
    }
    const toAdd = images.slice(0, remaining)
    try {
      const items = await Promise.all(toAdd.map(readFile))
      
      // If upload callback provided, upload files in background
      if (onUpload) {
        const itemsWithUpload = items.map(item => ({ ...item, uploading: true }))
        setMediaItems([...value, ...itemsWithUpload])
        
        // Upload each file
        for (const item of itemsWithUpload) {
          try {
            const uploadedUrl = await onUpload(item.file)
            setMediaItems(prev => prev.map(i => 
              i.id === item.id ? { ...i, uploadedUrl, uploading: false } : i
            ))
          } catch (uploadError) {
            setMediaItems(prev => prev.map(i => 
              i.id === item.id ? { ...i, uploading: false, uploadError: true } : i
            ))
            setError('Failed to upload one or more images. Please try again.')
          }
        }
      } else {
        setMediaItems([...value, ...items])
      }
    } catch {
      setError('Failed to read the selected image(s). Please try again.')
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)
    if (event.dataTransfer.files?.length) {
      addFiles(event.dataTransfer.files)
    }
  }

  const removeItem = (id: string) => {
    setMediaItems(prev => prev.filter((item) => item.id !== id))
  }

  const handleBrowseClick = () => inputRef.current?.click()

  const handleBrowseKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      inputRef.current?.click()
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      addFiles(event.target.files)
    }
    event.target.value = ''
  }

  const atLimit = value.length >= maxFiles

  return (
    <div className="media-upload">
      <span className="media-upload__label">{label}</span>
      {value.length > 0 ? (
        <div className={variant === 'single' ? 'media-upload__single' : 'media-upload__grid'}>
          {value.map((item) => (
            <div key={item.id} className="media-upload__preview">
              {variant === 'single' ? (
                <img src={item.src} alt={item.name} className="media-upload__img media-upload__img--single" />
              ) : (
                <img src={item.src} alt={item.name} className="media-upload__img" />
              )}
              {item.uploading && (
                <div className="media-upload__uploading-overlay">
                  <Loader2 size={24} className="animate-spin" aria-hidden="true" />
                  <span>Uploading...</span>
                </div>
              )}
              {item.uploadError && (
                <div className="media-upload__upload-error">
                  <AlertCircle size={16} aria-hidden="true" />
                  <span>Upload failed</span>
                </div>
              )}
              <button
                type="button"
                className="media-upload__remove"
                aria-label={`Remove ${item.name}`}
                onClick={() => removeItem(item.id)}
                disabled={item.uploading}
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {!atLimit && (
            <button
              type="button"
              className="media-upload__tile media-upload__tile--add"
              onClick={handleBrowseClick}
              aria-label={`Add another ${label.toLowerCase()}`}
            >
              <ImagePlus size={24} aria-hidden="true" />
              <span>Add</span>
            </button>
          )}
        </div>
      ) : (
        <div
          className={`media-upload__dropzone ${dragOver ? 'media-upload__dropzone--over' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onClick={handleBrowseClick}
          onKeyDown={handleBrowseKeyDown}
          aria-label={`${label}: drag and drop, or press Enter to choose files`}
        >
          <UploadCloud size={40} aria-hidden="true" />
          <p className="media-upload__drop-text">
            <strong>Drag &amp; drop</strong> your {label.toLowerCase()} here
          </p>
          <p className="media-upload__drop-sub">or click to browse your device</p>
          <span className="media-upload__format">{recommended} · Max {maxSizeMb}MB · Up to {maxFiles}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleInputChange}
        tabIndex={-1}
      />

      {error && (
        <p className="media-upload__error" role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </p>
      )}
      {hint && !error && <p className="media-upload__hint">{hint}</p>}
    </div>
  )
}
