import { Filter, X, ChevronDown } from 'lucide-react'
import { Select } from '../ui/Input'
import { jobCategories } from '../../data/jobCategories'
import { getAllLocationNames } from '../../data/locations'
import { EMPLOYMENT_TYPES, EXPERIENCE_LEVELS } from '../../types/jobs'
import { JOB_SORT_OPTIONS } from '../../types/jobs'
import type { JobFilters } from '../../types/jobs'

interface JobFiltersProps {
  filters: JobFilters
  onChange: (filters: Partial<JobFilters>) => void
  activeCount: number
  onClearAll: () => void
}

export function JobFilters({
  filters,
  onChange,
  activeCount,
  onClearAll,
}: JobFiltersProps) {
  const category = filters.category ?? ''
  const location = filters.location ?? ''
  const employmentType = filters.employmentType ?? ''
  const experienceLevel = filters.experienceLevel ?? ''
  const salaryMin = filters.salaryMin ?? ''
  const featured = filters.featured ?? false
  const sortBy = filters.sort ?? 'newest'

  const locations = getAllLocationNames()

  return (
    <aside className="filters job-filters" aria-label="Job search filters">
      <div className="filters__heading">
        <Filter size={18} aria-hidden="true" />
        <h2>Filters</h2>
        {activeCount > 0 && (
          <button
            type="button"
            className="filters__clear"
            onClick={onClearAll}
            aria-label="Clear all filters"
          >
            <X size={16} />
            Clear all
          </button>
        )}
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="filter-job-category">
          Job Category
        </label>
        <Select
          label="Job Category"
          id="filter-job-category"
          value={category}
          onChange={(value) => onChange({ category: value || undefined })}
          options={jobCategories.map((c) => ({ value: c.slug, label: c.name }))}
          placeholder="All categories"
        />
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="filter-job-location">
          Location (LGA)
        </label>
        <Select
          label="Location"
          id="filter-job-location"
          value={location}
          onChange={(value) => onChange({ location: value || undefined })}
          options={locations.map((l) => ({ value: l, label: l }))}
          placeholder="All Oyo State"
        />
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="filter-employment-type">
          Employment Type
        </label>
        <Select
          label="Employment Type"
          id="filter-employment-type"
          value={employmentType}
          onChange={(value) => onChange({ employmentType: value as any || undefined })}
          options={EMPLOYMENT_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          placeholder="Any type"
        />
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="filter-experience-level">
          Experience Level
        </label>
        <Select
          label="Experience Level"
          id="filter-experience-level"
          value={experienceLevel}
          onChange={(value) => onChange({ experienceLevel: value as any || undefined })}
          options={EXPERIENCE_LEVELS.map((l) => ({ value: l.value, label: l.label }))}
          placeholder="Any level"
        />
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="filter-salary-min">
          Minimum Salary (₦/month)
        </label>
        <Select
          label="Minimum Salary"
          id="filter-salary-min"
          value={salaryMin}
          onChange={(value) => onChange({ salaryMin: value ? parseInt(value) : undefined })}
          options={[
            { value: '', label: 'Any salary' },
            { value: '50000', label: '₦50,000+' },
            { value: '80000', label: '₦80,000+' },
            { value: '100000', label: '₦100,000+' },
            { value: '150000', label: '₦150,000+' },
            { value: '200000', label: '₦200,000+' },
            { value: '300000', label: '₦300,000+' },
            { value: '500000', label: '₦500,000+' },
          ]}
          placeholder="Any salary"
        />
      </div>

      <div className="filters__group filters__group--inline">
        <input
          id="filter-featured"
          type="checkbox"
          className="filters__checkbox"
          checked={featured}
          onChange={(event) => onChange({ featured: event.target.checked })}
        />
        <label className="filters__label filters__label--check" htmlFor="filter-featured">
          Featured jobs only
        </label>
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="filter-sort">
          Sort by
        </label>
        <Select
          label="Sort by"
          id="filter-sort"
          value={sortBy}
          onChange={(value) => onChange({ sort: value })}
          options={JOB_SORT_OPTIONS}
          placeholder="Sort by"
        />
      </div>

      <div className="filters__group">
        <label className="filters__label" htmlFor="filter-job-query">
          Keyword
        </label>
        <input
          id="filter-job-query"
          className="input"
          type="search"
          placeholder="e.g. developer, nurse, driver"
          value={filters.query ?? ''}
          onChange={(event) => onChange({ query: event.target.value || undefined })}
          aria-describedby="filter-job-query-hint"
        />
        <span id="filter-job-query-hint" className="field__hint">
          Search within current results
        </span>
      </div>
    </aside>
  )
}