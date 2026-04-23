# Frontend Forms

## Overview

Forms are the primary way users input data. We use TanStack Form for form management and Zod for validation. This combination provides excellent DX and type safety.

## Tech Stack

- **TanStack Form**: Form state management
- **Zod**: Validation schemas
- **@tanstack/zod-form-adapter**: Zod integration

## Schema-First Approach

Always define validation first.

```typescript
// schemas/user.ts
import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old').optional(),
  bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
})

export type UserFormData = z.infer<typeof userSchema>
```

## Basic Form

```typescript
// routes/user-form.tsx
import { zodValidator } from '@tanstack/zod-form-adapter'
import { useForm } from '@tanstack/react-form'
import { userSchema } from '@/schemas/user'

export function UserForm() {
  const form = useForm({
    validators: {
      onChange: userSchema,
      onSubmit: userSchema,
    },
    defaultValues: {
      name: '',
      email: '',
      age: undefined,
      bio: '',
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await form.validate()
    if (!result.hasErrors) {
      console.log('Submitting:', result.values)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <form.Field name="name">
        {(field) => (
          <div>
            <label htmlFor={field.name}>Name</label>
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.map((error) => (
              <p key={error} className="text-destructive">
                {error}
              </p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <div>
            <label htmlFor={field.name}>Email</label>
            <input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {field.state.meta.errors.map((error) => (
              <p key={error} className="text-destructive">
                {error}
              </p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field name="bio">
        {(field) => (
          <div>
            <label htmlFor={field.name}>Bio</label>
            <textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            <span>{field.state.value.length}/500</span>
            {field.state.meta.errors.map((error) => (
              <p key={error} className="text-destructive">
                {error}
              </p>
            ))}
          </div>
        )}
      </form.Field>

      <button type="submit" disabled={!form.state.canSubmit}>
        Submit
      </button>
    </form>
  )
}
```

## Form with UI Components

```typescript
// components/ui/form.tsx
import { forwardRef } from 'react'
import { useFormField } from '@tanstack/react-form'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

const FormField = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => {
  return <div ref={ref} className={cn('space-y-2', className)}>{children}</div>
})
FormField.displayName = 'FormField'

const FormItem = forwardRef<HTMLDivElement, { children: React.ReactNode }>(({ children }, ref) => (
  <div ref={ref}>{children}</div>
))
FormItem.displayName = 'FormItem'

const FormLabel = forwardRef<HTMLLabelElement, { children: React.ReactNode }>(({ children }, ref) => (
  <Label ref={ref}>{children}</Label>
))
FormLabel.displayName = 'FormLabel'

const FormControl = forwardRef<HTMLDivElement, { children: React.ReactNode }>(({ children }, ref) => (
  <div ref={ref}>{children}</div>
))
FormControl.displayName = 'FormControl'

const FormDescription = forwardRef<HTMLParagraphElement, { children: React.ReactNode }>(
  ({ children }, ref) => (
    <p ref={ref} className="text-sm text-muted-foreground">
      {children}
    </p>
  )
)
FormDescription.displayName = 'FormDescription'

const FormMessage = forwardRef<HTMLParagraphElement, { children: React.ReactNode }>(
  ({ children }, ref) => (
    <p ref={ref} role="alert" className="text-sm font-medium text-destructive">
      {children}
    </p>
  )
)
FormMessage.displayName = 'FormMessage'

// Hook to use in input components
export function useField() {
  const field = useFormField()
  return {
    ...field,
    get error() {
      return field.state.meta.errors[0]
    },
    get touched() {
      return field.state.meta.isTouched
    },
  }
}
```

### Usage with UI Components

```typescript
// routes/login.tsx
import { useForm } from '@tanstack/react-form'
import { loginSchema } from '@/schemas/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const form = useForm({
    validators: {
      onChange: loginSchema,
      onSubmit: loginSchema,
    },
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await form.validate()
    if (result.hasErrors) return

    const values = result.values
    await login.mutateAsync(values)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <form.Field name="email">
            {(field) => (
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <form.Field name="password">
            {(field) => (
              <Input
                id="password"
                type="password"
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                error={field.state.meta.errors[0]}
              />
            )}
          </form.Field>
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </div>
    </form>
  )
}
```

## Input Component Enhancement

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

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id}>{label}</Label>
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
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="text-sm text-destructive">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${id}-helper`} className="text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

## Validation Patterns

### Field-Level Validation

```typescript
import { z } from 'zod'

const emailSchema = z.string().email('Invalid email')
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')

// Using field-level validation
<form.Field
  name="email"
  validators={{
    onChange: emailSchema,
    onBlur: emailSchema,
  }}
>
  {(field) => <Input {...field} />}
</form.Field>
```

### Async Validation

```typescript
const uniqueEmailSchema = z.string().email().refine(
  async (email) => {
    const exists = await checkEmailExists(email)
    return !exists
  },
  { message: 'Email already in use' }
)
```

### Cross-Field Validation

```typescript
const formSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
```

## Complex Form Patterns

### Multi-Step Form

```typescript
// routes/multi-step.tsx
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { multiStepSchema } from '@/schemas/multi-step'

const stepSchemas = [
  multiStepSchema.pick({ name: true, email: true }),
  multiStepSchema.pick({ phone: true, address: true }),
  multiStepSchema.pick({ preferences: true }),
]

export function MultiStepForm() {
  const [step, setStep] = useState(0)
  const form = useForm({
    defaultValues: { name: '', email: '', phone: '', address: '', preferences: {} },
  })

  const handleNext = async () => {
    const isValid = await form.validateField(`_root.${step}`)
    if (!isValid.hasErrors) {
      setStep((s) => s + 1)
    }
  }

  return (
    <div>
      {step === 0 && (
        <>
          <form.Field name="name">{(field) => <Input {...field} />}</form.Field>
          <form.Field name="email">{(field) => <Input {...field} />}</form.Field>
        </>
      )}
      <Button onClick={handleNext}>Next</Button>
    </div>
  )
}
```

### Array Fields

```typescript
// schemas/todo.ts
import { z } from 'zod'

export const todoItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Task cannot be empty'),
  completed: z.boolean(),
})

export const todoListSchema = z.object({
  items: z.array(todoItemSchema),
})
```

### File Upload

```typescript
// schemas/upload.ts
import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, 'File must be under 5MB')
  .refine(
    (file) => ACCEPTED_TYPES.includes(file.type),
    'File must be JPEG, PNG, or WebP'
  )

export const uploadSchema = z.object({
  file: fileSchema,
  description: z.string().max(500),
})
```

## Form with Actions

```typescript
// routes/login.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useLogin } from '@/hooks/use-login'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const login = useLogin()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: { email: '', password: '' },
  })

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await login.mutateAsync(values)
      navigate({ to: '/dashboard' })
    } catch (error) {
      // Handle API errors
      form.setErrorMap({ onSubmit: { email: 'Invalid credentials' } })
    }
  })

  return (
    <form onSubmit={handleSubmit}>
      {/* Fields */}
    </form>
  )
}
```

## Best Practices

### Immediate Validation

```typescript
// Validate on blur, not just on submit
<form.Field
  name="email"
  validators={{
    onBlur: emailSchema,
  }}
>
  {(field) => <Input {...field} />}
</form.Field>
```

### Debounced Validation

```typescript
// For expensive validations
const debouncedEmailCheck = z.string().refine(
  debounce(async (email) => {
    return !(await checkEmailExists(email))
  }, 300),
  { message: 'Email already in use' }
)
```

### Error Display

```typescript
// Show first error only, with proper ARIA
{errors.map((error, index) => (
  <p key={index} role="alert" className="text-sm text-destructive">
    {error}
  </p>
))}
```

### Form Reset

```typescript
// Reset form
form.reset()

// Reset with new values
form.reset({ email: '', password: '' })
```

## Form Testing

```typescript
// routes/login.test.tsx
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { LoginForm } from './login'

describe('LoginForm', () => {
  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'invalid')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument()
  })

  it('shows validation error for short password', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'short')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })
})
```

## Checklist

- [ ] Schema defined first
- [ ] Field-level validation on blur
- [ ] Clear error messages
- [ ] Proper ARIA attributes
- [ ] Keyboard accessible
- [ ] Loading state during submission
- [ ] Reset functionality
- [ ] Unit tests for validation
- [ ] Integration tests for form flow