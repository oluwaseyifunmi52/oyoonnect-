import type { ReactNode } from 'react'
import { Skeleton } from '../ui/Skeleton'
import { EmptyState } from '../ui/EmptyState'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface Column<T> {
  key: string
  header: ReactNode
  cell: (_row: T) => ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  keyExtractor: (_row: T) => string
  loading?: boolean
  error?: string | null
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  emptyIcon?: ReactNode
  pagination?: {
    page: number
    totalPages: number
    totalItems: number
    onPageChange: (_page: number) => void
  }
}

export function DataTable<T>({
  columns,
  rows,
  keyExtractor,
  loading,
  error,
  emptyTitle = 'No data available',
  emptyDescription,
  emptyAction,
  emptyIcon,
  pagination,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`data-table__th data-table__th--${col.align ?? 'left'}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    <Skeleton className="skeleton--text" style={{ width: '80%', height: 16 }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (error) {
    return (
      <div className="data-table__error" role="alert">
        <p className="data-table__error-text">{error}</p>
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="table-container">
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      </div>
    )
  }

  return (
    <div className="table-container">
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`data-table__th data-table__th--${col.align ?? 'left'} ${col.className ?? ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={keyExtractor(row)} className="data-table__row">
                {columns.map((col) => (
                  <td key={col.key} className={`data-table__td data-table__td--${col.align ?? 'left'}`}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && pagination.totalPages > 1 ? (
        <div className="data-table__pagination">
          <button
            type="button"
            className="data-table__page-btn"
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="data-table__page-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            type="button"
            className="data-table__page-btn"
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      ) : null}
    </div>
  )
}
