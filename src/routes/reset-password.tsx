import { createFileRoute } from "@tanstack/react-router"
import { ResetPassword } from "@/features/auth/pages/ResetPassword"

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search) => {
    return {
      token: (search.token as string) || '',
    }
  },
  component: ResetPassword,
})
