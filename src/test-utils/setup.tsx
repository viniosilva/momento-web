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