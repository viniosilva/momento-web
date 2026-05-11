import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithFileRoutes } from '@/test/file-route-utils'
import { SignUp } from './SignUp'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from '@tanstack/react-router'

const mockToastError = vi.hoisted(() => vi.fn())
const mockToastSuccess = vi.hoisted(() => vi.fn())

vi.mock('sonner', () => ({
  toast: { error: mockToastError, success: mockToastSuccess },
}))

describe('SignUp', () => {
  let mockRegister: ReturnType<typeof vi.fn>
  let mockNavigate: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    mockNavigate = vi.fn()
    mockRegister = vi.fn()

    vi.mocked(useRouter).mockReturnValue({
      navigate: mockNavigate,
    } as any)

    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      register: mockRegister,
      logout: vi.fn(),
      setTokens: vi.fn(),
      isAuthenticated: false,
      token: null,
      refreshToken: null,
    })
  })

  it('renders sign up page', () => {
    renderWithFileRoutes(<SignUp />)

    expect(screen.getByText('Create your account')).toBeDefined()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDefined()
    expect(screen.getByText('Facebook')).toBeDefined()
    expect(screen.getByText('Google')).toBeDefined()
    expect(screen.getByText(/already have an account/i)).toBeDefined()
  })

  it('submits form and navigates on successful registration', async () => {
    mockRegister.mockResolvedValue(undefined)

    renderWithFileRoutes(<SignUp />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Password1!' } })

    await waitFor(() => {
      expect((screen.getByRole('button', { name: /sign up/i }) as HTMLButtonElement).disabled).toBe(false)
    })

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({ email: 'test@example.com', password: 'Password1!' })
    })
    expect(mockToastSuccess).toHaveBeenCalledWith('Registration successful! A verification email has been sent to your address. Please check your inbox.')
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/sign-in' })
  })

  it('shows error toast on registration failure', async () => {
    mockRegister.mockRejectedValue(new Error('Registration failed'))

    renderWithFileRoutes(<SignUp />)

    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Password1!' } })

    await waitFor(() => {
      expect((screen.getByRole('button', { name: /sign up/i }) as HTMLButtonElement).disabled).toBe(false)
    })

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Registration failed. Please try again.')
    })
  })
})
