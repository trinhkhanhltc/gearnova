import { Badge } from '../ui/Badge'
import type { DashboardStat } from '../../types/dashboard.types'

export function StatCard({ label, value, changeLabel, changeTone, note }: DashboardStat) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-neutral-900">{value}</p>
      {changeLabel && (
        <div className="mt-2 flex items-center gap-2">
          <Badge tone={changeTone === 'warning' ? 'yellow' : 'green'}>{changeLabel}</Badge>
        </div>
      )}
      {note && (
        <div className="mt-2 flex items-center gap-2">
          <Badge tone="yellow">Cần xử lý</Badge>
          <span className="text-xs text-neutral-500">{note}</span>
        </div>
      )}
    </div>
  )
}
