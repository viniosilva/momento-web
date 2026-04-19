import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PasswordInput } from './password-input'
import type { AnyFieldApi } from '@tanstack/react-form'

const mockField = {
  name: 'password',
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

describe('PasswordInput', () => {
  it('renders label, input and toggle button without error when untouched', () => {
    render(<PasswordInput field={mockField} />)

    const input = screen.getByLabelText('Password')
    expect(input).toBeDefined()
    expect(input.getAttribute('type')).toBe('password')
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
          errors: ['Password is required'],
        },
      },
    } as unknown as AnyFieldApi

    render(<PasswordInput field={fieldWithError} />)

    expect(screen.getByText('Password is required')).toBeDefined()
  })

  it('toggles password visibility when clicking eye icon', () => {
    render(<PasswordInput field={mockField} />)

    const input = screen.getByLabelText('Password')
    const toggleButton = document.querySelector('.cursor-pointer') as HTMLElement

    expect(input.getAttribute('type')).toBe('password')

    fireEvent.click(toggleButton)
    expect(input.getAttribute('type')).toBe('text')
  })
})