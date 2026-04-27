import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import SignUp from './sign-up'
import { setupAuthMock } from '@/test-utils/setup'

beforeEach(() => {
  setupAuthMock()
})

describe('SignUp', () => {
  it('renders sign up page', () => {
    render(<SignUp />)

    expect(screen.getByText('Create your account')).toBeDefined()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeDefined()
    expect(screen.getByText('Facebook')).toBeDefined()
    expect(screen.getByText('Google')).toBeDefined()
    expect(screen.getByText(/already have an account/i)).toBeDefined()
  })
})