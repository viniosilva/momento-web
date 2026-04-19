import type { AnyFieldApi } from '@tanstack/react-form'

export function FieldError({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-500 block">
          {field.state.meta.errors.join(',')}
        </em>
      ) : null}
      {field.state.meta.isValidating ? '...' : null}
    </>
  )
}