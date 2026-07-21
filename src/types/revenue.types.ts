import type { RevenuePoint } from './dashboard.types'

export interface RevenueByCategory {
  category: string
  amount: number
}

export interface RevenueOverview {
  revenueThisMonth: string
  estimatedProfit: string
  averageOrderValue: string
  revenueByMonth: RevenuePoint[]
  revenueByCategory: RevenueByCategory[]
}

export interface ExportReportResponse {
  message: string
}
