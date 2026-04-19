import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthDivider } from './auth-divider'

describe('AuthDivider', () => {
  it('renders divider text with 2 lines', () => {
    render(<AuthDivider />)
    
    const hrElements = document.querySelectorAll('hr')

    expect(screen.getByText('or continue with')).toBeDefined()
    expect(hrElements).toHaveLength(2)
  })
})