import type { AnyFieldApi } from '@tanstack/react-form'
import { FieldError } from './field-error'

interface EmailInputProps {
  field: AnyFieldApi
}

export function EmailInput({ field }: EmailInputProps) {
  return (
    <>
      <label htmlFor={field.name}>Email</label>
      <input
        type="text"
        placeholder="Email address"
        className={`mt-1 w-full px-3 py-2 border border-border focus:outline-chart-1 ${field.state.meta.isValid && 'mb-4'}`}
        id={field.name}
        name={field.name}
        value={field.state.value as string}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldError field={field} />
    </>
  )
}