import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App  from './index'

describe('Index', () => {
  it('renders index page', () => {
    render(<App />)

    expect(screen.getByText('Organize your events.')).toBeDefined()
    expect(screen.getByText('Share it.')).toBeDefined()
    expect(screen.getByText(/Momento is a lightweight/)).toBeDefined()
    expect(screen.getByText('Start for free')).toBeDefined()
  })
})