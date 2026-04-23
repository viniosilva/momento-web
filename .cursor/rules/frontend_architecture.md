# Frontend Architecture

## Overview

Momento Web follows a feature-based architecture with clear separation between shared resources and feature-specific code. This structure scales from small features to complex applications while maintaining developer ergonomics.

## Directory Structure

```
src/
├── components/
│   └── ui/              # shadcn-like reusable UI components
├── routes/              # TanStack Router file-based routing
├── hooks/               # Custom React hooks
├── schemas/            # Zod validation schemas
├── lib/                # Utilities and helpers
├── styles/             # Global styles and design tokens
├── __tests__/          # Shared test utilities
└── App.tsx             # Root component
```

### components/ui/

Shared UI components following shadcn-like patterns. These are generic, reusable building blocks.

**Principles:**
- Single responsibility per component
- Composable through slots and children
- Fully accessible (WCAG 2.1 AA)
- Themable via CSS variables
- documented with TypeScript

**Examples:**
- `Button.tsx` - Generic button with variants
- `Input.tsx` - Form input with error states
- `Card.tsx` - Container component
- `Modal.tsx` - Dialog overlay

### routes/

Feature-based routing using TanStack Router. Each route is a self-contained module.

**Structure:**
```
routes/
├── index.tsx           # Home route
├── auth/
│   ├── login.tsx       # Login page
│   └── register.tsx   # Register page
├── dashboard/
│   ├── index.tsx       # Dashboard home
│   └── settings.tsx   # Dashboard settings
└── routeTree.ts       # Route tree definition
```

**Principles:**
- One route file per page when simple
- Directory for complex features with multiple routes
- Route-specific hooks and schemas live alongside route
- Lazy load pages for large routes

### hooks/

Custom React hooks for reusable stateful logic.

**Categories:**
- **Feature hooks**: Lives with feature (in routes/ subdirectory)
- **Shared hooks**: Shared across features (top-level)

**Naming:**
- `useAuth.ts` - Authentication state
- `useLocalStorage.ts` - Persistence
- `useClickOutside.ts` - DOM interactions

### schemas/

Zod validation schemas for form validation and data transformation.

**Structure:**
```
schemas/
├── auth.ts            # Authentication schemas
├── user.ts            # User schemas
├── common.ts          # Shared schemas
└── index.ts          # Re-exports
```

**Principles:**
- Define at boundary (form submission, API call)
- Reusable across components
- Composable with `.extend()`
- Documented error messages

### lib/

Utilities and helpers that don't require React state.

**Categories:**
- `utils.ts` - General utilities
- `cn.ts` - Class name merging (clsx + tailwind-merge)
- `date.ts` - Date formatting
- `format.ts` - Number/currency formatting

### Tests

Test files live alongside their subject:

```
components/
├── Button.tsx
└── Button.test.tsx
├── ui/
└── Input.tsx
    └── Input.test.tsx
hooks/
├── useAuth.ts
└── useAuth.test.ts
routes/
├── login.tsx
└── login.test.tsx
```

**Framework:**
- Vitest for test runner
- @testing-library/react for component tests
- @testing-library/user-event for user interactions

## State Management

### Local State
- `useState` for component-local state
- `useReducer` for complex local state

### Server State
- TanStack Query for server data
- Loader functions in routes

### Form State
- TanStack Form for form management
- Zod for validation

### Global State
- React Context for truly global state
- Consider: Do we need global state? (usually no)

## Data Flow

```
UI → Action → Validation (Zod) → Loader/Mutation (TanStack Query) → API
```

### Read Flow (Loaders)
1. Route matches
2. Loader executes (server-side prep)
3. Data passed to component via loader data
4. Component renders with data

### Write Flow (Mutations)
1. User submits form
2. Field validation (Zod)
3. Mutation call
4. Optimistic update (optional)
5. Error/success handling
6. Navigation or feedback

## Dependency Boundaries

```
UI Components → Hooks → Schemas → Lib
                    ↓
              TanStack Query
                    ↓
                  API
```

**Rules:**
- UI components never call APIs directly
- Hooks wrap TanStack Query
- Schemas validate before mutations
- Lib is pure functions

## Imports

Use path aliases configured in tsconfig.json:

```typescript
// Always use aliases
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { loginSchema } from '@/schemas/auth'
import { cn } from '@/lib/utils'

// Never use relative paths deeper than 2 levels
// ❌ import { Button } from '../../components/ui/button'
// ✅ import { Button } from '@/components/ui/button'
```

## File Organization Summary

| Category | Location | Rule |
|----------|----------|------|
| UI Component | `components/ui/` | shadcn-like |
| Feature Component | `routes/*/` | Page or route-specific |
| Schema | `schemas/` | Zod, reusable |
| Hook (shared) | `hooks/` | Cross-feature |
| Hook (feature) | `routes/*/hooks/` | Route-specific |
| Utility | `lib/` | Pure functions |
| Test | Same directory | `.test.ts` or `.test.tsx` |