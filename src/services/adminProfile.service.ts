import { mockAdminProfile } from '../mocks/staff.mock'
import type { AdminProfile, UpdateAdminProfilePayload } from '../types/staff.types'

const MOCK_DELAY_MS = 500

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

let currentAdminProfile: AdminProfile = { ...mockAdminProfile }

/**
 * Hồ sơ cá nhân của admin đang đăng nhập (trang "Hồ sơ cá nhân",
 * `/admin/profile`) — tách riêng khỏi `staff.service.ts` (quản lý DANH
 * SÁCH nhân viên khác) để rõ ràng đây là dữ liệu của chính người đang dùng.
 */
export async function getMyAdminProfile(): Promise<AdminProfile> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<AdminProfile>('/admin/me/profile')

  return delay(currentAdminProfile)
}

export async function updateMyAdminProfile(payload: UpdateAdminProfilePayload): Promise<AdminProfile> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.put<AdminProfile>('/admin/me/profile', payload)

  if (!payload.fullName.trim() || !payload.email.trim() || !payload.phone.trim()) {
    throw new Error('Vui lòng nhập đầy đủ họ tên, email và số điện thoại.')
  }

  currentAdminProfile = { ...currentAdminProfile, ...payload }
  return delay(currentAdminProfile)
}
