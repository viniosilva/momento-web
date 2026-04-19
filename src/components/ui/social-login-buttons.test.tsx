import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SocialLoginButtons } from './social-login-buttons'

describe('SocialLoginButtons', () => {
  it('renders Facebook and Google login buttons', () => {
    render(<SocialLoginButtons />)

    expect(screen.getByText('Facebook')).toBeDefined()
    expect(screen.getByText('Google')).toBeDefined()
  })
})