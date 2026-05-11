import { createFileRoute } from "@tanstack/react-router"
import { RecoverPassword } from "@/features/auth/pages/RecoverPassword"

export const Route = createFileRoute("/recover-password")({ component: RecoverPassword })
