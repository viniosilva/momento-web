# Frontend Routes

## Overview

We use TanStack Router for file-based routing. It provides excellent type safety, nested routing, and data loading patterns.

## Tech Stack

- **@tanstack/react-router**: File-based routing
- **@tanstack/react-query**: Server state management

## Route Structure

```
src/
├── routes/
│   ├── __root.tsx          # Root layout
│   ├── index.tsx           # Home page
│   ├── login.tsx           # Login page
│   ├── register.tsx        # Register page
│   ├── dashboard/
│   │   ├── index.tsx       # Dashboard home
│   │   └── settings.tsx    # Dashboard settings
│   └── routeTree.ts        # Route tree definition
└── App.tsx                 # Root component
```

## Basic Route

```typescript
// routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome to Momento</CardTitle>
          <CardDescription>Your memory companion app</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button asChild>
            <a href="/login">Sign In</a>
          </Button>
          <Button variant="secondary" asChild>
            <a href="/register">Sign Up</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

## Route with Data Loading

```typescript
// routes/dashboard/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
  loader: async ({ context }) => {
    const data = await api.get('/dashboard').json()
    return { dashboard: data }
  },
})

function DashboardPage() {
  const { dashboard } = Route.useLoaderData()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {dashboard.user.name}</p>
    </div>
  )
}
```

## Route Tree

```typescript
// routes/routeTree.ts
import { Route as rootRoute } from './__root'
import { Route as IndexRoute } from './index'
import { Route as LoginRoute } from './login'
import { Route as RegisterRoute } from './register'
import { Route as DashboardRoute } from './dashboard'
import { Route as DashboardIndexRoute } from './dashboard/index'
import { Route as DashboardSettingsRoute } from './dashboard/settings'

const routeTree = rootRoute.addChildren([
  IndexRoute,
  LoginRoute,
  RegisterRoute,
  DashboardRoute.addChildren([DashboardIndexRoute, DashboardSettingsRoute]),
])

export default routeTree
```

## Dynamic Routes

```typescript
// routes/memory/$memoryId.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const Route = createFileRoute('/memory/$memoryId')({
  component: MemoryPage,
  loader: async ({ params }) => {
    const memory = await api.get(`/memories/${params.memoryId}`).json()
    return { memory }
  },
})

function MemoryPage() {
  const { memory } = Route.useLoaderData()

  return (
    <div>
      <h1>{memory.title}</h1>
      <p>{memory.content}</p>
    </div>
  )
}
```

## Nested Layouts

```typescript
// routes/dashboard/__root.tsx (layout)
import { Outlet } from '@tanstack/react-router'
import { Link } from '@/components/ui/link'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="flex">
      <aside className="w-64 border-r p-4">
        <nav className="space-y-2">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/settings">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}
```

## Route with Search Params

```typescript
// routes/memories.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
  search: z.string().optional(),
})

export const Route = createFileRoute('/memories')({
  validateSearch: searchSchema,
  component: MemoriesPage,
})

function MemoriesPage() {
  const { page, limit, search } = Route.useSearch()

  return (
    <div>
      <input
        type="search"
        value={search}
        onChange={(e) => {
          navigate({
            to: '.',
            search: (prev) => ({ ...prev, search: e.target.value, page: 1 }),
          })
        }}
      />
      <MemoryList page={page} limit={limit} search={search} />
    </div>
  )
}
```

## Route with Actions

```typescript
// routes/memories/index.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/memories')({
  component: MemoriesPage,
  action: {
    createMemory: async ({ request }) => {
      const formData = await request.formData()
      const data = Object.fromEntries(formData)

      const memory = await api.post('/memories', { json: data }).json()
      return { memory }
    },
  },
})

function MemoriesPage() {
  const navigate = useNavigate()

  const handleCreate = useRouterAction({
    action: Route.action.createMemory,
    onSuccess: (result) => {
      navigate({ to: '/memories/$memoryId', params: { memoryId: result.memory.id } })
    },
  })

  return (
    <form action={handleCreate.action} method="post">
      <button type="submit">Create Memory</button>
    </form>
  )
}
```

## Authentication

```typescript
// routes/__root.tsx
import { createRootRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: async () => {
    const auth = useAuth.getState()
    if (!auth.token) {
      throw redirect({ to: '/login' })
    }
  },
})

function RootComponent() {
  const { isAuth } = useAuth()

  if (!isAuth) {
    return <Outlet />
  }

  return <Outlet />
}
```

## Protected Routes

```typescript
// routes/dashboard.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuth.getState()
    if (!isAuthenticated) {
      throw redirect({ to: '/login', search: { redirectTo: '/dashboard' } })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div>
      <Outlet />
    </div>
  )
}
```

## Lazy Loading

```typescript
// routes/index.tsx
import { createFileRoute, lazyRouteComponent } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: lazyRouteComponent(() =>
    import('./home-lazy').then((m) => m.HomePage)
  ),
})
```

## Error Boundaries

```typescript
// routes/memory/$memoryId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/memory/$memoryId')({
  component: MemoryPage,
  errorComponent: MemoryError,
})

function MemoryError({ error }: { error: Error }) {
  return (
    <div>
      <h1>Error loading memory</h1>
      <p>{error.message}</p>
    </div>
  )
}
```

## Prefetching

```typescript
// components/memory-card.tsx
import { useNavigate } from '@tanstack/react-router'
import { usePrefetchMemory } from '@/hooks/use-memory'

function MemoryCard({ memory }) {
  const navigate = useNavigate()
  const prefetch = usePrefetchMemory()

  return (
    <div
      onClick={() => navigate({ to: '/memory/$memoryId', params: { memoryId: memory.id } })}
      onMouseEnter={() => prefetch(memory.id)}
    >
      {memory.title}
    </div>
  )
}
```

## Route Params Type Safety

```typescript
// routes/routeTree.ts
import { routeTree } from './routeTree.gen'

// Type-safe route helpers
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      fullPath: '/'
      preLoader: typeof loader
      loader: typeof loader
    }
    '/login': {
      id: '/login'
      fullPath: '/login'
    }
    // etc.
  }
}

// Usage
const route = '/memory/$memoryId'
navigate({
  to: route,
  params: { memoryId: '123' }, // Type-safe!
})
```

## Navigation Patterns

```typescript
// Different navigation approaches
import { useNavigate, useRouter } from '@tanstack/react-router'

function Navigation() {
  const navigate = useNavigate()
  const router = useRouter()

  // Navigate to path
  navigate({ to: '/dashboard' })

  // Navigate with params
  navigate({ to: '/memory/$memoryId', params: { memoryId: '123' } })

  // Navigate with search
  navigate({ to: '/memories', search: { page: 2 } })

  // Navigate back
  router.history.back()

  // Programmatic navigation after action
  router.navigate({ to: '/dashboard' })
}
```

## Loading States

```typescript
// routes/memories.tsx
import { createFileRoute, useRouterState } from '@tanstack/react-router'

export const Route = createFileRoute('/memories')({
  component: MemoriesPage,
  loader: async () => {
    const memories = await api.get('/memories').json()
    return { memories }
  },
})

function MemoriesPage() {
  const isLoading = useRouterState({ select: (s) => s.location.state.isLoading })

  return isLoading ? <Skeleton /> : <MemoryList />
}
```

## Optimistic Updates

```typescript
// hooks/use-create-memory.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useCreateMemory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => api.post('/memories', { json: data }).json(),
    onMutated: (newMemory) => {
      // Optimistic update
      queryClient.setQueryData(['memories'], (old: Memory[]) => [newMemory, ...old])
    },
  })
}
```

## Best Practices

### File-Based Route Convention

```typescript
// ✅ Naming convention
routes/
├── index.tsx           # Home (/)
├── login.tsx           # Login (/login)
├── dashboard.tsx       # Dashboard (/dashboard)
├── dashboard/
│   ├── index.tsx      # Dashboard home (/dashboard)
│   └── settings.tsx   # (/dashboard/settings)
```

### Loader Best Practices

```typescript
// ✅ Return typed data
loader: async () => {
  const data = await fetchData()
  return { data }
}

// ✅ Handle errors
loader: async () => {
  try {
    const data = await fetchData()
    return { data }
  } catch (error) {
    throw new Error('Failed to load')
  }
}

// ✅ Pass context
loader: async ({ context }) => {
  await context.queryClient.ensureQueryData(queryOptions)
}
```

### Route Protection

```typescript
// ✅ Use beforeLoad for auth check
beforeLoad: async () => {
  const auth = useAuth.getState()
  if (!auth.isAuthenticated) {
    throw redirect({ to: '/login' })
  }
}
```

### Error Handling

```typescript
// ✅ Custom error boundary
errorComponent: ({ error }) => (
  <ErrorDisplay error={error} />
)

// ✅ Not found
loader: async ({ params }) => {
  const memory = await api.get(`/memories/${params.memoryId}`).json()
  if (!memory) {
    throw notFound({ data: { type: 'memory', id: params.memoryId } })
  }
  return { memory }
}
```

## Testing Routes

```typescript
// routes/dashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree'

describe('Dashboard', () => {
  it('redirects to login when not authenticated', async () => {
    const router = createRouter({
      routeTree,
      context: { queryClient, auth: { isAuthenticated: false } },
    })

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(router.state.location.href).toBe('/login')
    })
  })

  it('loads dashboard data', async () => {
    const router = createRouter({
      routeTree,
      context: { queryClient, auth: { isAuthenticated: true } },
    })

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument()
    })
  })
})
```

## Checklist

- [ ] File-based route convention followed
- [ ] Root route with layout
- [ ] Nested routes with layouts
- [ ] Dynamic parameters typed
- [ ] Search params with validation
- [ ] Protected routes with beforeLoad
- [ ] Error boundaries per route
- [ ] Loading states handled
- [ ] Actions for mutations
- [ ] Loaders for data fetching