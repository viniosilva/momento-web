import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './header'

describe('Header', () => {
  it('renders header with logo', () => {
    render(<Header />)
    expect(screen.getByText('Momento')).toBeDefined()
  })

  it('renders search input', () => {
    render(<Header />)
    expect(screen.getByPlaceholderText('Search...')).toBeDefined()
  })

  it('renders logout button', () => {
    render(<Header />)
    expect(screen.getByText('Logout')).toBeDefined()
  })
})
