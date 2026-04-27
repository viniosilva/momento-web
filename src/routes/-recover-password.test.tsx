import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import RecoverPassword from './recover-password'

describe('RecoverPassword', () => {
  it('renders recover password page', () => {
    render(<RecoverPassword />)

    expect(screen.getByText('Recover your password')).toBeDefined()
    expect(screen.getByRole('button', { name: /send recovery email/i })).toBeDefined()
    expect(screen.getByText(/remember your password/i)).toBeDefined()
  })
})