import { createFileRoute } from "@tanstack/react-router"
import { Momentos } from "@/features/event/pages/Momentos"

export const Route = createFileRoute("/momentos")({ component: Momentos })
