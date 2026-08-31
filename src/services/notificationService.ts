import type { Notification } from '../types/notifications'

const STORAGE_KEY = 'notifications'

function loadFromStorage(): Notification[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveToStorage(notifications: Notification[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  } catch {
    // ignore storage errors
  }
}

const demoNotifications: Notification[] = []


export const notificationService = {
  getNotifications(): Notification[] {
    const stored = loadFromStorage()
    if (stored.length > 0) return stored
    return demoNotifications
  },

  async fetchFromApi(): Promise<Notification[]> {
    return new Promise<Notification[]>((resolve) => {
      setTimeout(() => {
        resolve(demoNotifications)
      }, 200)
    })
  },

  markAsRead(id: string): void {
    const notifications = loadFromStorage()
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    )
    saveToStorage(updated)
  },

  markAllAsRead(): void {
    const notifications = loadFromStorage()
    const updated = notifications.map((n) => ({ ...n, read: true }))
    saveToStorage(updated)
  },

  addNotification(notification: Omit<Notification, 'id'>): void {
    const notifications = loadFromStorage()
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
    }
    saveToStorage([newNotification, ...notifications])
  },
}