import type { Order } from './order.types'

export interface RevenuePoint {
  month: string
  value: number
}

export interface CategoryShare {
  category: string
  value: number
  color: string
}

export interface DashboardStat {
  label: string
  value: string
  changeLabel?: string
  changeTone?: 'positive' | 'warning'
  note?: string
}

export interface DashboardOverview {
  stats: {
    revenue: DashboardStat
    newOrders: DashboardStat
    newCustomers: DashboardStat
    lowStock: DashboardStat
  }
  revenueByMonth: RevenuePoint[]
  categoryShare: CategoryShare[]
  recentOrders: Order[]
}
