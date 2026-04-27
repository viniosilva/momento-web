import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

interface AuthLayoutProps {
  subtitle?: string
  children: ReactNode
}

export function AuthLayout({ subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <main className="flex-1 flex items-center justify-center w-full max-w-[580px] min-w-[320px] mx-auto flex-col gap-4 text-sm leading-loose">
        <h1 className="text-3xl font-semibold text-chart-3">
          <Link to="/" className="cursor-default">Momento</Link>
        </h1>

        {subtitle && <span>{subtitle}</span>}

        {children}
      </main>
    </div>
  )
}