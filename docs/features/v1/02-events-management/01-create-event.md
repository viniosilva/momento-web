---
issue: 01
feature: Events Management
group: Create Event
bootstrap: 00-initial-setup.md
---

### Status: DONE

# Feature: Create Event

---

# 1. Feature Name
Criar Evento

---

# 2. Context
Usuários precisam criar novos eventos para organizar momentos. O sistema fornece uma interface de diálogo integrada à página /momentos, permitindo inserção de título e conteúdo com auto-save.

---

# 3. Goal
Permitir que usuários autenticados criem eventos através do EventDialog com validação em tempo real, auto-save com debounce e feedback visual imediato.

---

# 4. User Value
- Criação rápida sem navegar para outra página
- Auto-save com 1.5s de debounce
- Feedback visual imediato
- Interface intuitiva com validação em tempo real

---

# 5. Scope

### Included
- EventDialog com campos título e conteúdo
- Título obrigatório com validação
- Conteúdo opcional
- Auto-save com 1.5s debounce
- Fechar via botão Close ou Ctrl+Enter
- Toast de sucesso/erro
- TanStack Query mutation

### Excluded
- Upload de fotos
- Convite de participantes
- Definição de data do evento (simplificado)
- Bulk creation

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

```
EventDialog
├── Dialog (shadcn)
├── DialogHeader
│   ├── DialogTitle
│   └── DialogDescription
├── Form
│   ├── Input (título)
│   ├── Textarea (conteúdo)
│   └── ValidationError
├── DialogFooter
│   └── Button (Close)
└── LoadingOverlay
```

Responsabilidades:

**EventDialog**
- Controlled component via props (open, onOpenChange)
- Handle form state
- Debounced auto-save (1.5s)
- Validation feedback

**Form fields**
- Title: Input com autofocus
- Content: Textarea com auto-resize

---

# 8. UI Placement

### Trigger
Input placeholder "Create an event..." na página /momentos
Teclado: Ctrl+N

### Dialog positioning
Centralizado na tela (default shadcn Dialog)

### Fields order
1. Title (obrigatório)
2. Content (opcional)
3. Close button

### Icons (lucide)
- Close → `X`
- Saving indicator → `Loader2`

---

# 9. Components (shadcn)

Obrigatórios:
- Dialog
- DialogContent
- DialogHeader
- DialogTitle
- DialogDescription
- DialogFooter
- Input
- Textarea
- Button (variant: default + ghost)
- Spinner → Loader2 (lucide)
- Sonner toast

---

# 10. Interaction Flow

## Create Event

1. User clica no input "Create an event..." ou usa Ctrl+N
2. EventDialog abre
3. Campo título recebe focus automaticamente
4. User preenche título (obrigatório)
5. User preenche conteúdo (opcional)
6. Sistema faz auto-save após 1.5s de inatividade
7. OU user clica Close / Ctrl+Enter
8. Dialog fecha
9. Evento aparece na lista
10. Toast sucesso exibido

### Validation Flow
- Título vazio → mensagem de erro inline
- Auto-save ignorado se título vazio

---

# 11. Server State Strategy

Library: TanStack Query

## Current Implementation
- Estado local via `useState` em `/momentos`
- API call direta via `api.events.eventsCreate()`

## Target Architecture (pending migration)
```
useCreateEventMutation()
```

### Mutation Flow

onMutate:
- Preparar payload `{ title, content }`

onError:
- Toast erro com mensagem do backend

onSuccess:
- invalidateQueries(["events"])
- Limpar form state
- Toast sucesso

---

# 12. UI States

### Idle
- Dialog aberto com campos vazios ou preenchidos
- Título com focus

### Typing
- Campo ativo com cursor
- Debounce timer ativo (1.5s)

### Saving
- Spinner visível no campo ou footer
- Campos disabled
- "Saving..." no footer

### Success
Toast:
- "Event created"

### Error
Toast destructive:
- "Failed to create event"
- Mensagem do backend se disponível

### Validation Error
- Título highlight vermelho
- Mensagem abaixo do campo: "Title is required"

### Closed
- Dialog não renderizado
- Form resetado

---

# 13. Micro-interactions

Ao fechar dialog com sucesso:

Dialog animation:
- Fade out
- Scale down sutil

Duration: 200ms ease-out

Loading spinner durante save:
- Pulse animation no Loader2

---

# 14. Accessibility

- Dialog com focus trap
- Auto-focus no campo título
- aria-label nos campos
- Escape para fechar
- Ctrl+Enter como atalho alternativo
- Toast anunciado para screen readers
- Error messages com aria-live

---

# 15. API Integration

### Create
POST `/api/events/`
api.events.eventsCreate({ title, content })

Request:
```typescript
interface CreateEventRequest {
  title: string      // obrigatório
  content?: string  // opcional
}
```

Response:
```typescript
interface EventResponse {
  id: string
  title: string
  content: string
  created_at: string
}
```

---

# 16. Data Model

```typescript
interface Event {
  id: string
  title: string
  content: string
  status: 'upcoming' | 'past' | 'archived'
  created_at: string
  deleted_at: string | null
}
```

### Create Request
```typescript
interface CreateEventRequest {
  title: string      // obrigatório, max 200 chars
  content?: string  // opcional, max 5000 chars
}
```

---

# 17. Acceptance Criteria

- [x] User abre dialog via click no input placeholder
- [x] User abre dialog via Ctrl+N
- [x] Campo título é focado automaticamente
- [x] Título é obrigatório com validação
- [x] Conteúdo é opcional
- [x] Auto-save funciona após 1.5s de inatividade
- [x] Dialog fecha após Close ou Ctrl+Enter
- [x] Evento aparece na lista após criação
- [x] Toast sucesso exibido
- [x] Toast erro exibido em caso de falha da API

---

# 18. Edge Cases

- [x] Título vazio → validação impede save
- [x] API falha → toast erro
- [x] Usuário não autenticado → redirect login
- [x] Muitos eventos → paginação futura
- [x] Caracteres especiais → permite emojis e formatação
- [x] Clique duplo → prevenido via disabled state durante save
- [x] Dialog fechado durante debounce → cancela save pendente

---

# 19. Future Enhancements

- Migração completa para TanStack Query mutations
- Upload de fotos no evento
- Definição de data do evento
- Bulk creation
- Templates de eventos
- Rich text editor para conteúdo