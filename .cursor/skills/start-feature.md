# Start Feature

## Purpose

This skill provides a structured workflow for starting new frontend features. It ensures proper setup, documentation, and follow a consistent sequence.

## When to Use

Use this skill when:
- Starting a new feature from scratch
- Picking up an unassigned feature from the backlog
- Creating a new component or page
- Implementing a new user flow

## Workflow

### Step 1: Prepare Worktree

Before starting any feature:

1. **Check for existing dependencies**
   ```bash
   # List existing components
   ls src/components/ui/

   # List existing hooks
   ls src/hooks/

   # List existing schemas
   ls src/schemas/
   ```

2. **Check for similar implementations**
   ```bash
   # Search for similar patterns
   grep -r "feature-name" src/
   ```

3. **Check workspace configuration**
   ```bash
   # Verify workspace files
   cat .cursorrules
   cat .cursor/rules/frontend_architecture.md
   ```

### Step 2: Quick Reference Map

Before implementation, reference these:

| Task Type | Quick Reference |
|----------|----------------|
| Architecture | `@.cursor/rules/frontend_architecture.md` |
| Components | `@.cursor/rules/frontend_components.md` |
| Forms | `@.cursor/rules/frontend_forms.md` |
| Styling | `@.cursor/rules/frontend_styling.md` |
| Routes | `@.cursor/rules/frontend_routes.md` |
| Tests | `@.cursor/rules/frontend_tests.md` |
| Workflow | `@.cursor/rules/frontend_workflow.md` |

### Step 3: Feature Start Checklist

Complete this checklist before writing code:

- [ ] **Understand the feature**
  - [ ] Reviewed product requirements
  - [ ] Understood user story
  - [ ] Identified acceptance criteria

- [ ] **Plan the implementation**
  - [ ] Broke feature into smaller tasks
  - [ ] Identified components needed
  - [ ] Identified hooks needed
  - [ ] Identified schemas needed
  - [ ] Identified routes needed (if new page)
  - [ ] Test strategy planned

- [ ] **Check dependencies**
  - [ ] Existing UI components identified
  - [ ] Existing hooks identified
  - [ ] Existing schemas identified
  - [ ] API endpoints identified

- [ ] **Setup complete**
  - [ ] Dev server runs
  - [ ] Tests pass
  - [ ] No lint errors
  - [ ] Types compile

## Feature Planning Template

Use this template to plan features:

```markdown
## Feature: [Feature Name]

### User Story
As a [user type], I want [goal], so that [benefit].

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Implementation Plan

#### Components Needed
- `components/ui/` - [ ] To verify
- `routes/[feature]/` - [ ] To create

#### Hooks Needed
- `hooks/use-[feature].ts` - [ ] To create

#### Schemas Needed
- `schemas/[feature].ts` - [ ] To create

#### Routes Needed
- `routes/[feature]/` - [ ] To create

#### Tests Needed
- `[feature].test.tsx` - [ ] To create
- `[feature].test.ts` - [ ] To create

### Dependencies
- [ ] API endpoint: `/api/[endpoint]`
- [ ] External library: `[library]`
- [ ] Design system: `[system]`

### Edge Cases
- [ ] Edge case 1
- [ ] Edge case 2
```

## Quick Commands

### Development

```bash
# Start dev server
npm run dev

# Run lint
npm run lint

# Run type check
npm run typecheck

# Run tests
npm run test

# Run tests with watch
npm run test:watch
```

### Code Generation

If using code generators:

```bash
# Generate component
npx plop component

# Generate hook
npx plop hook

# Generate test
npx plop test
```

## Common Patterns

### New Feature Structure

```
src/
├── components/
│   └── ui/              ← Check here first
├── routes/
│   └── [feature]/
│       ├── components/  ← Feature components
│       ├── hooks/       ← Feature hooks
│       ├── schemas/     ← Feature schemas
│       └── index.tsx   ← Page component
├── hooks/               ← Shared hooks
├── schemas/            ← Shared schemas
└── lib/               ← Utilities
```

### Adding to Existing Feature

1. Check if component fits in `components/ui/`
2. Check if hooks fits in `hooks/`
3. Check if schema fits in `schemas/`
4. Add to feature directory if feature-specific

## Output

When starting a feature, provide this summary:

```markdown
## Feature: [Name]

### Status
- [ ] Planning complete
- [ ] Dependencies checked
- [ ] Start implementation

### Implementation Plan
1. [ ] Schema - [description]
2. [ ] Components - [description]
3. [ ] Hooks - [description]
4. [ ] Routes - [description]
5. [ ] Forms - [description]
6. [ ] Integration - [description]

### Files to Create/Modify
- `src/components/ui/` - [ ]
- `src/routes/` - [ ]
- `src/hooks/` - [ ]
- `src/schemas/` - [ ]

### Notes
[Any additional context or questions]
```

## Checklist for Completion

Before marking feature as complete:

- [ ] All acceptance criteria met
- [ ] No lint errors
- [ ] Types compile
- [ ] Tests pass
- [ ] Edge cases handled
- [ ] Accessibility verified
- [ ] Responsive design verified
- [ ] Documentation updated (if applicable)