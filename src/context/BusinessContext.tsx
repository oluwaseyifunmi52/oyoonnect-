import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { businessService } from '../services/businessService'
import type { Business, Category, Location } from '../types/business'

interface BusinessContextType {
  featuredBusinesses: Business[]
  categories: Category[]
  locations: Location[]
  loading: boolean
  refresh: () => void
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined)

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [featured, cats, locs] = await Promise.all([
        businessService.getFeatured(),
        Promise.resolve(businessService.getCategories()),
        Promise.resolve(businessService.getLocations()),
      ])
      setFeaturedBusinesses(featured)
      setCategories(cats)
      setLocations(locs)
    } catch {
      setFeaturedBusinesses([])
      setCategories([])
      setLocations([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <BusinessContext.Provider
      value={{
        featuredBusinesses,
        categories,
        locations,
        loading,
        refresh: loadData,
      }}
    >
      {children}
    </BusinessContext.Provider>
  )
}

export function useBusiness() {
  const context = useContext(BusinessContext)
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider')
  }
  return context
}