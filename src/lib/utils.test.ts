import type { SubmitEvent } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { submitForm } from './utils'

describe('submitForm', () => {
  it('prevents default form submission', () => {
    const preventDefault = vi.fn()
    const mockForm = {
      handleSubmit: vi.fn(),
      reset: vi.fn(),
    }

    submitForm({ preventDefault } as unknown as SubmitEvent, mockForm)

    expect(preventDefault).toHaveBeenCalled()
  })

  it('calls form.handleSubmit', () => {
    const mockForm = {
      handleSubmit: vi.fn(),
      reset: vi.fn(),
    }

    submitForm({ preventDefault: vi.fn() } as unknown as SubmitEvent, mockForm)

    expect(mockForm.handleSubmit).toHaveBeenCalled()
  })

  it('calls form.reset', () => {
    const mockForm = {
      handleSubmit: vi.fn(),
      reset: vi.fn(),
    }

    submitForm({ preventDefault: vi.fn() } as unknown as SubmitEvent, mockForm)

    expect(mockForm.reset).toHaveBeenCalled()
  })
})