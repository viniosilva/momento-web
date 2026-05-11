import { createFileRoute } from "@tanstack/react-router"
import { Momentos } from "@/features/momentos/pages/Momentos"

export const Route = createFileRoute("/momentos")({ component: Momentos })
