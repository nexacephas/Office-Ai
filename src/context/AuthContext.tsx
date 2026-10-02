import { createContext } from 'react'

export interface AuthContextValue {
  isAuthenticated: boolean
  user?: AuthUser | null
}

export interface AuthUser {
  name: string
  role: string
  avatarUrl?: string
}

export const AuthContext = createContext<AuthContextValue | null>(null)