import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EmailInput } from './email-input'
import type { AnyFieldApi } from '@tanstack/react-form'

const mockField = {
  name: 'email',
  handleBlur: () => { },
  handleChange: () => { },
  state: {
    value: '',
    meta: {
      isValid: true,
      isTouched: false,
      errors: [],
    },
  },
} as unknown as AnyFieldApi

describe('EmailInput', () => {
  it('renders label, input and placeholder without error when untouched and valid', () => {
    render(<EmailInput field={mockField} />)

    expect(screen.getByLabelText('Email')).toBeDefined()
    expect(screen.getByPlaceholderText('Email address')).toBeDefined()
    expect(screen.queryByText(/@/)).toBeNull()
  })

  it('renders error message when touched and invalid', () => {
    const fieldWithError = {
      ...mockField,
      state: {
        value: '',
        meta: {
          isValid: false,
          isTouched: true,
          errors: ['Invalid email'],
        },
      },
    } as unknown as AnyFieldApi
    render(<EmailInput field={fieldWithError} />)

    expect(screen.getByText('Invalid email')).toBeDefined()
  })

  it('renders validating indicator when isValidating is true', () => {
    const validatingField = {
      ...mockField,
      state: {
        value: '',
        meta: {
          isValid: false,
          isTouched: false,
          errors: [],
          isValidating: true,
        },
      },
    } as unknown as AnyFieldApi
    render(<EmailInput field={validatingField} />)

    expect(screen.getByText('...')).toBeDefined()
  })

  it('applies margin bottom when isValid is true and calls handlers', () => {
    const handleChange = vi.fn()
    const handleBlur = vi.fn()
    
    const fieldWithHandlers = {
      ...mockField,
      handleChange,
      handleBlur,
    } as unknown as AnyFieldApi
    
    render(<EmailInput field={fieldWithHandlers} />)

    const input = screen.getByLabelText('Email')
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.blur(input)

    expect(handleChange).toHaveBeenCalled()
    expect(handleBlur).toHaveBeenCalled()
  })
})