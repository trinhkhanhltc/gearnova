import type { DashboardOverview, RevenuePoint } from '../types/dashboard.types'
import { mockOrders } from './orders.mock'

// TODO: thay bằng gọi API thật khi backend sẵn sàng
export const mockRevenueByMonth: RevenuePoint[] = [
  { month: 'T1', value: 62 },
  { month: 'T2', value: 58 },
  { month: 'T3', value: 78 },
  { month: 'T4', value: 74 },
  { month: 'T5', value: 90 },
  { month: 'T6', value: 96 },
  { month: 'T7', value: 84 },
  { month: 'T8', value: 100 },
  { month: 'T9', value: 96 },
  { month: 'T10', value: 112 },
  { month: 'T11', value: 122 },
  { month: 'T12', value: 128.5 },
]

export const mockDashboardOverview: DashboardOverview = {
  stats: {
    revenue: { label: 'Doanh thu', value: '₫128.500.000', changeLabel: '+12.4% so với kỳ trước', changeTone: 'positive' },
    newOrders: { label: 'Đơn hàng mới', value: '348', changeLabel: '+8.1% so với kỳ trước', changeTone: 'positive' },
    newCustomers: { label: 'Khách hàng mới', value: '126', changeLabel: '+4.6% so với kỳ trước', changeTone: 'positive' },
    lowStock: { label: 'Tồn kho thấp', value: '7 sản phẩm', note: 'dưới ngưỡng an toàn', changeTone: 'warning' },
  },
  revenueByMonth: mockRevenueByMonth,
  categoryShare: [
    { category: 'Điện thoại', value: 40, color: '#2563eb' },
    { category: 'Laptop', value: 28, color: '#16a34a' },
    { category: 'Phụ kiện', value: 20, color: '#f59e0b' },
    { category: 'Thiết bị âm thanh', value: 12, color: '#9333ea' },
  ],
  recentOrders: mockOrders,
}
