# Frontend Workflow

## Overview

Every feature follows a consistent implementation sequence. This workflow ensures quality, maintainability, and proper separation of concerns.

## Implementation Sequence

### Phase 1: Research & Planning

**Step 1.1: Understand the Feature**
- Read product requirements
- Review architecture docs
- Check existing components/hooks
- Identify dependencies

**Step 1.2: Plan the Implementation**
- Break into smallest完成任务s
- Identify components needed
- Identify hooks needed
- Identify schemas needed
- Identify routes needed
- Plan test strategy

**Checklist:**
- [ ] Feature requirements understood
- [ ] Dependencies identified
- [ ] Implementation plan documented

### Phase 2: Schema First

**Step 2.1: Define Validation Schema**
- Create or update Zod schema in `schemas/`
- Define input validation
- Define output types
- Document error messages

**Step 2.2: Define Types**
- Define TypeScript interfaces
- Extend from schema types where possible

**Checklist:**
- [ ] Validation schema defined
- [ ] Types defined
- [ ] Schema tested (unit)

### Phase 3: UI Components

**Step 3.1: Create Shared Components**
- Check if needed in `components/ui/`
- Use existing when possible
- Create new when needed

**Step 3.2: Create Feature Components**
- Create in feature directory
- Use shared components
- Implement variants

**Checklist:**
- [ ] Shared components ready
- [ ] Feature components created
- [ ] Components tested (unit)

### Phase 4: Hooks

**Step 4.1: Create Custom Hooks**
- Implement feature logic
- Use TanStack Query for server state
- Handle loading/error states

**Step 4.2: Create Route Hooks**
- Route-specific hooks in feature directory
- Extract from component when complex

**Checklist:**
- [ ] Custom hooks created
- [ ] Hooks tested (unit)

### Phase 5: Routes

**Step 5.1: Create Route Files**
- Create page components
- Add loaders for data fetching
- Add actions for mutations

**Step 5.2: Wire Routes**
- Add to route tree
- Configure nested routes
- Add route parameters

**Checklist:**
- [ ] Page components created
- [ ] Loaders implemented
- [ ] Actions implemented
- [ ] Routes wired

### Phase 6: Forms (If Applicable)

**Step 6.1: Create Form**
- Use TanStack Form
- Connect to schema
- Add field validation

**Step 6.2: Connect to Action**
- Wire submit to action
- Handle errors
- Show feedback

**Checklist:**
- [ ] Form created
- [ ] Validation working
- [ ] Submit wired

### Phase 7: Integration

**Step 7.1: End-to-End Testing**
- Test user flow
- Test error cases
- Test loading states

**Step 7.2: Visual Testing**
- Verify responsive design
- Verify accessibility
- Verify theming

**Checklist:**
- [ ] E2E tests passing
- [ ] Visual verified

## Workflow Details

### Schema Definition

```typescript
// schemas/auth.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>
```

**Best Practices:**
- Start with schema
- Use descriptive error messages
- Extend for complex forms
- Reuse common fields

### Component Creation

```typescript
// components/ui/button.tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium',
          'transition-colors focus-visible:outline-none focus-visible:ring-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // variants
          variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
          // sizes
          size === 'sm' && 'h-9 px-4',
          size === 'md' && 'h-10 px-6',
          size === 'lg' && 'h-11 px-8',
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
```

**Best Practices:**
- Use forwardRef for ref forwarding
- Extend native HTML attributes
- Use cn() for class merging
- Document props with JSDoc

### Hook Creation

```typescript
// hooks/use-auth.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
)
```

**Best Practices:**
- Use Zustand for global state when needed
- Use persist middleware for persistence
- Document return type
- Test in isolation

### Route Creation

```typescript
// routes/login.tsx
import { createFileRoute } from '@tanstack/react-router'
import { loginSchema } from '@/schemas/auth'
import { useLogin } from '@/hooks/use-login'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/login')({
  component: LoginPage,
  validateSearch: zodSearchSchema(loginSchema),
})

export function LoginPage() {
  const login = useLogin()
  const form = useForm({ schema: loginSchema })

  const handleSubmit = form.onSubmit(async (values) => {
    await login.mutateAsync(values)
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <Input {...form.register('email')} label="Email" />
        <Button type="submit" loading={login.isPending}>
          Sign In
        </Button>
      </form>
    </Form>
  )
}
```

**Best Practices:**
- Use createFileRoute for file-based routing
- Use validateSearch for query params
- Co-locate loaders/actions with route
- Export Route for type safety

### TanStack Query Integration

```typescript
// hooks/use-login.ts
import { useMutation } from '@tanstack/react-query'
import { loginSchema } from '@/schemas/auth'
import { api } from '@/lib/api'

export function useLogin() {
  return useMutation({
    mutationFn: async (values: z.infer<typeof loginSchema>) => {
      const res = await api.post('/auth/login', values)
      return res.json()
    },
    onSuccess: (data) => {
      useAuth.getState().login(data.user, data.token)
    },
  })
}
```

**Best Practices:**
- Use mutation for writes
- Use query for reads
- Handle optimistic updates
- Invalidate queries on success

## Testing Sequence

### Unit Tests

```typescript
// schemas/auth.test.ts
import { loginSchema } from './auth'

describe('loginSchema', () => {
  it('validates valid email', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'invalid', password: 'password123' })
    expect(result.success).toBe(false)
  })
})
```

### Component Tests

```typescript
// components/ui/button.test.tsx
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click Me')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click Me</Button>)

    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalled()
  })
})
```

### Hook Tests

```typescript
// hooks/use-auth.test.ts
import { renderHook, act } from '@testing-library/react'
import { useAuth } from './use-auth'

describe('useAuth', () => {
  beforeEach(() => {
    useAuth.getState().logout()
  })

  it('login sets user', () => {
    const { result } = renderHook(() => useAuth())
    const user = { id: '1', email: 'test@example.com' }

    act(() => {
      result.current.login(user, 'token')
    })

    expect(result.current.user).toEqual(user)
    expect(result.current.token).toBe('token')
  })

  it('logout clears user', () => {
    const { result } = renderHook(() => useAuth())
    const user = { id: '1', email: 'test@example.com' }

    act(() => {
      result.current.login(user, 'token')
    })
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
  })
})
```

### Integration Tests

```typescript
// routes/login.test.tsx
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { LoginPage } from './login'

describe('LoginPage', () => {
  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<LoginPage />)

    await user.type(screen.getByLabelText(/email/i), 'invalid')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument()
  })
})
```

## Sequence Summary

| Phase | Deliverable | Test |
|-------|-------------|------|
| 1. Research | Plan | - |
| 2. Schema | Zod schema | ✓ Unit |
| 3. Components | UI components | ✓ Unit |
| 4. Hooks | Custom hooks | ✓ Unit |
| 5. Routes | Routes + loaders | ✓ Integration |
| 6. Forms | Form with validation | ✓ Integration |
| 7. Integration | Working feature | ✓ E2E |

## Common Pitfalls

- **Skip schema**: Always start with validation
- **Skip unit tests**: Test components/hooks in isolation
- **Skip integration**: Test user flows
- **Skip accessibility**: Test with screen reader
- **Skip responsive**: Test mobile/tablet/desktop