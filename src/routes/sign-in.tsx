import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import { SignIn } from "@/features/auth/pages/SignIn"

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
  validateSearch: z.object({
    token: z.string().optional(),
  }),
})
