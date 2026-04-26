import { useAuth } from "@/hooks/use-auth"

function parseJwt(token: string): { UserID?: string } {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch {
    return {}
  }
}

export function useCurrentUserId(): string | null {
  const { token } = useAuth()

  if (!token) return null

  const decoded = parseJwt(token)
  return decoded.UserID ?? null
}