import { createFileRoute } from "@tanstack/react-router"
import { App } from "@/features/home/pages/Home"

export const Route = createFileRoute("/")({ component: App })
