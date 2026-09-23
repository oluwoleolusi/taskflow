import { Check } from 'lucide-react'

interface Props {
  checked: boolean
  onChange: () => void
  label: string
}

export default function TaskCheckbox({ checked, onChange, label }: Props) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={checked ? `Mark "${label}" as not done` : `Mark "${label}" as done`}
      onClick={(e) => {
        e.stopPropagation()
        onChange()
      }}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ease-app ${
        checked
          ? 'border-accent bg-accent text-white'
          : 'border-border bg-surface text-transparent hover:border-accent'
      }`}
    >
      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
    </button>
  )
}
