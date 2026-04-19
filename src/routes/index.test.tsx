import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App  from './index'

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
  useRouter: () => ({ navigate: vi.fn() }),
  createFileRoute: (_path: string) => (routeOptions: any) => ({
    options: routeOptions,
    useLoaderData: vi.fn(),
    useSearch: vi.fn(),
  }),
}));

describe('Index', () => {
  it('renders index page', () => {
    render(<App />)

    expect(screen.getByText('Organize your events.')).toBeDefined()
    expect(screen.getByText('Share it.')).toBeDefined()
    expect(screen.getByText(/Momento is a lightweight/)).toBeDefined()
    expect(screen.getByText('Start for free')).toBeDefined()
  })
})