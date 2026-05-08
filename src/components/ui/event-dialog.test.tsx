import { describe, expect, it } from 'vitest'

// Simple export test for event-dialog.tsx
describe('event-dialog exports', () => {
  it('should export EventDialog', async () => {
    const exports = await import('./event-dialog')
    expect(exports.EventDialog).toBeDefined()
  })
})
