export type StaffRole = 'quan-ly' | 'nv-ban-hang' | 'nv-kho'
export type StaffStatus = 'hoat-dong' | 'tam-khoa'

export interface Staff {
  id: string
  name: string
  email: string
  role: StaffRole
  status: StaffStatus
  joinedAt: string
}

export interface InviteEmployeePayload {
  email: string
  role: StaffRole
}

export interface PermissionRow {
  permission: string
  quanLy: boolean
  nvBanHang: boolean
  nvKho: boolean
}

// ---------------------------------------------------------------------------
// Hồ sơ cá nhân của admin đang đăng nhập — khác với `Staff` (dòng dữ liệu
// trong bảng "Người dùng & phân quyền" quản lý NHÂN VIÊN KHÁC) và khác với
// hồ sơ CỬA HÀNG ở tab "Hồ sơ cửa hàng" trong Cài đặt.

export interface AdminProfile {
  fullName: string
  email: string
  phone: string
  role: string
}

export interface UpdateAdminProfilePayload {
  fullName: string
  email: string
  phone: string
}
