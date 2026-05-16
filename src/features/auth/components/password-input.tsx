import React from "react"
import { Eye, EyeOff } from "lucide-react"
import type { AnyFieldApi } from '@tanstack/react-form'
import { Input } from "@/components/ui/input"

interface PasswordInputProps {
  field: AnyFieldApi
  label?: string
}

export function PasswordInput({ field, label }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative">
      <Input
        field={field}
        label={label || "Password"}
        type={showPassword ? "text" : "password"}
        placeholder="Password"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-3/5 -translate-y-1/2 text-[var(--ring)] cursor-pointer"
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </button>
    </div>
  )
}