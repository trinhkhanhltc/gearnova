export interface FormMessageProps {
  variant: 'error' | 'success'
  children: string
}

export function FormMessage({ variant, children }: FormMessageProps) {
  const styles =
    variant === 'error'
      ? 'border-red-200 bg-red-50 text-red-600'
      : 'border-green-200 bg-green-50 text-green-700'

  return <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>{children}</div>
}
