# Momento Web - Identity

## Stack
React 19 + TanStack Router + Tailwind CSS v4 + Vitest

## Architecture
Feature-based folder structure with shared components
- **Shared**: `components/ui/` (shadcn-like)
- **Features**: `routes/` (page-based with TanStack Router)
- **Hooks**: `hooks/`
- **Schemas**: `schemas/` (zod)
- **Lib**: `lib/` (utilities)
- **Tests**: alongside components with `.test.{ts,tsx}`

## Task Routing
- **Architecture/structure**: @.cursor/rules/frontend_architecture.md
- **Workflow/sequence**: @.cursor/rules/frontend_workflow.md
- **Components**: @.cursor/rules/frontend_components.md
- **Forms/validation**: @.cursor/rules/frontend_forms.md
- **Styling**: @.cursor/rules/frontend_styling.md
- **Routes**: @.cursor/rules/frontend_routes.md
- **Tests**: @.cursor/rules/frontend_tests.md

## Product & Architecture Docs
- **Product context**: @docs/product.md
- **Technical decisions**: @docs/architecture.md

## Principles
- TanStack Router for routing (file-based)
- Zod for validation schemas
- Tailwind CSS v4 for styling (utility-first)
- Vitest + Testing Library for tests
- shadcn-like component pattern in `components/ui/`
- **MUST create git worktree for new tasks** (isolation requirement)

## Workflow for New Tasks (MANDATORY)
**Before any implementation:**
1. Read @.cursor/skills/start-feature.md
2. Create isolated worktree: `git worktree add ../momento-web-feat-{name} -b feat/{name}`
3. Work ONLY in the new worktree
4. Never implement directly in main working directory

**Failure to create worktree = violation of project workflow**
**Failure to pass code review = incomplete implementation**

## Code Review Workflow (MANDATORY)
**Code is NOT ready until reviewer explicitly approves**

After implementation in worktree:
1. Run code review: use `reviewer` agent (or `/code-review` command)
2. Address ALL feedback from reviewer
3. Re-run review after fixes
4. Repeat steps 1-3 until reviewer approves
5. ONLY after explicit approval: code is ready for PR/merge

**Never claim "implementation is complete" before reviewer approval**
**Never skip review step - this is a hard requirement**