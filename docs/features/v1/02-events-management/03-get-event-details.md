---
issue: 03
feature: Events Management
group: Get Event Details
bootstrap: 00-initial-setup.md
---

### Status: PENDING

# Feature: Get Event Details

---

# 1. Feature Name
Detalhes do Evento (Event Details View)

---

# 2. Context
Usuários precisam visualizar detalhes completos de um evento específico via URL dedicada, incluindo informações, fotos e ações do owner.

---

# 3. Goal
Criar página dedicada `/momentos/:id` que exiba todos os detalhes de um evento específico com ações do owner quando aplicável.

---

# 4. User Value
- Visualização completa do evento
- Navegação dedicada via URL
- Acesso a fotos e participantes
- Ações rápidas do owner (editar, arquivar, deletar)

---

# 5. Scope

### Included
- Página dedicada `/momentos/:id`
- Exibição de título completo
- Exibição de conteúdo completo
- Data do evento
- Status do evento
- Ações do owner (editar, arquivar, deletar)
- Links para fotos do evento
- Contador de fotos

### Excluded
- Lista de participantes
- Convite de novos participantes
- Upload de fotos
- Comentários

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
EventDetailPage
├── EventDetailHeader
│ ├── BackButton
│ ├── Title
│ └── StatusBadge
├── EventDetailCard
│ ├── ContentSection
│ ├── MetadataSection
│ └── PhotoGrid
└── EventDetailActions (owner only)
    ├── EditButton
    ├── ArchiveButton
    └── DeleteButton

Responsabilidades:

**EventDetailPage**
- Carregar dados do evento
- Exibir loading state
- Tratar erros (404, 403, 401)

**EventDetailHeader**
- Navegação back
- Título do evento
- Badge de status

**EventDetailCard**
- Informações completas
- Seção de fotos

**EventDetailActions**
- Ações disponíveis para owner
- Link para edit, archive, delete

---

# 8. UI Placement

### Localização dos elementos
- Header → topo da página com navegação back
- Card principal → centro da página
- Ações do owner → canto superior direito do card ou header

### Icons (lucide)
- Back → `ArrowLeft`
- Edit → `Pencil`
- Archive → `Archive`
- Delete → `Trash2`

### Ações para owner
- Edit (link para página de edição)
- Archive (link para ação)
- Delete (ação com confirmação)

### Visitante (não-owner)
- Visualização completa sem ações

---

# 9. Components (shadcn)

Obrigatórios:
- Card
- Button (variant: ghost + destructive)
- Badge
- Spinner → Loader2 (lucide)
- Sonner toast

---

# 10. Interaction Flow

## Acesso à página

1. User acessa `/momentos/:id`
2. Exibir loading state
3. Fetch event details via API
4. Se sucesso → exibir detalhes
5. Se 404 → exibir página não encontrada
6. Se 403 → exibir acesso negado
7. Se 401 → redirecionar para login

## Ações do owner

### Editar
1. Click em Edit
2. Navegar para `/momentos/:id/editar`

### Arquivar
1. Click em Archive
2. Navegar para archive flow (ver 05-archive-event.md)

### Deletar
1. Click em Delete
2. Abrir AlertDialog de confirmação
3. Confirmar → executar delete
4. Redirecionar para lista

---

# 11. Server State Strategy

Library: TanStack Query

## Query Hook
useEventDetailQuery(id)

### Config
- staleTime: 5 minutes
- retry: 1

### onSuccess
- Armazenar dados em cache

### onError
- Toast erro
- Redirecionar se 404

---

# 12. UI States

### Loading
- Spinner central
- Skeleton para conteúdo

### Success
- Card com detalhes completos
- Ações visíveis para owner

### Error 404
- Página "Evento não encontrado"
- Botão voltar para lista

### Error 403
- Card com detalhes
- Mensagem "Você não tem acesso"
- Ações ocultas

### Error 401
- Redirecionar para `/login`

### Disabled
Owner verification via query data

---

# 13. Micro-interactions

Ao carregar detalhes:

Page transition:
- Fade in 200ms

Content:
- Stagger animation para seções
- 50ms delay entre items

---

# 14. Accessibility

- Back button com aria-label: "Voltar para lista de eventos"
- Status badge com aria-label: "Status: {status}"
- Edit button com aria-label: "Editar evento"
- Delete button com aria-label: "Deletar evento"
- Toast anunciado para screen readers

---

# 15. API Integration

### Get Event Details
GET `/api/events/:id`
api.events.eventsDetail(id)

### Response
```
interface EventResponse {
  id: string
  owner_id: string
  title: string
  content: string
  status: 'upcoming' | 'past' | 'archived'
  created_at: string
  updated_at: string
}
```

---

# 16. Data Model

type EventStatus = 'upcoming' | 'past' | 'archived'

Response:
```
interface EventResponse {
  id: string
  owner_id: string
  title: string
  content: string
  status: EventStatus
  created_at: string
  updated_at: string
}
```

---

# 17. Acceptance Criteria

- Página `/momentos/:id` existe e carrega
- Detalhes completos do evento são exibidos
- Título é exibido no header
- Conteúdo completo é mostrado
- Data de criação é exibida
- Status é exibido com badge
- Ações do owner são exibidas quando aplicável
- Loading state durante carregamento
- Erro 404 se evento não existe
- Erro 403 se não é owner (ações ocultas)
- Redirecionamento 401 para login

---

# 18. Edge Cases

- Evento não existe → 404 com página dedicada
- Usuário não é owner → visualização sem ações
- Usuário não autenticado → redirect para login
- Evento arquivado → badge "Arquivado" visível
- Título muito longo → truncate com ellipsis
- Conteúdo muito longo → scroll ou expand
- Clique duplo → prevenido via loading state

---

# 19. Future Enhancements

- Lista de participantes
- Convite de novos participantes
- Upload de fotos na página de detalhes
- Comentários no evento
- Contador de visualizações