import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { favoritesService } from '../services/businessService'
import type { Business } from '../types/business'

interface FavoritesContextType {
  favorites: Business[]
  favoriteIds: string[]
  loading: boolean
  addFavorite: (businessId: string) => void
  removeFavorite: (businessId: string) => void
  toggleFavorite: (businessId: string) => boolean
  isFavorite: (businessId: string) => boolean
  refresh: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [favorites, setFavorites] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  const loadFavorites = useCallback(async () => {
    try {
      const ids = favoritesService.getFavorites()
      setFavoriteIds(ids)
      const businesses = await favoritesService.getFavoriteBusinesses()
      setFavorites(businesses)
    } catch {
      setFavoriteIds([])
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  const addFavorite = useCallback((businessId: string) => {
    favoritesService.add(businessId)
    loadFavorites()
  }, [loadFavorites])

  const removeFavorite = useCallback((businessId: string) => {
    favoritesService.remove(businessId)
    loadFavorites()
  }, [loadFavorites])

  const toggleFavorite = useCallback((businessId: string) => {
    const isNowFavorite = favoritesService.toggle(businessId)
    loadFavorites()
    return isNowFavorite
  }, [loadFavorites])

  const isFavorite = useCallback((businessId: string) => {
    return favoritesService.isFavorite(businessId)
  }, [])

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        loading,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        refresh: loadFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}