---
issue: 06
feature: Events Management
group: Delete Event
bootstrap: 00-initial-setup.md
---

### Status: PENDING

# Feature: Delete Event

---

# 1. Feature Name
Deletar Evento

---

# 2. Context
Usuários precisam poder deletar eventos permanentemente quando não são mais necessários, com confirmação para evitar Deleções acidentais.

---

# 3. Goal
Permitir que o owner delete eventos permanentemente com dialog de confirmação e feedback visual imediato.

---

# 4. User Value
- Deleção permanente quando necessário
- Confirmação para evitar erros
- Feedback visual de sucesso
- Remoção imediata da lista

---

# 5. Scope

### Included
- Delete evento individual
- AlertDialog confirmação
- Feedback visual completo
- Loading + optimistic UI

### Excluded
- Bulk delete
- Undo após confirmação
- Soft delete (usa archive)
- Restore de deletados

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
│   └── DeleteEventAction
└── DeleteConfirmDialog

Responsabilidades:

**EventCard**
- Exibir loading overlay
- Animar remoção do card

**EventCardMenu**
- Dropdown de ações do evento

**DeleteConfirmDialog**
- Confirmação destrutiva (permanente)

---

# 8. UI Placement

### Localização do botão
EventCard → canto superior direito → kebab menu.

### Icons (lucide)
- Menu trigger → `MoreVertical`
- Delete → `Trash2`

### Menu items
Owner:
- Delete

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

## Delete

1. User abre menu do EventCard
2. Clica "Delete"
3. Abrir AlertDialog

Dialog content:

Title:
Delete event?

Description:
This action cannot be undone. This will permanently delete the event and all associated data.

Actions:
- Cancel (secondary)
- Delete (destructive)

4. Confirmar → iniciar mutation
5. Fechar dialog
6. Executar optimistic update
7. Animar remoção do card
8. Mostrar toast sucesso

---

# 11. Server State Strategy

Library: TanStack Query

## Mutation Hook
useDeleteEventMutation()

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
"Event deleted"

### Error
Toast destructive:
"Failed to delete event"

### Disabled
Menu invisível para não-owner

---

# 13. Micro-interactions

Ao deletar com sucesso:

EventCard animation:
- scale 1 → 0.98
- fade out
- remove from DOM

Duration: 200ms ease-in

---

# 14. Accessibility

- AlertDialog com focus trap
- Botões com aria-label:
  - "Delete event"
- Toast anunciado para screen readers

---

# 15. API Integration

### Delete
DELETE `/api/events/:id`
api.events.eventsDelete(id)

---

# 16. Data Model

Response:
- HTTP 204 No Content
- Evento removido do MongoDB

Error responses:
- 404: Evento não encontrado
- 403: Não é owner
- 401: Não autenticado

---

# 17. Acceptance Criteria

- Owner deleta via menu
- AlertDialog abre antes de deletar
- Evento some da lista imediatamente (optimistic)
- Loading visível durante mutation
- Toast sucesso exibido
- Rollback em caso de erro
- Não-owner não vê opção de delete (403)
- Animação executada ao remover card

---

# 18. Edge Cases

- Deletar evento com fotos → permitido (API trata)
- Não-owner tenta deletar → 403
- Evento inexistente → 404
- Clique duplo → prevenido via disabled state
- Não autenticado → redirecionar para login

---

# 19. Future Enhancements

- Bulk delete
- Recycle bin (restore temporário)
- Delete logs