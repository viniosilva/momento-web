import React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"


export const Route = createFileRoute("/sign-in")({ component: App })

function App() {
  const [showPassword, setShowPassword] = React.useState(false)
  let eyeIcon = showPassword ? <Eye /> : <EyeOff />

  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <main className="flex-1 flex items-center justify-center w-full max-w-[580px] min-w-[320px] mx-auto flex-col gap-4 text-sm leading-loose">
        <h1 className="text-3xl font-semibold text-chart-3">
          <a href="/" className="cursor-default">Momento</a>
        </h1>

        <span>Sign in to continue</span>

        <form className="mt-4 flex flex-col gap-4 w-full">
          <div>
            <label className="block font-medium">Email</label>
            <input type="email" placeholder="Email address" className="mt-1 w-full px-3 py-2 border border-border focus:outline-chart-1" />
          </div>

          <div>
            <label className="block font-medium">Password</label>
            <div className="relative">
              <input type="password" placeholder="Password" className="mt-1 w-full px-3 py-2 border border-border focus:outline-chart-1" />
              <span className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {eyeIcon}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 border-border" />
              <span>Remember me</span>
            </label>
            <a href="/recover-password" className="text-chart-5 hover:underline">Forgot password?</a>
          </div>

          <Button className="mt-6 w-full font-semibold hover:bg-primary/80 cursor-pointer">Sign in</Button>
        </form>

        <div className="flex items-center gap-3 my-4 w-full">
          <hr className="flex-1 m-0 border-t border-border" />
          <span>or continue with</span>
          <hr className="flex-1 m-0 border-t border-border" />
        </div>

        <div className="flex items-center gap-4 w-full">
          <Button className="flex-1 bg-transparent border-border hover:border-chart-1 inline-flex items-center justify-center gap-2 py-2">
            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="h-5 w-5" alt="Facebook" />
            <span>Facebook</span>
          </Button>

          <Button className="flex-1 bg-transparent border-border hover:border-chart-1 inline-flex items-center justify-center gap-2 py-2">
            <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-5 w-5" alt="Google" />
            <span>Google</span>
          </Button>
        </div>

        <p className="mt-4">Don't have an account? <a href="/sign-up" className="text-chart-5 hover:underline">Sign up</a></p>
      </main>
    </div>
  )
}
