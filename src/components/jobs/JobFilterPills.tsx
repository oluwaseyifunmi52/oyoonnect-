import type { EmploymentType } from '../../types/jobs'

const FILTER_PILLS: { label: string; value: EmploymentType | '' }[] = [
  { label: 'All Categories', value: '' },
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
  { label: 'Apprenticeship', value: 'apprenticeship' },
]

interface JobFilterPillsProps {
  activeType: EmploymentType | ''
  onChange: (value: EmploymentType | '') => void
}

export function JobFilterPills({
  activeType,
  onChange,
}: JobFilterPillsProps) {
  return (
    <div
      className="job-filter-pills"
      role="group"
      aria-label="Job type filters"
    >
      {FILTER_PILLS.map((pill) => {
        const isActive = activeType === pill.value
        return (
          <button
            key={pill.value || 'all'}
            type="button"
            className={`job-filter-pill ${isActive ? 'job-filter-pill--active' : ''}`}
            onClick={() => onChange(pill.value)}
          >
            {pill.label}
          </button>
        )
      })}
    </div>
  )
}
