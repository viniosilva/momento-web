import type { AnyFieldApi } from '@tanstack/react-form'

interface RememberMeCheckboxProps {
  field: AnyFieldApi
}

export function RememberMeCheckbox({ field }: RememberMeCheckboxProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        placeholder="Remember me"
        className="border border-border focus:outline-chart-1"
        id={field.name}
        name={field.name}
        checked={field.state.value as boolean}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.checked)}
      />
      <span>Remember me</span>
    </div>
  )
}