---
issue: 02
feature: Events Management
group: List Events
bootstrap: 00-initial-setup.md
---

### Status: DONE

# Feature: List Events

---

# 1. Feature Name
Listar Eventos (Event List Grid)

---

# 2. Context
Usuários precisam visualizar todos os seus eventos em uma grade organizada para encontrar momentos específicos rapidamente.

---

# 3. Goal
Exibir todos os eventos do usuário em uma grade de cards ordenados por data de criação, com suporte a loading, empty state e error state.

---

# 4. User Value
- Visualização rápida de todos os eventos
- Interface visual atraente com cards
- Feedback de carregamento durante fetching
- Estado vazio informativo quando não há eventos
- Estado de erro com retry opcional

---

# 5. Scope

### Included
- Grid de cards de eventos
- Ordenação por created_at (desc)
- Loading state com spinner
- Empty state com icon
- Error state com mensagem
- Suporte a filtros futuros (status: upcoming/past/archived)

### Excluded
- Busca por texto
- Ordenação customizada
- Paginação
- Categorias/tags
- Infinite scroll

---

# 6. Frontend Architecture & Stack

### Stack obrigatória
- React + TypeScript
- TailwindCSS
- shadcn/ui
- TanStack Query (futuro: migração de useState + useEffect)
- Lucide React
- Sonner (toast)

---

# 7. Component Architecture
momentos route
├── EventGrid (grid container)
│   └── EventCard[] (lista de eventos)
├── LoadingState (spinner durante fetch)
├── EmptyState (CalendarHeart icon)
└── ErrorState (mensagem + retry)

Responsabilidades:

**EventGrid**
- Layout em grid responsivo
- Renderizar lista de EventCards

**EventCard**
- Exibir informações do evento
- Link para edição do evento

**LoadingState**
- Spinner centralizado
- Mensagem "Loading events..."

**EmptyState**
- Icon CalendarHeart
- Mensagem "No events yet"

**ErrorState**
- Mensagem de erro
- Botão retry opcional

---

# 8. UI Placement

### Localização da lista
/momentos route → container principal → EventGrid.

### Icons (lucide)
- Loading → `Loader2` (animação spin)
- Empty → `CalendarHeart`
- Error → `AlertCircle`

---

# 9. Components (shadcn)

Obrigatórios:
- Card, CardHeader, CardTitle, CardContent
- Spinner → Loader2 (lucide)
- Sonner toast (para erros futuros)

---

# 10. Interaction Flow

## Acesso à lista

1. User acessa `/momentos`
2. Componente monta e executa query
3. Loading state exibido imediatamente
4. Dados chegam → EventCards renderizados em grid
5. User pode scrollar pelos cards

## Empty state

1. Query executa com sucesso
2. Response data.length === 0
3. EmptyState renderizado
4. Mensagem convidativa exibida

## Error state

1. Query falha
2. ErrorState renderizado
3. Mensagem de erro exibida
4. Opcional: botão retry

---

# 11. Server State Strategy

Library: TanStack Query (futuro)

### Current (useState + useEffect)
```typescript
const [events, setEvents] = useState<Event[]>([])
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

useEffect(() => {
  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const response = await api.events.eventsList({ ... })
      setEvents(response.data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  fetchEvents()
}, [])
```

### Migration Target (TanStack Query)
useEventsQuery()

```typescript
const { data, isLoading, error } = useEventsQuery()

// Com cache automático
// Loading states nativos
// Error handling nativo
// Refetch automático
```

---

# 12. UI States

### Loading
- Spinner centralizado
- Container com altura mínima
- Texto "Loading events..."

### Empty
- Icon CalendarHeart centralizado
- Texto "No events yet"
- CTA para criar primeiro evento (futuro)

### Error
- Icon AlertCircle
- Mensagem de erro descritiva
- Botão retry opcional

### Success
- Grid com EventCards
- Cards ordenados por created_at desc

---

# 13. Micro-interactions

Ao carregar eventos:

Loading:
- Spinner com animação contínua
- Container com skeleton pulse (futuro)

Empty:
- Icon com fade in suave
- 300ms ease-out

---

# 14. Accessibility

- Grid com role="list" ou grid semântico
- Cards com estrutura semântica (heading, paragraph)
- Loading state announced para screen readers
- Error state com aria-live
- Empty state com role="status"

---

# 15. API Integration

GET `/api/events`
api.events.eventsList({
  page?: number,
  page_size?: number,
  sort_by?: 'created_at' | 'updated_at',
  sort_order?: 'asc' | 'desc'
})

Response:
```typescript
{
  data: {
    data: Event[]
    total: number
    page: number
    page_size: number
  }
}
```

---

# 16. Data Model

```typescript
interface Event {
  id: string
  title: string
  content: string
  created_at: string
}
```

---

# 17. Acceptance Criteria

- Eventos carregados automaticamente ao acessar /momentos
- Loading spinner aparece durante fetch
- Empty state icon quando não há eventos
- Error state se API falhar
- Cards exibidos em grid responsivo
- Ordenação por created_at desc

---

# 18. Edge Cases

- Lista vazia → EmptyState
- Erro de API → ErrorState com retry
- Usuário não autenticado → redirect para login (roteador)
- Muitos eventos → grid suporta scroll
- Título longo → line-clamp no conteúdo

---

# 19. Future Enhancements

- Migração para TanStack Query (useEventsQuery)
- Skeleton loading state
- Busca por texto (search)
- Filtros por status (upcoming/past/archived)
- Paginação ou infinite scroll
- Ordenação customizada
- Bulk actions