---
issue: 04
feature: Events Management
group: Update Event
bootstrap: 00-initial-setup.md
---

### Status: DONE

# Feature: Update Event

---

# 1. Feature Name
Atualizar Evento (Update Event UI)

---

# 2. Context
Usuários precisam editar informações de eventos existentes, corrigindo erros ou atualizando detalhes de forma intuitiva.

---

# 3. Goal
Permitir que o owner de um evento edite título e conteúdo através do mesmo dialog de criação, com auto-save para uma experiência fluida.

---

# 4. User Value
- Edição inline sem navegar para outra página
- Interface familiar (mesmo dialog de criação)
- Auto-save para edição contínua
- Feedback visual de sucesso/erro
- Atualização em tempo real na lista

---

# 5. Scope

### Included
- Edição de título
- Edição de conteúdo
- Auto-save com debounce de 1.5s
- Validação de formulário
- Feedback de erro via toast
- Reutilização do EventDialog de criação

### Excluded
- Edição de data do evento
- Edição de status
- Página dedicada de edição
- Bulk edit

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

EventDialog (reused from create)
├── TitleInput
├── ContentTextarea
├── CloseButton
└── SaveIndicator (auto-save status)

Responsabilidades:

**EventDialog (Create Mode)**
- Abre vazio para criação
- Modal de criação de evento

**EventDialog (Update Mode)**
- Abre com dados pré-preenchidos
- Determinado por `selectedEventId !== null`
- State: título e conteúdo controlado

---

# 8. UI Placement

### Localização do dialog
Central da tela como modal overlay.

### Trigger
EventCard → clique no card abre o dialog em modo edição.

### Estados visuais
- Idle: dados do evento visíveis
- Editing: campos editáveis
- Saving: indicador de auto-save
- Success: toast de confirmação

---

# 9. Components (shadcn)

Obrigatórios:
- Dialog
- DialogContent
- DialogHeader
- DialogTitle
- DialogDescription
- Input
- Textarea
- Button
- Sonner toast
- Label
- Form (via react-hook-form)

---

# 10. Interaction Flow

## Update Event

1. User clica em um EventCard
2. EventDialog abre em modo edição com dados pré-preenchidos
3. Usuário edita título e/ou conteúdo
4. Sistema faz auto-save após 1.5s de inatividade (debounce)
5. API call: PATCH `/api/events/:id`
6. Toast de sucesso ou erro
7. Evento atualizado aparece na lista (invalidate query)
8. User fecha dialog com Close ou clique fora

### Campos editáveis
- Title (required, max 200 chars)
- Content (optional, no limit)

---

# 11. Server State Strategy

Library: TanStack Query

### Data Flow
```
User edits field
    ↓
Debounce 1.5s
    ↓
API call: eventsPartialUpdate(id, { title?, content? })
    ↓
On success: invalidateQueries(["events"])
    ↓
UI atualiza automaticamente
```

### State local
- `selectedEventId: string | null` - ID do evento sendo editado
- `title: string` - título atual do form
- `content: string` - conteúdo atual do form
- `open: boolean` - visibilidade do dialog

---

# 12. UI States

### Idle (dialog fechado)
- Dialog oculto

### Loading (dialog aberto)
- Campos preenchidos com dados do evento
- Campos editáveis

### Saving (durante auto-save)
- Input desabilitado ou indicador de "Salvando..."
- Sem blocking de interação

### Success
Toast:
"Evento atualizado"

### Error
Toast destructivo:
"Falha ao atualizar evento"
- Dialog permanece aberto
- Campos mantêm valores inválidos/erro

---

# 13. Micro-interactions

Ao salvar com sucesso:
- Toast suave de confirmação
- Lista de eventos atualiza automaticamente

Ao falhar:
- Toast de erro
- Dialog permanece aberto
- Dados não são revertidos

Transição de dialog:
- Fade in/out (150ms)

---

# 14. Accessibility

- Campos com labels adequados
- aria-label no botão de fechar
- Focus trap no Dialog
- Toast anunciado para screen readers
- keyboard navigation para fechar (Escape)

---

# 15. API Integration

### Update Event
PATCH `/api/events/:id`

```typescript
api.events.eventsPartialUpdate(eventId, {
  title?: string,
  content?: string
})
```

Partial update - campos opcionais.

---

# 16. Data Model

### Event Entity
```typescript
interface Event {
  id: string
  title: string
  content: string
  created_at: string
}
```

### API Request
```typescript
interface UpdateEventRequest {
  title?: string
  content?: string
}
```

### API Response
```typescript
interface EventResponse {
  id: string
  title: string
  content: string
}
```

---

# 17. Acceptance Criteria

- [ ] Clicar em card abre dialog com dados preenchidos
- [ ] Título é editável
- [ ] Conteúdo é editável
- [ ] Auto-save funciona após 1.5s de debounce
- [ ] Dialog fecha após Close
- [ ] Evento atualizado aparece na lista automaticamente
- [ ] Erro de API é exibido via toast
- [ ] Validação de título obrigatório
- [ ] Reutiliza mesmo EventDialog de criação

---

# 18. Edge Cases

- **[x] Título vazio após edição**: Manter dialog aberto, mostrar erro de validação
- **[x] API falha**: Exibir toast de erro, não fechar dialog, manter dados
- **[x] Editando evento de outro usuário**: Bloqueado pela API (403 Forbidden)
- **[x] Conteúdo muito longo**: Suportar texto longo (sem limit)
- **[x] Clique em Close durante save**: Aguardar conclusão ou cancelar
- **[x] Múltiplas edições rápidas**: Debounce previne múltiplas chamadas

---

# 19. Future Enhancements

- Edição de data do evento
- Edição de status
- Histórico de alterações
- Bulk edit
- Diff visual antes de salvar