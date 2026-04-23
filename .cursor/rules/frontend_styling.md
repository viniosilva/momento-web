# Frontend Styling

## Overview

We use Tailwind CSS v4 for styling. It's a utility-first CSS framework that enables rapid UI development while maintaining consistency.

## Tech Stack

- **Tailwind CSS v4**: Styling
- **CSS Variables**: Design tokens
- **clsx**: Conditional classes
- **tailwind-merge**: Merging Tailwind classes

## Setup & Configuration

### vite.config.ts

```typescript
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

### src/styles.css

```css
@import 'tailwindcss';

/* Design tokens as CSS variables */
@theme {
  /* Colors */
  --color-primary: oklch(0.25 0.1 250);
  --color-primary-foreground: oklch(0.95 0 0);
  
  --color-secondary: oklch(0.95 0.05 250);
  --color-secondary-foreground: oklch(0.15 0.05 250);
  
  --color-muted: oklch(0.96 0.02 250);
  --color-muted-foreground: oklch(0.55 0.02 250);
  
  --color-accent: oklch(0.95 0.05 50);
  --color-accent-foreground: oklch(0.15 0.05 50);
  
  --color-destructive: oklch(0.6 0.18 25);
  --color-destructive-foreground: oklch(0.95 0 0);
  
  /* Borders */
  --color-border: oklch(0.9 0.02 250);
  --color-input: oklch(0.9 0.02 250);
  --color-ring: oklch(0.6 0.1 250);
  
  /* Radius */
  --radius-sm: 0.625rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  
  /* Typography */
  --font-sans: system-ui, -apple-system, sans-serif;
  
  /* Animations */
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;
  
  @keyframes accordion-down {
    from { height: 0 }
    to { height: var(--radix-accordion-content-height) }
  }
  
  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height) }
    to { height: 0 }
  }
}

/* Base styles */
@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
  
  html {
    scroll-behavior: smooth;
  }
}

/* Utilities */
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

## Class Merging

### cn() Utility

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Usage

```typescript
import { cn } from '@/lib/utils'

function Button({ className, variant = 'primary', ...props }) {
  return (
    <button
      className={cn(
        // base styles
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        // focus styles
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        // variant
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        // disabled
        'disabled:pointer-events-none disabled:opacity-50',
        // className - always last to allow override
        className
      )}
      {...props}
    />
  )
}
```

## Design Tokens

### Colors

Use semantic color names from the theme:

```tsx
// Backgrounds
<div className="bg-background">Main background</div>
<div className="bg-card">Card background</div>
<div className="bg-popover">Popover background</div>

// Foregrounds  
<p className="text-foreground">Primary text</p>
<p className="text-muted-foreground">Secondary text</p>

// Accents
<button className="bg-primary">Primary action</button>
<button className="bg-secondary">Secondary action</button>
<button className="bg-accent">Accent action</button>

// Status
<span className="text-destructive">Error state</span>
<span className="text-success">Success state</span>
```

### Typography

```tsx
// Headings
<h1 className="text-4xl font-bold">Page Title</h1>
<h2 className="text-3xl font-semibold">Section Title</h2>
<h3 className="text-2xl font-medium">Card Title</h3>

// Body
<p className="text-base">Standard text</p>
<p className="text-sm">Small text</p>
<p className="text-xs">Caption text</p>

// Muted
<p className="text-muted-foreground">Secondary information</p>
```

### Spacing

```tsx
// Padding
<div className="p-4">Base padding</div>
<div className="p-6">Large padding</div>
<div className="px-4 py-2">Horizontal padding</div>

// Margins
<div className="mt-4">Top margin</div>
<div className="mb-4">Bottom margin</div>
<div className="space-y-4">Vertical spacing</div>
```

### Borders

```tsx
<div className="border">Base border</div>
<div className="border-2">Thick border</div>
<div className="border-t">Top border</div>
<div className="border-b">Bottom border</div>
<div className="rounded-md">Rounded corners</div>
<div className="rounded-full">Pill shape</div>
```

## Responsive Design

### Breakpoints

```tsx
// Mobile-first
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  Responsive text
</div>

// Stacking
<div className="flex flex-col md:flex-row">
  <div>First</div>
  <div>Second</div>
</div>
```

### Container Queries

```tsx
// Use @container for component-relative sizing
<div className="@container">
  <div className="@xs:text-sm @lg:text-lg">
    Container-relative text
  </div>
</div>
```

## Component Patterns

### Button Variants

```typescript
// Using cn() for variants
import { cn } from '@/lib/utils'

function buttonVariants({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return cn(
    // base
    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    // variants
    {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    },
    // sizes
    {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-11 px-8',
    },
    className
  )
}
```

### Input Styles

```tsx
<input
  className={cn(
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'disabled:cursor-not-allowed disabled:opacity-50',
    error && 'border-destructive focus-visible:ring-destructive'
  )}
/>
```

### Card Styles

```tsx
<div className="rounded-lg border bg-card text-card-foreground shadow-sm">
  <div className="flex flex-col space-y-1.5 p-6">
    <h3 className="text-2xl font-semibold leading-none tracking-tight">Title</h3>
  </div>
  <div className="p-6 pt-0">
    <p className="text-sm text-muted-foreground">Content</p>
  </div>
</div>
```

## Utility Patterns

### Flexbox

```tsx
// Centering
<div className="flex items-center justify-center">
  <div>Centered</div>
</div>

// Between
<div className="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>

// Gap
<div className="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Grid

```tsx
// Simple grid
<div className="grid grid-cols-2 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item</div>
</div>
```

### Absolute Positioning

```tsx
// Overlay
<div className="absolute inset-0">
  <div>Full overlay</div>
</div>

// Corner positioning
<div className="absolute top-4 right-4">
  <div>Top right</div>
</div>

// Center in parent
<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
  <div>Centered</div>
</div>
```

### Z-Index

```tsx
// Layering
<div className="z-10">Base layer</div>
<div className="z-20">Above</div>
<div className="z-50">Modal overlay</div>
<div className="z-[9999]">Highest</div>
```

## Custom Utilities

### Scrollbar

```css
@utility scrollbar-thin {
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    @apply w-2;
  }
  &::-webkit-scrollbar-track {
    @apply bg-transparent;
  }
  &::-webkit-scrollbar-thumb {
    @apply bg-muted rounded-full;
  }
}
```

### Text Balance

```css
@utility text-balance {
  text-wrap: balance;
}
```

## Animations

### Transitions

```tsx
// Hover transition
<button className="transition-all duration-200 hover:bg-primary/90">
  Button
</button>

// Color transition
<div className="transition-colors">
  Content
</div>

// Transform
<button className="hover:scale-105 transition-transform">
  Button
</button>
```

### Built-in Animations

```tsx
// Uses animations from theme
<div className="animate-accordion-down">
  Content
</div>

// Fade in
<div className="animate-in fade-in duration-200">
  Content
</div>

// Slide in
<div className="animate-in slide-in-from-bottom-4">
  Content
</div>
```

## Dynamic Styles

### Conditional Classes

```tsx
import { cn } from '@/lib/utils'

function StatusBadge({ status }: { status: 'active' | 'inactive' | 'pending' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-green-100 text-green-800': status === 'active',
          'bg-gray-100 text-gray-800': status === 'inactive',
          'bg-yellow-100 text-yellow-800': status === 'pending',
        }
      )}
    >
      {status}
    </span>
  )
}
```

### Conditional Styles with State

```tsx
function Input({ error, className }: { error?: boolean; className?: string }) {
  return (
    <input
      className={cn(
        'border-input focus:ring-ring',
        error ? 'border-destructive focus:ring-destructive' : 'border-input'
      )}
    />
  )
}
```

## Best Practices

### Use Design Tokens

```tsx
// ❌ Hardcoded values
<div className="text-[#333333] bg-[#f5f5f5]">

// ✅ Design tokens
<div className="text-foreground bg-background">
```

### Utility Classes

```tsx
// ❌ Custom CSS classes
<style>{`
  .my-component {
     background: white;
  }
`}</style>

// ✅ Utility classes
<div className="bg-background">
```

### Semantic HTML

```tsx
// ❌ Using div for everything
<div className="text-2xl font-bold">Title</div>

// ✅ Semantic HTML
<h2 className="text-2xl font-bold">Title</h2>
```

### Composition

```tsx
// ❌ Inline styles
<div className="flex items-center justify-between p-4 border-b">

// ✅ Composed classes
<div className="flex items-center justify-between px-4 py-4 border-b">
// Or use custom utility
@utility section {
  @apply flex items-center justify-between px-4 py-4 border-b;
}
```

## Accessibility

### Focus Styles

```tsx
// Always include focus styles
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
  Button
</button>
```

### Reduced Motion

```tsx
// Respect user preferences
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Readers

```tsx
// sr-only utility
@layer utilities {
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
}
```

## Theming

### Dark Mode

```css
@custom-variant dark (&:where(.dark, .dark *));
```

```tsx
// Using dark mode
<div className="dark:bg-black dark:text-white">
  Content
</div>
```

## Checklist

- [ ] Uses design tokens for colors
- [ ] Uses design tokens for spacing
- [ ] Has focus styles on interactive elements
- [ ] Supports reduced motion
- [ ] Uses cn() for class merging
- [ ] Mobile-first responsive
- [ ] Semantic HTML with proper heading levels
- [ ] Proper contrast ratios
- [ ] Tested in dark mode