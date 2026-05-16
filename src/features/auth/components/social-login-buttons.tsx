import { Button } from "@/components/ui/button"

export function SocialLoginButtons() {
  return (
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
  )
}