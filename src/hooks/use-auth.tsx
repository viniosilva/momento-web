import { createContext, useCallback, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import type { PortsLoginRequest, PortsRegisterRequest } from "../api"
import { useLogin, useRegister, useLogout } from "./use-auth-query"

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

  const loginMutation = useLogin()

  const login = useCallback(async (credentials: PortsLoginRequest) => {
    const response = await loginMutation.mutateAsync(credentials)
    const { token, refresh_token } = response
    if (!token || !refresh_token) {
      throw new Error("Invalid response from server")
    }
    setTokens(token, refresh_token)
  }, [loginMutation, setTokens])

  const registerMutation = useRegister()

  const register = useCallback(async (data: PortsRegisterRequest) => {
    await registerMutation.mutateAsync(data)
  }, [registerMutation])

  const logoutMutation = useLogout()

  const logout = useCallback(async () => {
    const refreshToken = isClient ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) : null
    if (refreshToken) {
      try {
        await logoutMutation.mutateAsync({ refresh_token: refreshToken })
      } catch {
        // ignore logout errors
      }
    }
    if (isClient) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    }
    setState({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  }, [logoutMutation])

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