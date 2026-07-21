import { mockDashboardOverview } from '../mocks/dashboard.mock'
import type { DashboardOverview } from '../types/dashboard.types'

const MOCK_DELAY_MS = 500

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<DashboardOverview>('/admin/dashboard')

  return delay(mockDashboardOverview)
}
