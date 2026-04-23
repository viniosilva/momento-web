# Frontend Components

## Overview

Components are the building blocks of our UI. We follow a shadcn-like pattern for shared components and feature-specific patterns for domain components.

## Component Categories

### UI Components (`components/ui/`)

Shared, generic components that any feature can use. These are framework-agnostic in their core but tailored for our design system.

**Characteristics:**
- Generic purpose (Button, Input, Card)
- No feature logic
- Fully customizable via props
- Well-documented API

### Feature Components

Components specific to a feature. They may compose UI components or introduce feature-specific logic.

**Characteristics:**
- Feature-specific
- May include feature logic
- Located in feature directory

## shadcn-like Pattern

We follow the shadcn-ui component pattern for shared components.

### Component Structure

```typescript
// components/ui/button.tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { ButtonProps } from './button.types'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
```

### Component Types

```typescript
// components/ui/button.types.ts
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  asChild?: boolean
  loading?: boolean
}

export function buttonVariants({ variant, size, className }: ButtonProps) {
  return cn(
    // base styles
    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    // variants
    {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      danger: 'bg-danger text-danger-foreground hover:bg-danger/90',
    },
    // sizes
    {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-11 px-8',
      icon: 'h-10 w-10',
    },
    className
  )
}
```

### Index Exports

```typescript
// components/ui/index.ts
export * from './button'
export * from './input'
export * from './card'
export * from './label'
// ...
```

## Compound Components

For complex UI patterns, use compound components for flexibility.

### Example: Card

```typescript
// components/ui/card.tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

### Usage

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Component Patterns

### Polymorphic Components

For components that can render as different elements:

```typescript
// components/ui/polymorphic.tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'

type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithoutRef<C>['ref']

type PolymorphicComponentProps<C extends React.ElementType, Props = {}> = {
  asChild?: boolean
  as?: C
} & Props &
  Omit<React.ComponentPropsWithoutRef<C>, keyof Props | 'as' | 'asChild'>

export const Link = forwardRef<HTMLAnchorElement, PolymorphicComponentProps<'a'>>(
  ({ className, asChild, as: Component = 'a', ...props }, ref) => {
    const Comp = asChild ? Slot : Component
    return <Comp ref={ref} className={cn('text-primary hover:underline', className)} {...props} />
  }
)

Link.displayName = 'Link'
```

### Controlled Components

```typescript
// components/ui/input.tsx
import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id: providedId, ...props }, ref) => {
    const generatedId = useId()
    const id = providedId ?? generatedId
    const errorId = `${id}-error`
    const helperId = `${id}-helper`

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id}>
            {label}
          </Label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-destructive">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

### Context Components

For deeply nested component communication:

```typescript
// components/ui/form/form-context.tsx
import { createContext, useContext } from 'react'

type FormContextValue = {
  control: ReturnType<typeof useFormControl>
}

const FormContext = createContext<FormContextValue | null>(null)

export function useFormContext() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider')
  }
  return context
}

export function FormProvider({ children, control }: { children: React.ReactNode; control: FormControl }) {
  return <FormContext.Provider value={{ control }}>{children}</FormContext.Provider>
}
```

## Component Best Practices

### use forwardRef

```typescript
// ❌
export function Button(props: ButtonProps) {
  return <button {...props} />
}

// ✅
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={className} {...props} />
  }
)
```

### Extend Native Attributes

```typescript
// ✅
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}
```

### Document with JSDoc

```typescript
// components/ui/button.tsx
/**
 * A button component that triggers an action.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click Me
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(...)
```

### Handle All Props

```typescript
// ✅ Properly spread remaining props
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button ref={ref} className={cn(className)} {...props} />
  }
)
```

### Use Correct HTML Elements

```typescript
// ✅ Use semantic HTML
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({ ...props }, ref) => (
  <h3 ref={ref} {...props} />
))
```

## Accessibility Requirements

###ARIA Attributes

```typescript
// ✅ Proper association
<label htmlFor={inputId}>Email</label>
<input id={inputId} aria-describedby={errorId} aria-invalid={!!error} />
{error && <p id={errorId} role="alert">{error}</p>}
```

### Keyboard Navigation

```typescript
// ✅ Focusable and keyboard accessible
<button
  className={cn('focus-visible:ring-2 focus-visible:ring-offset-2')}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick()
    }
  }}
>
```

### Focus Management

```typescript
// ✅ Focus on error
useEffect(() => {
  if (error && errorRef.current) {
    errorRef.current.focus()
  }
}, [error])
```

## Component Testing

```typescript
// components/ui/button.test.tsx
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('handles clicks', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('has accessible name from aria-label', () => {
    render(<Button aria-label="Submit form">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAccessibleName()
  })
})
```

## Component Checklist

- [ ] Uses forwardRef
- [ ] Extends native HTML attributes
- [ ] Uses cn() for class merging
- [ ] Has proper types
- [ ] Handles all props
- [ ] Uses semantic HTML
- [ ] Has proper ARIA attributes
- [ ] Is keyboard accessible
- [ ] Has unit tests
- [ ] Has documentation