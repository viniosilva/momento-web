---
issue: 01
feature: Password Recovery
group: Account Recovery
bootstrap: 
---

### Status: PENDING

# Feature: Password Recovery

---

# 1. Feature Name
Recuperação de Senha por E-mail

---

# 2. Context
Usuários precisam recuperar o acesso à conta quando esquecem a senha, através de um link enviado por e-mail.

---

# 3. Goal
Permitir que usuários solicitem a recuperação de senha com feedback imediato e instruções claras sobre os próximos passos.

---

# 4. User Value
- Recuperação de acesso em caso de esquecimento
- Fluxo simples e direto
- Feedback visual imediato
- Instruções claras de próximos passos

---

# 5. Scope

### Included
- Formulário de solicitação de recuperação
- Validação de e-mail
- Feedback de sucesso/erro
- Mensagem com instruções pós-envio

### Excluded
- Redefinição de senha (feature futura)
- Login automático
- Autenticação por redes sociais
- Verificação em duas etapas

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
PasswordRecoveryForm
├── EmailInput
├── SubmitButton
├── SuccessMessage
└── BackToLoginLink

Responsabilidades:

**PasswordRecoveryForm**
- Gerenciar estado do formulário
- Validar e-mail
- Executar mutation

**EmailInput**
- Input controlado
- Validação inline
- Estado de erro

**SubmitButton**
- Loading state durante submission
- Disabled quando inválido

**SuccessMessage**
- Exibir após envio bem-sucedido
- Instruções para o usuário

**BackToLoginLink**
- Link para página de login

---

# 8. UI Placement

### Localização
Página de login → link "Forgot password?" abaixo do formulário de login.

### Flow
1. User clica "Forgot password?"
2. Navega para /forgot-password
3. Vê formulário de recuperação
4. Recebe feedback de sucesso
5. Volta para login

### Icons (lucide)
- E-mail → `Mail`
- Loading → `Loader2`
- Voltar → `ArrowLeft`

---

# 9. Components (shadcn)

Obrigatórios:
- Input (email type)
- Button (variant: default + outline + ghost)
- Label
- Form (react-hook-form + zod)
- Sonner toast
- Alert (success message)

---

# 10. Interaction Flow

## Request Password Recovery

1. User acessa /forgot-password
2. Preenche e-mail no campo
3. Clica "Send recovery link"
4. Validação executa (email válido?)
5. Se inválido → erro inline + focus no campo
6. Se válido → mutation executa
7. Button mostra loading
8. Em sucesso:
   - Form é substituído por SuccessMessage
   - Toast sucesso (opcional)
9. Em erro:
   - Toast destructive
   - Button volta a enabled

## Success State

User vê mensagem:
"Thanks! If an account exists with this email, we'll send password recovery instructions."

---

# 11. Server State Strategy

Library: TanStack Query

## Mutation Hook
usePasswordRecoveryMutation()

### Behavior

onMutate:
- Button disabled
- Loading state ativo

onError:
- Toast erro
- Form permanece visível
- Button reabilita

onSuccess:
- Form substituído por SuccessMessage
- Não invalidar queries (não há cache para invalidar)

---

# 12. UI States

### Form State (default)
- Campo e-mail vazio
- Button disabled (inválido)

### Validating
- E-mail digitado
- Validação inline em tempo real

### Submitting
- Button com loading spinner
- Campo disabled

### Success
- Form escondido
- SuccessMessage visível
- Link para login

### Error
- Toast destructive visível
- Form visível
- Button enabled

---

# 13. Micro-interactions

Ao enviar com sucesso:

SuccessMessage animation:
- fade in
- scale 0.95 → 1

Duration: 300ms ease-out

---

# 14. Accessibility

- Input com label acessível
- aria-describedby para mensagens de erro
- Focus gerenciado no submit
- Loading state announced (aria-busy)
- Link "Back to login" com aria-label

---

# 15. API Integration

### Request Recovery
POST `/api/auth/forgot-password`
Request:
```
{
  "email": string
}
```

Response (success):
```
{
  "message": "If an account exists with this email, we'll send password recovery instructions."
}
```

**Nota**: Endpoint ainda não existe. UI atual com console.log placeholder.

---

# 16. Data Model

```
interface PasswordRecoveryRequest {
  email: string
}

interface PasswordRecoveryResponse {
  message: string
}
```

Validation (zod):
```
z.object({
  email: z.string().email()
})
```

---

# 17. Acceptance Criteria

- User acessa página via link "Forgot password?"
- Campo e-mail com validação
- Button disabled quando e-mail inválido
- Loading visível durante submission
- Mensagem de sucesso após envio
- Instruções claras sobre próximos passos
- Link para voltar ao login
- Toast erro em caso de falha

---

# 18. Edge Cases

- E-mail vazio → validação inline
- E-mail inválido → validação inline
- Clique duplo → prevenido via disabled state
- Timeout → toast erro
- Servidor offline → toast erro

---

# 19. Future Enhancements

- Redefinição de senha (reset password flow completo)
- Tempo limite no link de recuperação
- Contagem de tentativas de recuperação
- Notificação ao usuário se e-mail não existe (segurança vs UX tradeoff)
- Recaptcha para prevenir spam