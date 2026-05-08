import { describe, expect, it } from 'vitest'

// Simple export test for event-card.tsx
describe('event-card exports', () => {
  it('should export EventCard', async () => {
    const exports = await import('./event-card')
    expect(exports.EventCard).toBeDefined()
  })
})
