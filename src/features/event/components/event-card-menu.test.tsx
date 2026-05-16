import { describe, expect, it } from 'vitest'

// Simple export test for event-card-menu.tsx
describe('event-card-menu exports', () => {
  it('should export EventCardMenu', async () => {
    const exports = await import('./event-card-menu')
    expect(exports.EventCardMenu).toBeDefined()
  })
})