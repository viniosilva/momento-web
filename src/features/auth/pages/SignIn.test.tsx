import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithFileRoutes } from '@/test/file-route-utils'
import { SignIn } from './SignIn'
import { useVerifyEmail } from '@/hooks/use-auth-query'
import { useAuth } from '@/hooks/use-auth'
import { useRouter, useSearch } from '@tanstack/react-router'

const mockToastError = vi.hoisted(() => vi.fn())
const mockToastSuccess = vi.hoisted(() => vi.fn())

vi.mock('sonner', () => ({
  toast: { error: mockToastError, success: mockToastSuccess },
}))

describe('SignIn', () => {
  let mockMutateVerify: ReturnType<typeof vi.fn>
  let mockLogin: ReturnType<typeof vi.fn>
  let mockNavigate: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    mockNavigate = vi.fn()
    mockMutateVerify = vi.fn()
    mockLogin = vi.fn()

    vi.mocked(useSearch).mockReturnValue({ token: 'valid-token' })

    vi.mocked(useRouter).mockReturnValue({
      navigate: mockNavigate,
    } as any)

    vi.mocked(useVerifyEmail).mockReturnValue({
      mutate: mockMutateVerify,
      isPending: false,
    } as any)

    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      register: vi.fn(),
      logout: vi.fn(),
      setTokens: vi.fn(),
      isAuthenticated: false,
      token: null,
      refreshToken: null,
    })
  })

  it('renders sign in page', () => {
    renderWithFileRoutes(<SignIn />)

    expect(screen.getByText('Sign in to continue')).toBeDefined()
    expect(screen.getByText('Forgot password?')).toBeDefined()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined()
    expect(screen.getByText('Facebook')).toBeDefined()
    expect(screen.getByText('Google')).toBeDefined()
    expect(screen.getByText(/don't have an account/i)).toBeDefined()
  })

  it('does not verify email when no token is present', () => {
    vi.mocked(useSearch).mockReturnValue({})

    renderWithFileRoutes(<SignIn />)

    expect(mockMutateVerify).not.toHaveBeenCalled()
  })

  it('shows success toast on successful email verification', () => {
    mockMutateVerify.mockImplementation((_data: any, { onSuccess }: any) => {
      onSuccess()
    })

    renderWithFileRoutes(<SignIn />)

    expect(mockMutateVerify).toHaveBeenCalled()
    expect(mockToastSuccess).toHaveBeenCalledWith("Your email has been verified successfully!")
  })

  it('shows expired toast on 410 verification error', () => {
    mockMutateVerify.mockImplementation((_data: any, { onError }: any) => {
      onError({ response: { status: 410 } })
    })

    renderWithFileRoutes(<SignIn />)

    expect(mockMutateVerify).toHaveBeenCalled()
    expect(mockToastError).toHaveBeenCalledWith("Verification link has expired")
  })

  it('shows invalid toast on 400 verification error', () => {
    mockMutateVerify.mockImplementation((_data: any, { onError }: any) => {
      onError({ response: { status: 400 } })
    })

    renderWithFileRoutes(<SignIn />)

    expect(mockMutateVerify).toHaveBeenCalled()
    expect(mockToastError).toHaveBeenCalledWith("Invalid verification token")
  })

  it('shows generic error toast on unknown verification error', () => {
    mockMutateVerify.mockImplementation((_data: any, { onError }: any) => {
      onError({})
    })

    renderWithFileRoutes(<SignIn />)

    expect(mockMutateVerify).toHaveBeenCalled()
    expect(mockToastError).toHaveBeenCalledWith("Failed to verify email")
  })

  it('submits form and navigates on successful login', async () => {
    mockLogin.mockResolvedValue(undefined)

    renderWithFileRoutes(<SignIn />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Password1!' } })

    await waitFor(() => {
      expect((screen.getByRole('button', { name: /sign in/i }) as HTMLButtonElement).disabled).toBe(false)
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'Password1!' })
    })
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/momentos' })
  })

  it('shows error toast on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Login failed'))

    renderWithFileRoutes(<SignIn />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Password1!' } })

    await waitFor(() => {
      expect((screen.getByRole('button', { name: /sign in/i }) as HTMLButtonElement).disabled).toBe(false)
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Invalid email or password')
    })
  })
})
