---
issue: 00
feature: Events Management
group: Bootstrap/Setup
bootstrap: 00-initial-setup.md
---

### Status: DONE

# Initial Setup — Events Management (Frontend)

Este documento estabelece o bootstrap/base necessário para que todas as issues da feature Events Management possam ser executadas de forma independente no frontend. Todas as issues (01-06) dependem diretamente deste setup.

---

## Prerequisites

### Authentication System

**Necessário para todas as issues (1-6):**

- Sistema de autenticação JWT funcional (via Auth provider)
- Hook de autenticação `useAuth()` com `isAuthenticated`, `user`, `token`
- Context provider para gerenciamento de estado global

```typescript
// Hook de autenticação esperado
interface AuthHook {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}
```

### API Client Setup

**Conexão com API de backend:**

- HTTP Client configurado para comunicação REST
- Headers de autenticação (Bearer token)
- Handlers de erro centralizados
- Tipos TypeScript para contratos de dados

---

## Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                    00-initial-setup                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐ │
│  │ Authentication  │    │   API Client    │    │ TanStack     │ │
│  │   (useAuth)     │    │   (Events.ts)   │    │ Query        │ │
│  └────────┬────────┘    └────────┬────────┘    └──────┬───────┘ │
└───────────┼───────────────────────┼──────────────────────┼─────────┘
            │                       │                      │
            ▼                       ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      01-create-event                          │
│         (EventDialog + /momentos page)                       │
└──────────────────────────┬──────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│02-list-events  │ │03-get-event-   │ │04-update-event  │
│                 │ │   details      │ │                 │
│ (/momentos page) │ │   (PENDING)   │ │  (EventDialog)  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│05-archive-event │ │05-archive-event │ │05-archive-event │
│                 │ │                 │ │                 │
│ (Event actions) │ │ (Event actions) │ │ (Event actions) │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│06-delete-event  │ │06-delete-event  │ │06-delete-event  │
│                 │ │                 │ │                 │
│ (Event actions) │ │ (Event actions) │ │ (Event actions) │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Dependency Summary

| Issue | Feature | Depends On |
|-------|---------|------------|
| 00 | Initial Setup | — (base) |
| 01 | Create Event | 00 (auth + API client) |
| 02 | List Events | 00 (auth + API client) + 01 (eventos existem) |
| 03 | Get Event Details | 00 (auth + API client) + 01 (evento criado) |
| 04 | Update Event | 00 (auth + API client) + 01 (evento criado) |
| 05 | Archive Event | 00 (auth + API client) + 01 (evento criado) |
| 06 | Delete Event | 00 (auth + API client) + 01 (evento criado) |

---

## Dependencies to Install

| Package | Version | Purpose |
|---------|---------|---------|
| `@tanstack/react-query` | ^5.x | Server state management, caching, and data synchronization |
| `@tanstack/react-query-devtools` | ^5.x | Developer tools for debugging queries (dev only) |

---

## UI Components

### Existing Components

| Component | Location | Usage |
|-----------|----------|-------|
| `EventDialog` | `components/ui/event-dialog.tsx` | Create/Edit dialog |
| `EventCard` | `components/ui/event-card.tsx` | Event display in list |
| `Card` | `components/ui/card.tsx` | Base card component |
| `Header` | `components/ui/header.tsx` | App header |
| `Footer` | `components/ui/footer.tsx` | App footer |

### API Endpoints Used

| Method | Endpoint | Feature |
|--------|----------|---------|
| GET | `/api/events` | 02-list-events |
| POST | `/api/events` | 01-create-event |
| GET | `/api/events/{id}` | 03-get-event-details |
| PATCH | `/api/events/{id}` | 04-update-event |
| PATCH | `/api/events/{id}/archive` | 05-archive-event |
| PATCH | `/api/events/{id}/restore` | 05-archive-event |
| DELETE | `/api/events/{id}` | 06-delete-event |

---

## Technical Notes

### Stack

- **Routing**: TanStack Router para navegação
- **State Management**: 
  - Server state → TanStack Query (cache, sincronização, refetch automático)
  - Client state → React Context + hooks locais
- **API Client**: `api/Events.ts` com tipagem completa

### Server State com TanStack Query

TanStack Query é usado para gerenciar o estado do servidor (dados vindos da API) de forma eficiente:

- **Cache automático**: Dados são cacheados locally com invalidação automática
- **Refetch on-focus**: Atualiza dados quando o usuário retorna à aba
- **Optimistic updates**: Atualização imediata da UI antes da resposta da API
- **Deduplicação de requests**: Evita fetching duplicado para mesmas queries
- **Retry automático**: Tentativas automáticas em caso de falha

---

## Implementation Status

- **Route `/momentos`**: EXISTS - lista e cria eventos in-place
- **API Layer `src/api/Events.ts`**: EXISTS - full CRUD + archive/restore
- **EventDialog**: EXISTS - usado para create/edit
- **EventCard**: EXISTS - usado para display
- **Detail Page**: NOT EXISTS - requer implementação
- **Create Page**: NOT EXISTS - integrado no /momentos
- **Edit Flow**: EXISTS - via dialog in-place
- **TanStack Query packages**: INSTALLED - @tanstack/react-query@^5.x, @tanstack/react-query-devtools@^5.x
- **QueryClientProvider**: CONFIGURED - in src/routes/__root.tsx
- **useEvents hooks**: CREATED - src/hooks/use-events.ts with useEventsList, useEventDetail, useCreateEvent, useUpdateEvent, useArchiveEvent, useRestoreEvent, useDeleteEvent