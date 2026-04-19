import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from './header'
import { Link } from '@tanstack/react-router'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}))

describe('Header', () => {
  it('renders logo and sign in button on desktop', () => {
    render(<Header />)

    expect(screen.getByText('Momento')).toBeDefined()
    expect(screen.getAllByText('Sign In')).toBeDefined()
  })

  it('shows mobile menu when hamburger is clicked', () => {
    render(<Header />)

    const hamburger = document.querySelector('button[aria-expanded]')
    expect(hamburger).toBeDefined()
    expect(screen.queryByText('Home')).toBeNull()
  })

  it('toggles mobile menu when clicking hamburger', () => {
    render(<Header />)

    const hamburger = document.querySelector('button[aria-expanded]') as HTMLElement
    
    fireEvent.click(hamburger)
    
    expect(screen.getByText('Home')).toBeDefined()
  })
})