import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithFileRoutes } from '@/test/file-route-utils'
import { RecoverPassword } from './RecoverPassword'
import { setupReactRouterMock, setupAuthMock, setupAuthQueryMock } from '@/test/setup'
import { useForgotPassword } from '@/hooks/use-auth-query'

describe('RecoverPassword', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    setupReactRouterMock()
    setupAuthMock()
    setupAuthQueryMock()
  })

  it('renders recover password page', () => {
    renderWithFileRoutes(<RecoverPassword />)

    expect(screen.getByText('Recover your password')).toBeDefined()
    expect(screen.getByRole('button', { name: /send recovery email/i })).toBeDefined()
    expect(screen.getByText(/remember your password/i)).toBeDefined()
  })

  it('submits form with valid email', async () => {
    const mockMutate = vi.fn()
    const mutationResult = {
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useForgotPassword>
    vi.mocked(useForgotPassword).mockReturnValue(mutationResult)

    renderWithFileRoutes(<RecoverPassword />)

    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /send recovery email/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        expect.any(Object),
      )
    })
  })

  it('shows success message after submission', async () => {
    const mockMutate = vi.fn((_data, options) => {
      if (options?.onSuccess) options.onSuccess()
    })

    const mutationResult = {
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useForgotPassword>
    vi.mocked(useForgotPassword).mockReturnValue(mutationResult)

    renderWithFileRoutes(<RecoverPassword />)

    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /send recovery email/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email sent!/i)).toBeDefined()
    })
  })

  it('disables button when pending', () => {
    const mutationResult = {
      mutate: vi.fn(),
      isPending: true,
    } as unknown as ReturnType<typeof useForgotPassword>
    vi.mocked(useForgotPassword).mockReturnValue(mutationResult)

    renderWithFileRoutes(<RecoverPassword />)

    const submitButton = screen.getByRole('button', { name: /sending.../i })
    expect(submitButton).toHaveProperty('disabled', true)
  })
})
