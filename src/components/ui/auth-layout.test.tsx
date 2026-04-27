import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthLayout } from './auth-layout'

describe('AuthLayout', () => {
  it('renders title and children only', () => {
    render(
      <AuthLayout>Content</AuthLayout>
    )

    expect(screen.getByText('Momento')).toBeDefined()
    expect(screen.getByText('Content')).toBeDefined()
    expect(screen.queryByText('Sign in to continue')).toBeNull()
  })

  it('renders subtitle when provided', () => {
    render(
      <AuthLayout subtitle="Sign in to continue">Content</AuthLayout>
    )

    expect(screen.getByText('Sign in to continue')).toBeDefined()
  })
})