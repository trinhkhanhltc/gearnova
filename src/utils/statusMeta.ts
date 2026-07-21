import type { BadgeTone } from '../components/ui/Badge'
import type { OrderStatus } from '../types/order.types'
import type { ProductStatus } from '../types/product.types'
import type { PostStatus } from '../types/post.types'
import type { StaffRole, StaffStatus } from '../types/staff.types'

export const orderStatusMeta: Record<OrderStatus, { label: string; tone: BadgeTone }> = {
  'cho-xac-nhan': { label: 'Chờ xác nhận', tone: 'gray' },
  'dang-xu-ly': { label: 'Đang xử lý', tone: 'yellow' },
  'da-giao': { label: 'Đã giao', tone: 'green' },
  'da-huy': { label: 'Đã hủy', tone: 'red' },
}

export const orderStatusFilters: Array<{ value: OrderStatus | 'tat-ca'; label: string }> = [
  { value: 'tat-ca', label: 'Tất cả' },
  { value: 'cho-xac-nhan', label: 'Chờ xác nhận' },
  { value: 'dang-xu-ly', label: 'Đang xử lý' },
  { value: 'da-giao', label: 'Đã giao' },
  { value: 'da-huy', label: 'Đã hủy' },
]

export const productStatusMeta: Record<ProductStatus, { label: string; tone: BadgeTone }> = {
  'dang-ban': { label: 'Đang bán', tone: 'green' },
  'het-hang': { label: 'Hết hàng', tone: 'yellow' },
  'ngung-ban': { label: 'Ngừng bán', tone: 'gray' },
}

export const postStatusMeta: Record<PostStatus, { label: string; tone: BadgeTone }> = {
  'da-dang': { label: 'Đã đăng', tone: 'green' },
  'ban-nhap': { label: 'Bản nháp', tone: 'gray' },
}

export const staffStatusMeta: Record<StaffStatus, { label: string; tone: BadgeTone }> = {
  'hoat-dong': { label: 'Hoạt động', tone: 'green' },
  'tam-khoa': { label: 'Tạm khoá', tone: 'red' },
}

export const staffRoleLabel: Record<StaffRole, string> = {
  'quan-ly': 'Quản lý',
  'nv-ban-hang': 'Nhân viên bán hàng',
  'nv-kho': 'Nhân viên kho',
}
