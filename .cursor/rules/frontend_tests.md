# Frontend Tests

## Overview

We use Vitest for testing with React Testing Library. This provides fast, reliable tests with excellent developer experience.

## Tech Stack

- **Vitest**: Test runner
- **@testing-library/react**: Component testing
- **@testing-library/user-event**: User interactions
- **@vitest/coverage-v8**: Coverage

## Setup

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/**/*.d.ts',
        'src/__tests__/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Test Setup

```typescript
// src/__tests__/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
```

## Test Structure

### Colocation

Tests live alongside their subject:

```
src/
├── components/
│   ├── button.tsx
│   └── button.test.tsx
├── hooks/
│   ├── use-auth.ts
│   └── use-auth.test.ts
├── routes/
│   ├── login.tsx
│   └── login.test.tsx
└── schemas/
    ├── auth.ts
    └── auth.test.ts
```

### Naming

- `*.test.ts` - Unit tests
- `*.test.tsx` - Component tests
- `*.integration.test.ts` - Integration tests
- `*.e2e.test.ts` - E2E tests

## Unit Tests

### Testing Zod Schemas

```typescript
// schemas/auth.test.ts
import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from './auth'

describe('loginSchema', () => {
  it('validates valid email', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid email address')
    }
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'short',
    })

    expect(result.success).toBe(false)
  })

  it('accepts minimum password length', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password',
    })

    expect(result.success).toBe(true)
  })
})

describe('registerSchema', () => {
  it('validates matching passwords', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    })

    expect(result.success).toBe(true)
  })

  it('rejects non-matching passwords', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'different',
    })

    expect(result.success).toBe(false)
  })
})
```

### Testing Utilities

```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { cn } from './utils'
import { formatDate } from './date'

describe('cn', () => {
  it('merges class names', () => {
    const result = cn('foo', 'bar')
    expect(result).toBe('foo bar')
  })

  it('filters out falsy values', () => {
    const result = cn('foo', false && 'bar', 'baz')
    expect(result).toBe('foo baz')
  })

  it('handles conditional classes', () => {
    const result = cn('foo', true && 'bar', false && 'baz')
    expect(result).toBe('foo bar')
  })

  it('allows Tailwind conditional overrides', () => {
    const result = cn(
      'bg-red-500 hover:bg-red-600',
      false && 'bg-blue-500'
    )
    expect(result).toBe('bg-red-500 hover:bg-red-600')
  })
})

describe('formatDate', () => {
  it('formats date as short string', () => {
    const date = new Date('2024-01-15')
    expect(formatDate(date)).toBe('Jan 15, 2024')
  })

  it('formats date with time', () => {
    const date = new Date('2024-01-15T10:30:00')
    expect(formatDate(date, { includeTime: true })).toBe('Jan 15, 2024 at 10:30 AM')
  })
})
```

## Component Tests

### Basic Button Test

```typescript
// components/ui/button.test.tsx
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
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
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('calls onClick when pressed enter', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click Me</Button>)

    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Click Me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading text', () => {
    render(<Button loading loadingText="Saving...">
      Save
    </Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Saving...')
  })

  it('has accessible name from children', () => {
    render(<Button>Save changes</Button>)
    expect(screen.getByRole('button')).toHaveAccessibleName()
  })

  it('has accessible name from aria-label', () => {
    render(<Button aria-label="Submit form">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAccessibleName()
  })

  it('has accessible name from aria-labelledby', () => {
    render(
      <>
        <span id="submit-label">Submit</span>
        <Button aria-labelledby="submit-label">Submit</Button>
      </>
    )
    expect(screen.getByRole('button')).toHaveAccessibleName()
  })
})
```

### Form Component Test

```typescript
// components/ui/input.test.tsx
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from './input'

describe('Input', () => {
  it('renders input with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<Input label="Email" error="Invalid email" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email')
  })

  it('shows helper text', () => {
    render(<Input label="Email" helperText="We will never share your email." />)
    expect(screen.getByText(/never share/i)).toBeInTheDocument()
  })

  it('prefers error over helper text', () => {
    render(
      <Input
        label="Email"
        error="Invalid email"
        helperText="We will never share your email."
      />
    )
    expect(screen.queryByText(/never share/i)).not.toBeInTheDocument()
  })

  it('updates value on change', async () => {
    const user = userEvent.setup()
    render(<Input label="Email" />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com')
  })

  it('is accessible with error', () => {
    render(<Input label="Email" error="Invalid email" />)
    const input = screen.getByLabelText(/email/i)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby')
  })

  it('accepts disabled state', () => {
    render(<Input label="Email" disabled />)
    expect(screen.getByLabelText(/email/i)).toBeDisabled()
  })

  it('accepts placeholder', () => {
    render(<Input label="Email" placeholder="you@example.com" />)
    expect(screen.getByPlaceholderText(/example.com/i)).toBeInTheDocument()
  })
})
```

### Card Compound Components

```typescript
// components/ui/card.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'

describe('Card', () => {
  it('renders card components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    )

    expect(screen.getByRole('heading', { name: /title/i })).toBeInTheDocument()
    expect(screen.getByText(/description/i)).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('renders as semantic article', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    )

    expect(screen.getByRole('article')).toBeInTheDocument()
  })
})
```

## Hook Tests

### Testing useAuth

```typescript
// hooks/use-auth.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from './use-auth'

describe('useAuth', () => {
  beforeEach(() => {
    useAuth.getState().logout()
  })

  it('starts unauthenticated', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
  })

  it('login sets user', () => {
    const { result } = renderHook(() => useAuth())
    const user = { id: '1', email: 'test@example.com' }
    const token = 'token123'

    act(() => {
      result.current.login(user, token)
    })

    expect(result.current.user).toEqual(user)
    expect(result.current.token).toBe(token)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('logout clears user', () => {
    const { result } = renderHook(() => useAuth())
    const user = { id: '1', email: 'test@example.com' }

    act(() => {
      result.current.login(user, 'token123')
    })
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.token).toBeNull()
  })
})
```

### Testing Custom Query Hook

```typescript
// hooks/use-memories.test.ts
import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMemories } from './use-memories'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useMemories', () => {
  it('returns memories', async () => {
    const { result } = renderHook(() => useMemories(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toHaveLength(2)
  })

  it('shows loading state', () => {
    const { result } = renderHook(() => useMemories(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('shows error state on failure', async () => {
    const { result } = renderHook(() => useMemories(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})
```

## Integration Tests

### Testing Login Page

```typescript
// routes/login.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { describe, it, expect, vi } from 'vitest'
import { LoginPage } from './login'
import { routeTree } from './routeTree'

const router = createRouter({
  routeTree,
})

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<RouterProvider router={router} />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<RouterProvider router={router} />)

    await user.type(screen.getByLabelText(/email/i), 'invalid')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument()
  })

  it('shows validation error for short password', async () => {
    const user = userEvent.setup()
    render(<RouterProvider router={router} />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'short')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument()
  })

  it('navigates to dashboard on success', async () => {
    const user = userEvent.setup()
    const login = vi.fn().mockResolvedValue({ user: { id: '1' }, token: 'token' })
    render(<LoginPage login={login} />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    await waitFor(() => {
      expect(router.state.location.href).toBe('/dashboard')
    })
  })
})
```

## Best Practices

### Test Structure

```typescript
describe('ComponentName', () => {
  describe('functionality being tested', () => {
    it('should do something', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

### Queries Priority

Use queries in this priority:
1. `getByRole` - Most accessible
2. `getByLabelText` - Form fields
3. `getByText` - Static text
4. `getByTestId` - Last resort

### User Events

```typescript
// ✅ Use userEvent over fireEvent
const user = userEvent.setup()
await user.click(button)
await user.type(input, 'text')
await user.clear(input)
await user.selectOptions(select, 'option')
await user.hover(button)
```

### Async Testing

```typescript
// ✅ Use waitFor for async assertions
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// ✅ Or findBy* for auto-waiting
expect(await screen.findByText('Loaded')).toBeInTheDocument()
```

### Cleanup

```typescript
// ✅ Cleanup happens automatically with cleanup()
import { render, screen } from '@testing-library/react'
// No manual cleanup needed

// ✅ Reset between tests
beforeEach(() => {
  vi.clearAllMocks()
})
```

### Mocking

```typescript
// ✅ Mock modules
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

// ✅ Mock functions
const mockFn = vi.fn(() => 'result')

// ✅ Mock with implementation
const mockFn = vi.fn((arg) => arg * 2)

// ✅ Mock return value
const mockFn = vi.fn()
mockFn.mockReturnValue('value')
mockFn.mockResolvedValue('value')
```

## Test Coverage

### Running Coverage

```bash
vitest --coverage
```

### Coverage Thresholds

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
```

### What to Test

- [ ] Schema validation rules
- [ ] Utility functions
- [ ] UI component rendering
- [ ] UI component interactions
- [ ] UI component states (loading, error)
- [ ] UI component accessibility
- [ ] Hook state changes
- [ ] Hook side effects
- [ ] Route loaders
- [ ] Route navigation
- [ ] Form validation
- [ ] Form submission

## Checklist

- [ ] Tests co-located with source
- [ ] Tests named with `.test.{ts,tsx}`
- [ ] Uses `describe`/`it` structure
- [ ] Uses userEvent for interactions
- [ ] Uses `getByRole` for queries
- [ ] Tests happy path
- [ ] Tests error states
- [ ] Tests loading states
- [ ] Tests accessibility
- [ ] 80%+ coverage