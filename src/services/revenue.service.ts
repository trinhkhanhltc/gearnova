import { mockRevenueOverview } from '../mocks/revenue.mock'
import type { ExportReportResponse, RevenueOverview } from '../types/revenue.types'

const MOCK_DELAY_MS = 500

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

export async function getRevenueOverview(): Promise<RevenueOverview> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<RevenueOverview>('/admin/revenue')

  return delay(mockRevenueOverview)
}

export async function exportRevenueReport(): Promise<ExportReportResponse> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng (trả về file thật, vd
  // link tải PDF/Excel). Hiện chưa rõ định dạng xuất nên mock chỉ trả thông
  // báo, theo xác nhận của người dùng.
  // return apiClient.post<ExportReportResponse>('/admin/revenue/export')

  return delay({ message: 'Đã tạo báo cáo.' })
}
