import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthLayout } from './auth-layout'
import { Link } from '@tanstack/react-router'

vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router')
  return {
    ...actual,
    Link: ({ children, ...props }: any) => (
      <a {...props}>{children}</a>
    ),
  }
})

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