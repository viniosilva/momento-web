import { vi } from 'vitest'
import type { ReactNode } from 'react'

// Apply mocks at top level so they are hoisted correctly
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return {
    ...actual,
    Link: ({ children, to }: { children: ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
    useRouter: () => ({ 
      navigate: vi.fn(),
      state: {},
      history: { push: vi.fn(), go: vi.fn() },
    }),
    useNavigate: () => vi.fn(),
    useSearch: vi.fn(() => ({ token: 'valid-token' })),
    useMatch: vi.fn(() => ({})),
    createFileRoute: (_path: string) => (routeOptions: unknown) => ({
      options: routeOptions,
      useLoaderData: vi.fn(),
      useSearch: vi.fn(() => ({ token: 'valid-token' })),
    }),
  }
})

vi.mock('@/hooks/use-auth-query', () => ({
  useValidateResetToken: vi.fn(() => ({
    data: { valid: true },
    isLoading: false,
    isError: false,
  })),
  useResetPassword: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
  useLogin: vi.fn(),
  useRegister: vi.fn(),
  useLogout: vi.fn(),
  useForgotPassword: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}))

// Conditionally mock use-auth based on global variable
vi.mock('@/hooks/use-auth', async () => {
  // If __realAuth is set, return the real module
  if ((globalThis as any).__realAuth) {
    return vi.importActual('@/hooks/use-auth')
  }
  return {
    useAuth: () => ({
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: false,
      token: null,
      refreshToken: null,
    }),
    AuthProvider: ({ children }: { children: ReactNode }) => children,
  }
})

// Export empty functions for backward compatibility
export const setupReactRouterMock = () => {}
export const setupAuthMock = () => {}
export const setupAuthQueryMock = () => {}
