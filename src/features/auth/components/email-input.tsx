import { Input } from '@/components/ui/input'
import type { AnyFieldApi } from '@tanstack/react-form'

interface EmailInputProps {
  field: AnyFieldApi
}

export function EmailInput({ field }: EmailInputProps) {
  return (
    <Input label="Email" placeholder="Email address" field={field} />
  )
}