import React from "react"
import { Eye, EyeOff } from "lucide-react"
import type { AnyFieldApi } from '@tanstack/react-form'
import { FieldError } from "./field-error"

interface PasswordInputProps {
  field: AnyFieldApi
}

export function PasswordInput({ field }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <>
      <label htmlFor={field.name}>Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className={`mt-1 w-full px-3 py-2 border border-border focus:outline-chart-1 pr-10 ${field.state.meta.isValid && 'mb-4'}`}
          id={field.name}
          name={field.name}
          value={field.state.value as string}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
        <span
          className="absolute right-4 top-7 -translate-y-1/2 cursor-pointer text-[var(--ring)]"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </span>
      </div>
      <FieldError field={field} />
    </>
  )
}