import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SignIn from './sign-in'

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
  useRouter: () => ({ navigate: vi.fn() }),
  createFileRoute: (_path: string) => (routeOptions: any) => ({
    options: routeOptions,
    useLoaderData: vi.fn(),
    useSearch: vi.fn(),
  }),
}));

describe('SignIn', () => {
  it('renders sign in page', () => {
    render(<SignIn />)

    expect(screen.getByText('Sign in to continue')).toBeDefined()
    expect(screen.getByText('Forgot password?')).toBeDefined()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined()
    expect(screen.getByText('Facebook')).toBeDefined()
    expect(screen.getByText('Google')).toBeDefined()
    expect(screen.getByText(/don't have an account/i)).toBeDefined()
  })
})