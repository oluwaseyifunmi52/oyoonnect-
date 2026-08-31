import { useMemo, useState } from 'react'
import { FolderOpen, Search, Tag } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { categories } from '../../data/categories'

function AdminCategories() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return categories
    return categories.filter((category) =>
      category.name.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
    )
  }, [searchQuery])

  return (
    <section className="admin-section" aria-labelledby="admin-categories-title">
      <AdminPageHeader
        title="Business Categories"
        subtitle="Review the frontend category structure prepared for backend management."
        icon={<FolderOpen size={20} />}
      />

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Input
            label="Search categories"
            placeholder="Search by name, slug, or description"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            icon={<Search size={18} />}
          />
        </div>
      </div>

      <div className="admin-table-card">
        {filteredCategories.length === 0 ? (
          <div className="admin-table-empty">
            <EmptyState
              icon={<FolderOpen size={40} />}
              title="No categories match your search"
              description="Try a different category search term."
            />
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Backend Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <span className="admin-table__cell-icon">
                      <Tag size={16} aria-hidden="true" />
                      <span className="admin-table__cell-primary">{category.name}</span>
                    </span>
                  </td>
                  <td><code>{category.slug}</code></td>
                  <td>{category.description}</td>
                  <td><span className="status-badge status-badge--pending">Ready for backend</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}

export default AdminCategories
