import type { ReactNode } from 'react'

export interface CheckboxFieldProps {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}

export function CheckboxField({ id, checked, onChange, children }: CheckboxFieldProps) {
  return (
    <label htmlFor={id} className="flex items-start gap-2 text-sm text-neutral-600">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 scheme-light rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
      />
      <span>{children}</span>
    </label>
  )
}
