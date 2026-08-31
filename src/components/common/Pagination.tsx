import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageNumbers?: boolean
  maxPageNumbers?: number
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxPageNumbers = 5,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = []
  if (showPageNumbers) {
    let start = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2))
    let end = start + maxPageNumbers - 1

    if (end > totalPages) {
      end = totalPages
      start = Math.max(1, end - maxPageNumbers + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return (
    <nav className={`pagination flex items-center justify-center gap-2 ${className}`} aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn btn btn-outline btn-sm"
        aria-label="Previous page"
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>

      {showPageNumbers && (
        <div className="pagination-pages flex items-center gap-1" role="navigation" aria-label="Page numbers">
          {pages.length > 0 && pages[0] > 1 && (
            <>
              <button
                type="button"
                onClick={() => onPageChange(1)}
                className={`pagination-page btn ${currentPage === 1 ? 'btn-primary' : 'btn-outline btn-sm'}`}
                aria-label="Page 1"
                aria-current={currentPage === 1 ? 'page' : undefined}
              >
                1
              </button>
              {pages[0] > 2 && (
                <span className="pagination-ellipsis text-subtle px-1" aria-hidden="true">…</span>
              )}
            </>
          )}

          {pages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`pagination-page btn ${currentPage === page ? 'btn-primary' : 'btn-outline btn-sm'}`}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ))}

          {pages.length > 0 && pages[pages.length - 1] < totalPages && (
            <>
              {pages[pages.length - 1] < totalPages - 1 && (
                <span className="pagination-ellipsis text-subtle px-1" aria-hidden="true">…</span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                className={`pagination-page btn ${currentPage === totalPages ? 'btn-primary' : 'btn-outline btn-sm'}`}
                aria-label={`Page ${totalPages}`}
                aria-current={currentPage === totalPages ? 'page' : undefined}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn btn btn-outline btn-sm"
        aria-label="Next page"
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>

      <span className="pagination-info text-sm text-subtle" aria-live="polite">
        Page {currentPage} of {totalPages}
      </span>
    </nav>
  )
}