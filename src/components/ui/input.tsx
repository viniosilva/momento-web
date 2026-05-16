import type { AnyFieldApi } from '@tanstack/react-form'
import { FieldError } from './field-error'

interface InputProps {
    field: AnyFieldApi
    label: string
    placeholder?: string
    type?: React.HTMLInputTypeAttribute
}

export function Input({ field, label, placeholder, type }: InputProps) {
    return (
        <>
            <label htmlFor={field.name}>{label}</label>
            <input
                type={type || "text"}
                placeholder={placeholder || ""}
                className={`mt-1 w-full px-3 py-2 border border-border focus:outline-chart-1 ${field.state.meta?.isValid && 'mb-4'}`}
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