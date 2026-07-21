export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  ordersCount: number
  totalSpent: number
  joinedAt: string
}

export interface CustomerOverview {
  totalCustomers: number
  newThisMonth: number
  loyalCustomers: number
  customers: Customer[]
}

// ---------------------------------------------------------------------------
// Hồ sơ cá nhân của khách hàng đang đăng nhập (trang Cài đặt tài khoản trong
// storefront) — khác với `Customer` (dòng dữ liệu trong bảng quản lý khách
// hàng ở admin).

export type CustomerGender = 'nam' | 'nu' | 'khac'

export interface CustomerProfile {
  fullName: string
  phone: string
  email: string
  dateOfBirth: string
  gender: CustomerGender
}

export interface UpdateCustomerProfilePayload {
  fullName: string
  phone: string
  email: string
  dateOfBirth: string
  gender: CustomerGender
}

// ---------------------------------------------------------------------------
// 4 tab còn lại trong Cài đặt tài khoản: Địa chỉ giao hàng, Phương thức thanh
// toán, Đổi mật khẩu, Thông báo — chưa có ảnh thiết kế riêng, tự thiết kế bổ
// sung theo đúng phong cách các màn hình customer đã có.

export interface CustomerAddress {
  id: string
  recipientName: string
  phone: string
  address: string
  isDefault: boolean
}

export interface CreateCustomerAddressPayload {
  recipientName: string
  phone: string
  address: string
}

export type PaymentMethodType = 'the-ngan-hang' | 'vi-dien-tu'

export interface PaymentMethod {
  id: string
  type: PaymentMethodType
  label: string
  maskedNumber: string
  holderName?: string
  isDefault: boolean
}

export interface CreatePaymentMethodPayload {
  type: PaymentMethodType
  label: string
  number: string
  holderName?: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface NotificationPreference {
  id: string
  label: string
  description: string
  enabled: boolean
}
