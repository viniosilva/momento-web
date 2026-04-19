import { createFileRoute } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <Header />
      <main className="flex-1 flex items-center justify-center max-w-md min-w-0 mx-auto flex-col gap-4 text-sm leading-loose">
        <span className="bg-chart-1 py-2 px-4 text-center">Fast, simple, easy to organize and share your moments</span>

        <h1 className="text-center flex flex-col text-4xl font-bold">
          <span>Organize your events.</span>
          <span className="text-primary">Share it.</span>
        </h1>

        <p className="text-center">
          Momento is a lightweight event management app that helps you capture moments,
          organize everything and share it with those who matter to you — all in one place.
        </p>
        <a href="/sign-in">
          <Button className="mt-2 p-6 text-lg cursor-pointer">Start for free <ArrowRight /></Button>
        </a>
      </main>
      <Footer />
    </div>
  )
}

export default App