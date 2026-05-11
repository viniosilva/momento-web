import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithFileRoutes } from '@/test/file-route-utils'
import { App } from './Home'

describe('Index', () => {
  it('renders index page', () => {
    renderWithFileRoutes(<App />)

    expect(screen.getByText('Organize your events.')).toBeDefined()
    expect(screen.getByText('Share it.')).toBeDefined()
    expect(screen.getByText(/Momento is a lightweight/)).toBeDefined()
    expect(screen.getByText('Start for free')).toBeDefined()
  })
})
