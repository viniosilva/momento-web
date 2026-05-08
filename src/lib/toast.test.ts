import { describe, expect, it } from 'vitest'

// Simple export test for toast.ts
describe('toast exports', () => {
  it('should export showApiError', async () => {
    const exports = await import('./toast')
    expect(exports.showApiError).toBeDefined()
  })
})
