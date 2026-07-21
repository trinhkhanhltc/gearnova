import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import type { CategoryShare } from '../../types/dashboard.types'

export interface CategoryDonutChartProps {
  data: CategoryShare[]
}

export function CategoryDonutChart({ data }: CategoryDonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="category" innerRadius={65} outerRadius={95} paddingAngle={2}>
          {data.map((entry) => (
            <Cell key={entry.category} fill={entry.color} stroke="none" />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
