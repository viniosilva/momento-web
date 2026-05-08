import { describe, expect, it } from 'vitest'
import { eventSchema } from './event.schema'

describe('eventSchema', () => {
  const validData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Team Meeting',
    content: 'Discuss project updates',
    createdAt: '2026-05-08T14:30:00Z',
  }

  it('validates correct event data', () => {
    const result = eventSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('fails with invalid UUID for id', () => {
    const data = { ...validData, id: 'invalid-uuid' }
    const result = eventSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Event id must be a valid UUID')
    }
  })

  it('fails with empty title', () => {
    const data = { ...validData, title: '' }
    const result = eventSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Event title is required')
    }
  })

  it('fails with empty content', () => {
    const data = { ...validData, content: '' }
    const result = eventSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Event content is required')
    }
  })

  it('fails with invalid createdAt', () => {
    const data = { ...validData, createdAt: '2026-05-08' }
    const result = eventSchema.safeParse(data)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Event createdAt must be a valid ISO 8601 date string')
    }
  })

  it('fails with missing required fields', () => {
    const { id, ...withoutId } = validData
    const result = eventSchema.safeParse(withoutId)
    expect(result.success).toBe(false)
  })

  it('fails with extra fields due to strict mode', () => {
    const data = { ...validData, extra: 'unexpected' }
    const result = eventSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})
