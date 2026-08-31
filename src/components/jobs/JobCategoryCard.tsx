import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { JobCategory } from '../../types/jobs'

interface JobCategoryCardProps {
  category: JobCategory
  icon: ReactNode
  jobCount: number
}

export function JobCategoryCard({
  category,
  icon,
  jobCount,
}: JobCategoryCardProps) {
  return (
    <Link to={`/jobs?category=${category.slug}`} className="job-category-card">
      <div className="job-category-card__icon-wrap" aria-hidden="true">
        {icon}
      </div>
      <h3 className="job-category-card__title">{category.name}</h3>
      <p className="job-category-card__count">
        {jobCount > 0 ? `${jobCount} opportunity${jobCount === 1 ? '' : 's'}` : 'No jobs yet'}
      </p>
    </Link>
  )
}
