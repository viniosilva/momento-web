import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithFileRoutes } from '@/test/file-route-utils'
import { ResetPassword } from './ResetPassword'
import React from 'react'

let capturedOnSubmit: any = null

const mockValidateResetToken = vi.fn()
let mockMutateFn = vi.fn()
let mockIsPending = false

vi.mock('@/hooks/use-auth-query', () => ({
  useValidateResetToken: (...args: any[]) => mockValidateResetToken(...args),
  useResetPassword: () => ({
    mutate: mockMutateFn,
    isPending: mockIsPending,
  }),
}))

let mockUseSearch = vi.fn(() => ({ token: 'valid-token' }))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal() as any
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useSearch: (...args: any[]) => mockUseSearch(...args),
    Link: ({ to, children, className }: any) => React.createElement('a', { href: to, className }, children),
  }
})

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() }
}))

vi.mock('@/components/ui/auth-layout', () => ({
  AuthLayout: ({ children, subtitle }: any) =>
    React.createElement('div', { 'data-testid': 'auth-layout' },
      React.createElement('h2', null, subtitle),
      children,
    ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, onClick }: any) =>
    React.createElement('button', { onClick, disabled, 'data-testid': 'button' }, children),
}))

vi.mock('@/components/ui/password-input', () => ({
  PasswordInput: ({ field, label }: any) =>
    React.createElement('div', null,
      React.createElement('label', null, label),
      React.createElement('input', {
        'data-testid': 'password-input',
        value: field.state.value,
        onChange: (e: any) => field.handleChange(e.target.value),
      }),
    ),
}))

vi.mock('@/hooks/use-form-validation', () => ({
  useFormValidation: () => vi.fn().mockReturnValue(undefined),
}))

vi.mock('@/lib/utils', () => ({
  submitForm: (e: any, form: any) => {
    e.preventDefault()
    form.handleSubmit()
  },
}))

vi.mock('@tanstack/react-form', () => ({
  useForm: (config: any) => {
    capturedOnSubmit = config.onSubmit
    return {
      handleSubmit: vi.fn(),
      Field: ({ children }: any) =>
        children({ state: { value: '', meta: { isValid: true, isTouched: false, errors: [], isValidating: false } }, handleChange: vi.fn() }),
      Subscribe: ({ children }: any) =>
        children([true, false]),
    }
  },
}))

describe('ResetPassword', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    capturedOnSubmit = null
    mockMutateFn = vi.fn()
    mockIsPending = false
    mockUseSearch = vi.fn(() => ({ token: 'valid-token' }))

    mockValidateResetToken.mockReturnValue({
      data: { valid: true },
      isLoading: false,
      isError: false,
    })
  })

  it('shows validating state', () => {
    mockValidateResetToken.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    })

    renderWithFileRoutes(<ResetPassword />)
    expect(screen.getByText('Validating token...')).toBeDefined()
  })

  it('shows invalid token state', () => {
    mockValidateResetToken.mockReturnValue({
      data: { valid: false },
      isLoading: false,
      isError: false,
    })

    renderWithFileRoutes(<ResetPassword />)
    expect(screen.getByText('Invalid or Expired Token')).toBeDefined()
  })

  it('renders form with valid token', () => {
    renderWithFileRoutes(<ResetPassword />)
    expect(screen.getByText('New password')).toBeDefined()
    expect(screen.getByText('Reset Password')).toBeDefined()
  })

  it('handles onSubmit with empty token', async () => {
    mockUseSearch = vi.fn(() => ({ token: '' }))

    renderWithFileRoutes(<ResetPassword />)

    if (capturedOnSubmit) {
      await capturedOnSubmit({ value: { password: 'Password1!' } })
    }

    expect(mockMutateFn).not.toHaveBeenCalled()
  })

  it('handles onSubmit with invalid validation', async () => {
    renderWithFileRoutes(<ResetPassword />)

    if (capturedOnSubmit) {
      await capturedOnSubmit({ value: { password: 'weak' } })
    }

    const { toast } = await import('sonner')
    expect(toast.error).toHaveBeenCalled()
  })

  it('handles successful password reset', async () => {
    mockMutateFn.mockImplementation((_data: any, { onSuccess }: any) => {
      onSuccess()
    })

    renderWithFileRoutes(<ResetPassword />)

    if (capturedOnSubmit) {
      await capturedOnSubmit({ value: { password: 'Password1!' } })
    }

    expect(mockMutateFn).toHaveBeenCalled()
    const { toast } = await import('sonner')
    expect(toast.success).toHaveBeenCalledWith('Password reset successful! Redirecting to sign in...')
  })

  it('handles failed password reset', async () => {
    mockMutateFn.mockImplementation((_data: any, { onError }: any) => {
      onError()
    })

    renderWithFileRoutes(<ResetPassword />)

    if (capturedOnSubmit) {
      await capturedOnSubmit({ value: { password: 'Password1!' } })
    }

    const { toast } = await import('sonner')
    expect(toast.error).toHaveBeenCalledWith('Failed to reset password. Please try again.')
  })

  it('disables submit when pending', () => {
    mockIsPending = true

    renderWithFileRoutes(<ResetPassword />)
    const button = screen.getByTestId('button')
    expect(button).toHaveProperty('disabled', true)
  })
})
