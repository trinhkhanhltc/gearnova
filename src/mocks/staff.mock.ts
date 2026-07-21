import type { AdminProfile, PermissionRow, Staff } from '../types/staff.types'

// TODO: thay bằng gọi API thật khi backend sẵn sàng
export const mockStaff: Staff[] = [
  {
    id: 'nv_01',
    name: 'Nguyễn Văn A',
    email: 'a.nguyen@gearnova.vn',
    role: 'quan-ly',
    status: 'hoat-dong',
    joinedAt: '01/03/2024',
  },
  {
    id: 'nv_02',
    name: 'Phạm Thu Trang',
    email: 'trang.pham@gearnova.vn',
    role: 'nv-ban-hang',
    status: 'hoat-dong',
    joinedAt: '12/06/2024',
  },
  {
    id: 'nv_03',
    name: 'Lê Hoàng Nam',
    email: 'nam.le@gearnova.vn',
    role: 'nv-kho',
    status: 'hoat-dong',
    joinedAt: '22/09/2024',
  },
  {
    id: 'nv_04',
    name: 'Trần Bảo Ngọc',
    email: 'ngoc.tran@gearnova.vn',
    role: 'nv-ban-hang',
    status: 'tam-khoa',
    joinedAt: '04/01/2025',
  },
]

// Hồ sơ cá nhân của admin đang đăng nhập — dùng lại đúng tên/vai trò đã
// hardcode ở `AdminLayout.tsx` ("Nguyễn Văn A" / "Quản lý cửa hàng", trùng
// nhân viên `nv_01` ở trên) để nhất quán xuyên suốt khu vực admin.
export const mockAdminProfile: AdminProfile = {
  fullName: 'Nguyễn Văn A',
  email: 'a.nguyen@gearnova.vn',
  phone: '0901 234 567',
  role: 'Quản lý cửa hàng',
}

export const mockPermissionMatrix: PermissionRow[] = [
  { permission: 'Xem thống kê doanh thu', quanLy: true, nvBanHang: true, nvKho: false },
  { permission: 'Quản lý sản phẩm', quanLy: true, nvBanHang: false, nvKho: true },
  { permission: 'Quản lý đơn hàng', quanLy: true, nvBanHang: true, nvKho: true },
  { permission: 'Quản lý người dùng', quanLy: true, nvBanHang: false, nvKho: false },
  { permission: 'Quản lý bài viết', quanLy: true, nvBanHang: false, nvKho: false },
]
