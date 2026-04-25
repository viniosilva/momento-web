import { createContext, useCallback, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import { api } from "../api/api"
import type { PortsLoginRequest, PortsRegisterRequest } from "../api"

interface AuthState {
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (credentials: PortsLoginRequest) => Promise<void>
  register: (data: PortsRegisterRequest) => Promise<void>
  logout: () => Promise<void>
  setTokens: (token: string, refreshToken: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEYS = {
  TOKEN: "momento_token",
  REFRESH_TOKEN: "momento_refresh_token",
} as const

const isClient = typeof window !== "undefined"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    token: isClient ? localStorage.getItem(STORAGE_KEYS.TOKEN) : null,
    refreshToken: isClient ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) : null,
    isAuthenticated: isClient ? !!localStorage.getItem(STORAGE_KEYS.TOKEN) : false,
  }))

  const setTokens = useCallback((token: string, refreshToken: string) => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    }
    setState({
      token,
      refreshToken,
      isAuthenticated: true,
    })
  }, [])

  const login = useCallback(async (credentials: PortsLoginRequest) => {
    const response = await api.auth.authLoginCreate(credentials)
    const { token, refresh_token } = response.data
    if (!token || !refresh_token) {
      throw new Error("Invalid response from server")
    }
    setTokens(token, refresh_token)
  }, [setTokens])

  const register = useCallback(async (data: PortsRegisterRequest) => {
    await api.auth.authRegisterCreate(data)
  }, [])

  const logout = useCallback(async () => {
    if (isClient) {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      if (refreshToken) {
        try {
          await api.auth.authLogoutCreate({ refresh_token: refreshToken })
        } catch {
          // ignore logout errors
        }
      }
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    }
    setState({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  }, [])

  useEffect(() => {
    if (!isClient) return

    const handleLogout = () => {
      setState({
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      })
    }

    window.addEventListener("auth:logout", handleLogout)
    return () => window.removeEventListener("auth:logout", handleLogout)
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, setTokens }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}