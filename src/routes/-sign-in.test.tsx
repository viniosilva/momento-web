import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import SignIn from './sign-in'
import { setupAuthMock } from '@/test-utils/setup'

beforeEach(() => {
  setupAuthMock()
})

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