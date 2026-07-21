import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { RevenuePoint } from '../../types/dashboard.types'

export interface RevenueAreaChartProps {
  data: RevenuePoint[]
  height?: number
}

/**
 * Biểu đồ "Doanh thu theo tháng" dùng chung cho Tổng quan và Doanh thu.
 * Dùng recharts theo xác nhận của người dùng.
 */
export function RevenueAreaChart({ data, height = 260 }: RevenueAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
        <Tooltip
          formatter={(value) => [`${value}tr`, 'Doanh thu']}
          contentStyle={{ borderRadius: 12, borderColor: '#e5e5e5', fontSize: 12 }}
        />
        <Area type="linear" dataKey="value" stroke="#2563eb" strokeWidth={2.5} fill="url(#revenueFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
