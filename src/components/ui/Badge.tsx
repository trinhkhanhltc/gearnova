import type { ReactNode } from 'react'

export type BadgeTone = 'green' | 'yellow' | 'red' | 'gray' | 'blue'

const toneStyles: Record<BadgeTone, string> = {
  green: 'bg-green-50 text-green-700',
  yellow: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-600',
  gray: 'bg-neutral-100 text-neutral-600',
  blue: 'bg-blue-50 text-blue-700',
}

export interface BadgeProps {
  tone: BadgeTone
  children: ReactNode
}

export function Badge({ tone, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[tone]}`}>
      {children}
    </span>
  )
}
