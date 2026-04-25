---
issue: 05
feature: Events Management
group: Archive Event
bootstrap: 00-initial-setup.md
---

### Status: PENDING

# Feature: Archive Event

---

# 1. Feature Name
Arquivar / Desarquivar Evento

---

# 2. Context
Usuários precisam remover eventos da lista ativa sem deletar permanentemente, permitindo restauração futura.

---

# 3. Goal
Permitir que o owner arquive/desarquive eventos com feedback visual imediato e atualização otimista da UI.

---

# 4. User Value
- Organização da lista ativa
- Recuperação fácil
- Feedback visual rápido
- Operação reversível

---

# 5. Scope

### Included
- Arquivar evento individual
- Desarquivar evento individual
- Feedback visual completo
- Loading + optimistic UI
- Confirmação antes de arquivar

### Excluded
- Bulk archive
- Página de arquivos
- Filtro archived (feature futura)

---

# 6. Frontend Architecture & Stack

### Stack obrigatória
- React + TypeScript
- TailwindCSS
- shadcn/ui
- TanStack Query
- Lucide React
- Sonner (toast)

---

# 7. Component Architecture
EventCard
├── EventCardMenu
│ ├── ArchiveEventAction
│ └── UnarchiveEventAction
└── ArchiveConfirmDialog

Responsabilidades:

**EventCard**
- Exibir loading overlay
- Animar remoção do card

**EventCardMenu**
- Dropdown de ações do evento

**ArchiveConfirmDialog**
- Confirmação destrutiva

---

# 8. UI Placement

### Localização do botão
EventCard → canto superior direito → kebab menu.

### Icons (lucide)
- Menu trigger → `MoreVertical`
- Archive → `Archive`
- Unarchive → `ArchiveRestore`

### Menu items
Owner:
- Archive (se ativo)
- Restore (se archived)

Não-owner:
- Menu oculto

---

# 9. Components (shadcn)

Obrigatórios:
- DropdownMenu
- DropdownMenuItem
- AlertDialog
- Button (variant: ghost + destructive)
- Spinner → Loader2 (lucide)
- Sonner toast

---

# 10. Interaction Flow

## Archive

1. User abre menu do EventCard
2. Clica “Archive”
3. Abrir AlertDialog

Dialog content:

Title:
Archive event?

Description:
This event will be removed from your active list.

Actions:
- Cancel (secondary)
- Archive (destructive)

4. Confirmar → iniciar mutation
5. Fechar dialog
6. Executar optimistic update
7. Animar remoção do card
8. Mostrar toast sucesso

---

## Unarchive

Sem confirmação.

1. Click Restore
2. Executar mutation
3. Reaparecer na lista ativa (invalidate query)
4. Toast sucesso

---

# 11. Server State Strategy

Library: TanStack Query

## Mutation Hook
useArchiveEventMutation()
useUnarchiveEventMutation()

### Optimistic Update

onMutate:
- Remover evento da cache `["events"]`

onError:
- Rollback cache
- Toast erro

onSuccess:
- invalidateQueries(["events"])

---

# 12. UI States

### Idle
- Menu ativo

### Loading (mutation pending)
EventCard:
- opacity-50
- pointer-events-none
- overlay spinner central

### Success
Toast:
"Event archived"

### Error
Toast destructive:
"Failed to archive event"

### Disabled
Menu invisível para não-owner

---

# 13. Micro-interactions

Ao arquivar com sucesso:

EventCard animation:
- scale 1 → 0.98
- fade out
- remove from DOM

Duration: 200ms ease-in

---

# 14. Accessibility

- AlertDialog com focus trap
- Botões com aria-label:
  - "Archive event"
  - "Restore event"
- Toast anunciado para screen readers

---

# 15. API Integration

### Archive
PATCH `/api/events/:id/archive`
api.events.eventsArchivePartialUpdate(id)

### Restore
PATCH `/api/events/:id/restore`
api.events.eventsRestorePartialUpdate(id)

---

# 16. Data Model
type EventStatus = 'upcoming' | 'past' | 'archived'

Response:
```
interface EventResponse {
id: string
title: string
content: string
status: 'archived'
deleted_at: string | null
}
```

---

# 17. Acceptance Criteria

- Owner arquiva via menu
- Evento some da lista imediatamente (optimistic)
- Loading visível durante mutation
- Toast sucesso exibido
- Rollback em caso de erro
- Owner consegue desarquivar
- Menu invisível para não-owner
- Animação executada ao remover card

---

# 18. Edge Cases

- Arquivar já arquivado → backend error
- Não-owner → 403
- Evento inexistente → 404
- Clique duplo → prevenido via disabled state

---

# 19. Future Enhancements

- Filtro archived
- Página de arquivos
- Bulk archive