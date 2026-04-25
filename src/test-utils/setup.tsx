import type { ReactNode } from 'react'
import { vi } from 'vitest'

export const setupReactRouterMock = () => {
  vi.mock('@tanstack/react-router', () => ({
    Link: ({ children, to }: { children: ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
    useRouter: () => ({ navigate: vi.fn() }),
    useRouteai: () => ({ routeai: vi.fn() }),
    createFileRoute: (_path: string) => (routeOptions: unknown) => ({
      options: routeOptions,
      useLoaderData: vi.fn(),
      useSearch: vi.fn(),
    }),
  }))
}

export const setupAuthMock = () => {
  vi.mock('@/hooks/use-auth', () => ({
    useAuth: () => ({
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      isAuthenticated: false,
      token: null,
      refreshToken: null,
    }),
    AuthProvider: ({ children }: { children: ReactNode }) => children,
  }))
}