import { mockPermissionMatrix, mockStaff } from '../mocks/staff.mock'
import type { InviteEmployeePayload, PermissionRow, Staff } from '../types/staff.types'

const MOCK_DELAY_MS = 500
let staffList = [...mockStaff]
let staffSeq = staffList.length

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

export async function getStaffList(): Promise<Staff[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<Staff[]>('/admin/staff')

  return delay(staffList)
}

export async function getPermissionMatrix(): Promise<PermissionRow[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<PermissionRow[]>('/admin/staff/permission-matrix')

  return delay(mockPermissionMatrix)
}

export async function inviteEmployee(payload: InviteEmployeePayload): Promise<Staff> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.post<Staff>('/admin/staff/invite', payload)

  if (!payload.email) {
    throw new Error('Vui lòng nhập email nhân viên.')
  }

  staffSeq += 1
  const newStaff: Staff = {
    id: `nv_${staffSeq}`,
    name: payload.email.split('@')[0],
    email: payload.email,
    role: payload.role,
    status: 'hoat-dong',
    joinedAt: new Date().toLocaleDateString('vi-VN'),
  }
  staffList = [...staffList, newStaff]

  return delay(newStaff)
}

export async function toggleStaffStatus(id: string): Promise<Staff> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.put<Staff>(`/admin/staff/${id}/toggle-status`)

  const staff = staffList.find((item) => item.id === id)
  if (!staff) {
    throw new Error('Không tìm thấy nhân viên.')
  }
  staff.status = staff.status === 'hoat-dong' ? 'tam-khoa' : 'hoat-dong'
  staffList = [...staffList]

  return delay(staff)
}
