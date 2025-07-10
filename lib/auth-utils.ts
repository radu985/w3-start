import { verifyToken } from './auth'

export interface AuthUser {
  id: string
  email: string
  role: string
}

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('adminToken')
}

export const getAuthUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null
  
  const userStr = localStorage.getItem('adminUser')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const isAuthenticated = (): boolean => {
  const token = getAuthToken()
  if (!token) return false
  
  try {
    const decoded = verifyToken(token)
    return decoded && decoded.role === 'admin'
  } catch {
    return false
  }
}

export const logout = (): void => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  window.location.href = '/admin'
}

export const setAuthData = (token: string, user: AuthUser): void => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('adminToken', token)
  localStorage.setItem('adminUser', JSON.stringify(user))
}

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const dynamic = "force-dynamic"; 