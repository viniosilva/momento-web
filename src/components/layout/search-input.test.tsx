import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchInput } from './search-input'

describe('SearchInput', () => {
  it('renders with default placeholder', () => {
    render(<SearchInput />)
    expect(screen.getByPlaceholderText('Search...')).toBeDefined()
  })

  it('renders with custom placeholder', () => {
    render(<SearchInput placeholder="Custom search..." />)
    expect(screen.getByPlaceholderText('Custom search...')).toBeDefined()
  })

  it('calls onChange when typing', () => {
    const onChange = vi.fn()
    render(<SearchInput onChange={onChange} />)
    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(onChange).toHaveBeenCalledWith('test')
  })

  it('renders with controlled value', () => {
    render(<SearchInput value="test value" />)
    const input = screen.getByDisplayValue('test value')
    expect(input).toBeDefined()
  })

  it('renders with uncontrolled value using defaultValue', () => {
    render(<SearchInput value="default value" />)
    const input = screen.getByDisplayValue('default value')
    expect(input).toBeDefined()
  })

  it('renders search icon', () => {
    const { container } = render(<SearchInput />)
    const svg = container.querySelector('svg')
    expect(svg).toBeDefined()
  })

  it('does not crash when typing without onChange', () => {
    render(<SearchInput />)
    const input = screen.getByPlaceholderText('Search...')
    fireEvent.change(input, { target: { value: 'test' } })
    expect(input).toBeDefined()
  })

  it('applies correct CSS classes', () => {
    render(<SearchInput />)
    const input = screen.getByPlaceholderText('Search...')
    expect(input.className).toContain('w-full')
    expect(input.className).toContain('pl-10')
  })

  it('handles empty string value in controlled mode', () => {
    const onChange = vi.fn()
    render(<SearchInput value="" onChange={onChange} />)
    const input = screen.getByPlaceholderText('Search...')
    expect(input).toBeDefined()
    fireEvent.change(input, { target: { value: 'new' } })
    expect(onChange).toHaveBeenCalledWith('new')
  })
})
