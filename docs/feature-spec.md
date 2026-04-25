---
issue: XX
feature: Feature Name
group: Feature Group
bootstrap: 00-initial-setup.md
---

### Status: PENDING

# Feature: [Feature Name]

---

# 1. Feature Name
Nome claro e descritivo da funcionalidade.

---

# 2. Context
Qual problema existe hoje e por que essa feature precisa existir.
Descrever o cenário atual e a dor do usuário.

---

# 3. Goal
Qual valor essa feature entrega para o usuário e para o produto.
Objetivo principal a ser alcançado.

---

# 4. User Value
Impacto direto no usuário final.
Benefícios tangíveis que o usuário percebe.

- Benefício 1
- Benefício 2
- Benefício 3

---

# 5. Scope

### Included
O que faz parte desta feature nesta versão.

- Funcionalidade 1
- Funcionalidade 2

### Excluded
O que explicitamente NÃO faz parte (evita escopo inflado).

- Funcionalidade excluída 1
- Funcionalidade excluída 2

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
Estrutura de componentes e suas responsabilidades.

ComponentePai
├── ComponenteFilho1
└── ComponenteFilho2

Responsabilidades:

**ComponentePai**
- Responsabilidade principal

**ComponenteFilho1**
- Responsabilidade do filho 1

**ComponenteFilho2**
- Responsabilidade do filho 2

---

# 8. UI Placement

### Localização
Descrever onde o componente/funcionalidade aparece na UI.

### Ícones (lucide)
- Ícone de ação → `IconName`

---

# 9. Components (shadcn)

Obrigatórios:
- Componente1
- Componente2

---

# 10. Interaction Flow

## Fluxo Principal

1. Usuário acessa a tela
2. Ação do usuário
3. Resposta do sistema
4. Feedback visual

## Fluxo Alternativo (se aplicável)

1. Passo 1
2. Passo 2

---

# 11. Server State Strategy

Library: TanStack Query

## Mutation Hook
useFeatureMutation()

### Optimistic Update

onMutate:
- Atualizar cache local

onError:
- Rollback cache
- Toast erro

onSuccess:
- invalidateQueries

### Query Hook
useFeatureQuery()

---

# 12. UI States

### Idle
Estado inicial, pronto para interação.

### Loading
- Estado de carregamento
- Indicador visual

### Success
- Feedback de sucesso
- Toast ou animação

### Error
- Feedback de erro
- Toast destructive

### Disabled
- Estado desabilitado
- Como o usuario percebe

---

# 13. Micro-interactions

Animações e transições sutis.

Animação:
- De: estado inicial
- Para: estado final
- Duração: 200ms ease-in

---

# 14. Accessibility

- ARIA labels necessários
- Focus management
- Screen reader announcements
- Keyboard navigation

---

# 15. API Integration

### Ação Principal
METHOD `/api/endpoint`
api.module.endpoint(data)

### Ação Secundária (se aplicável)
METHOD `/api/endpoint`
api.module.endpoint(data)

---

# 16. Data Model

Definição de tipos e interfaces.

```typescript
type Status = 'pending' | 'active' | 'completed'

interface FeatureResponse {
  id: string
  name: string
  status: Status
}
```

---

# 17. Acceptance Criteria

Critérios para considerar a feature completa.

- Critério 1 verificado
- Critério 2 verificado
- Critério 3 verificado

---

# 18. Edge Cases

Casos de borda e tratamento de erros.

- Caso 1: descrição e handling
- Caso 2: descrição e handling
- Caso 3: descrição e handling

---

# 19. Future Enhancements

Funcionalidades que podem ser adicionadas no futuro.

- Enhancement 1
- Enhancement 2