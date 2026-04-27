import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { RememberMeCheckbox } from './remember-me-checkbox'
import type { AnyFieldApi } from '@tanstack/react-form'

const mockField = {
  name: 'rememberMe',
  handleBlur: () => { },
  handleChange: () => { },
  state: {
    value: false,
    meta: {
      isValid: true,
      isTouched: false,
      errors: [],
    },
  },
} as unknown as AnyFieldApi

describe('RememberMeCheckbox', () => {
  it('renders unchecked checkbox and label', () => {
    render(<RememberMeCheckbox field={mockField} />)

    const checkbox = screen.getByRole<HTMLInputElement>('checkbox')
    expect(checkbox).toBeDefined()
    expect(checkbox.checked).toBe(false)
    expect(screen.getByText('Remember me')).toBeDefined()
  })

  it('renders checked checkbox when value is true', () => {
    const checkedField = {
      ...mockField,
      state: {
        ...mockField.state,
        value: true,
      },
    } as unknown as AnyFieldApi
    render(<RememberMeCheckbox field={checkedField} />)

    const checkbox = screen.getByRole<HTMLInputElement>('checkbox')
    expect(checkbox.checked).toBe(true)
  })

  it('calls handleChange and handleBlur when interacting', () => {
    const handleChange = vi.fn()
    const handleBlur = vi.fn()
    
    const fieldWithHandlers = {
      ...mockField,
      handleChange,
      handleBlur,
    } as unknown as AnyFieldApi
    
    render(<RememberMeCheckbox field={fieldWithHandlers} />)

    const checkbox = screen.getByRole<HTMLInputElement>('checkbox')
    fireEvent.click(checkbox)
    fireEvent.blur(checkbox)

    expect(handleChange).toHaveBeenCalled()
    expect(handleBlur).toHaveBeenCalled()
  })
})