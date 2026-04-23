import { Search } from "lucide-react"

interface SearchInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}

export function SearchInput({ value, onChange, placeholder = "Search..." }: SearchInputProps) {
  const isControlled = value !== undefined && onChange !== undefined

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ring)]" />
      <input
        type="text"
        {...(isControlled ? { value } : { defaultValue: value })}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 pl-10 border border-border focus:outline-chart-1"
      />
    </div>
  )
}