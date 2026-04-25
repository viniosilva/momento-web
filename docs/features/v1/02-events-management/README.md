# Events Management — Feature Specs

Frontend feature specifications for the Events Management domain, translated from API specs in `momento-api/docs/features/v1/02-events-management/`.

---

## Overview

| # | Feature | Status | Notes |
|---|--------|--------|-------|
| 00 | Initial Setup | **DONE** | Bootstrap completo existe |
| 01 | Create Event | **DONE** | Integrado no /momentos via EventDialog |
| 02 | List Events | **DONE** | Main /momentos page com grid de cards |
| 03 | Get Event Details | **PENDING** | Requer nova página dedicada `/momentos/:id` |
| 04 | Update Event | **DONE** | Edit dialog in-place via EventDialog |
| 05 | Archive Event | **DONE** | API existe, UI buttons em cards |
| 06 | Delete Event | **DONE** | API existe, UI confirmation |

---

## Current Implementation

### Existing Components

| Component | Path | Status |
|-----------|------|--------|
| Route `/momentos` | `src/routes/momentos.tsx` | ✅ EXISTS |
| API Events | `src/api/Events.ts` | ✅ EXISTS |
| EventDialog | `src/components/ui/event-dialog.tsx` | ✅ EXISTS |
| EventCard | `src/components/ui/event-card.tsx` | ✅ EXISTS |
| Event Detail Page | — | ❌ NOT EXISTS |

### API Endpoints

| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/api/events` | ✅ Implemented |
| POST | `/api/events` | ✅ Implemented |
| GET | `/api/events/:id` | ✅ Implemented |
| PATCH | `/api/events/:id` | ✅ Implemented |
| PATCH | `/api/events/:id/archive` | ✅ Implemented |
| PATCH | `/api/events/:id/restore` | ✅ Implemented |
| DELETE | `/api/events/:id` | ✅ Implemented |

---

## Status Legend

- **DONE**: Feature implementada no frontend
- **PENDING**: Requer implementação nova

---

## Feature Specs

### 00-initial-setup.md
> Bootstrap/setup para todas as issues

**Status**: DONE

Dependencies: Authentication, API Client, UI Components

---

### 01-create-event.md
> Criar novos eventos via dialog inline

**Status**: DONE

Implementação: `/momentos` page + `EventDialog`

- Input "Create an event..." abre dialog
- Auto-save após 1.5s de inatividade
- API: `POST /api/events`

---

### 02-list-events.md
> Listar todos os eventos do usuário

**Status**: DONE

Implementação: `/momentos` page

- Grid de EventCards
- Loading state
- Empty state com icon
- Error state

---

### 03-get-event-details.md
> Página dedicada de detalhes do evento

**Status**: PENDING

 requer nova rota `/momentos/:id`

- Componente de página nova
- API: `GET /api/events/:id`
- Ações do owner (edit, archive, delete)

---

### 04-update-event.md
> Editar evento existente

**Status**: DONE

Implementação: Same EventDialog usada para create

- Modal editing mode via `selectedEventId`
- Auto-save com debounce
- API: `PATCH /api/events/:id`

---

### 05-archive-event.md
> Arquivar/desarquivar eventos

**Status**: DONE (API) / PENDING (UI buttons)

Implementação: API ready, botão nos cards pendente

- API: Archive `PATCH /api/events/:id/archive`
- API: Restore `PATCH /api/events/:id/restore`
- UI: Botões nos EventCards

---

### 06-delete-event.md
> Deletar eventos permanentemente

**Status**: DONE (API) / PENDING (UI confirmation)

Implementação: API ready, confirmation pendente

- API: `DELETE /api/events/:id`
- UI: Confirm dialog + toast

---

## Implementation Roadmap

### Phase 1 — Already Done
- [x] Route /momentos com list/create
- [x] API Events full CRUD
- [x] EventDialog component

### Phase 2 — Next
- [ ] Page `/momentos/:id` para detalhes
- [ ] Botões de archive/unarchive nos cards
- [ ] Dialog de confirmação para delete

---

## Related Documents

### API Specs
- `momento-api/docs/features/v1/02-events-management/`

### Frontend Specs
- `momento-web/docs/feature-spec.md` (template)