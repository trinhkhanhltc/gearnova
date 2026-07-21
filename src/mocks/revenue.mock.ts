import type { RevenueOverview } from '../types/revenue.types'
import { mockRevenueByMonth } from './dashboard.mock'

// TODO: thay bằng gọi API thật khi backend sẵn sàng
export const mockRevenueOverview: RevenueOverview = {
  revenueThisMonth: '₫128.500.000',
  estimatedProfit: '₫38.200.000',
  averageOrderValue: '₫1.620.000',
  revenueByMonth: mockRevenueByMonth,
  revenueByCategory: [
    { category: 'Điện thoại', amount: 48200000 },
    { category: 'Laptop', amount: 34700000 },
    { category: 'Phụ kiện', amount: 25600000 },
    { category: 'Thiết bị âm thanh', amount: 19900000 },
  ],
}
