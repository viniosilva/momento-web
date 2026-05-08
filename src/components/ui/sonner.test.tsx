import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  CircleCheckIcon: () => <svg data-testid="circle-check" />,
  InfoIcon: () => <svg data-testid="info" />,
  Loader2Icon: () => <svg data-testid="loader" />,
  OctagonXIcon: () => <svg data-testid="octagon-x" />,
  TriangleAlertIcon: () => <svg data-testid="triangle-alert" />,
}))

// Mock the Toaster component from sonner
vi.mock('sonner', () => ({
  Toaster: ({ theme, className, closeButton, icons, style, toastOptions, ...props }: any) => (
    <div 
      data-testid="toaster"
      data-theme={theme}
      data-class-name={className}
      {...props}
    >
      {icons?.success}
      {icons?.info}
      {icons?.loading}
      {icons?.error}
      {icons?.warning}
    </div>
  ),
}))

import { Toaster } from './sonner'

describe('Toaster', () => {
  it('renders with theme', () => {
    render(<Toaster />)
    expect(screen.getByTestId('toaster')).toBeDefined()
    expect(screen.getByTestId('circle-check')).toBeDefined()
    expect(screen.getByTestId('info')).toBeDefined()
    expect(screen.getByTestId('loader')).toBeDefined()
    expect(screen.getByTestId('octagon-x')).toBeDefined()
    expect(screen.getByTestId('triangle-alert')).toBeDefined()
  })

  it('renders with custom props', () => {
    render(<Toaster position="top-center" />)
    expect(screen.getByTestId('toaster')).toBeDefined()
  })
})
