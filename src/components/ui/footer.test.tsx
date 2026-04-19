import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './footer'

describe('Footer', () => {
  it('renders footer with title and copyright', () => {
    render(<Footer />)

    expect(screen.getByText('Momento')).toBeDefined()
    expect(screen.getByText(/©/)).toBeDefined()
    expect(screen.getByText(/All rights reserved/)).toBeDefined()
  })
})