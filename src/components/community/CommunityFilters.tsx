import { Select } from '../ui/Input'
import { COMMUNITY_SORT_OPTIONS } from '../../types/community'
import type { CommunityFilters } from '../../types/community'

interface CommunityFiltersProps {
  filters: CommunityFilters
  onChange: (filters: Partial<CommunityFilters>) => void
  onClearAll: () => void
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'pending', label: 'Pending Verification' },
  { value: 'verified', label: 'Verified' },
  { value: 'resolved', label: 'Resolved' },
]

export function CommunityFilters({ filters, onChange, onClearAll }: CommunityFiltersProps) {
  const hasActive =
    filters.status || filters.verified || filters.sort || filters.location

  return (
    <aside className="community-filters" aria-label="Community report filters">
      <div className="community-filters__row">
        <Select
          label="Status"
          value={filters.status ?? ''}
          onChange={(value) => onChange({ status: (value || undefined) as CommunityFilters['status'] })}
          options={STATUS_OPTIONS}
          placeholder="All statuses"
        />

        <Select
          label="Sort by"
          value={filters.sort ?? 'newest'}
          onChange={(value) => onChange({ sort: value as CommunityFilters['sort'] })}
          options={COMMUNITY_SORT_OPTIONS}
          placeholder="Sort by"
        />

        <div className="community-filters__verified">
          <input
            id="filter-verified"
            type="checkbox"
            checked={filters.verified ?? false}
            onChange={(e) => onChange({ verified: e.target.checked })}
          />
          <label htmlFor="filter-verified">Verified only</label>
        </div>
      </div>

      {hasActive && (
        <button
          type="button"
          className="community-filters__clear"
          onClick={onClearAll}
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      )}
    </aside>
  )
}
