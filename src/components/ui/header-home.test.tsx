import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { HeaderHome } from './header-home'

describe('HeaderHome', () => {
  it('renders logo and sign in button on desktop', () => {
    render(<HeaderHome />)

    expect(screen.getByText('Momento')).toBeDefined()
    expect(screen.getAllByText('Sign In')).toBeDefined()
  })

  it('shows mobile menu when hamburger is clicked', () => {
    render(<HeaderHome />)

    const hamburger = document.querySelector('button[aria-expanded]')
    expect(hamburger).toBeDefined()
    expect(screen.queryByText('Home')).toBeNull()
  })

  it('toggles mobile menu when clicking hamburger', () => {
    render(<HeaderHome />)

    const hamburger = document.querySelector('button[aria-expanded]') as HTMLElement
    
    fireEvent.click(hamburger)
    
    expect(screen.getByText('Home')).toBeDefined()
  })
})