import { mockCustomerAddresses, mockNotificationPreferences, mockPaymentMethods } from '../mocks/customer.mock'
import { mockCustomerOverview, mockCustomerProfile } from '../mocks/customers.mock'
import type {
  ChangePasswordPayload,
  CreateCustomerAddressPayload,
  CreatePaymentMethodPayload,
  CustomerAddress,
  CustomerOverview,
  CustomerProfile,
  NotificationPreference,
  PaymentMethod,
  UpdateCustomerProfilePayload,
} from '../types/customer.types'

const MOCK_DELAY_MS = 500

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

export async function getCustomerOverview(): Promise<CustomerOverview> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<CustomerOverview>('/admin/customers')

  return delay(mockCustomerOverview)
}

// ---------------------------------------------------------------------------
// Hồ sơ cá nhân của khách hàng đang đăng nhập (storefront — trang Cài đặt tài
// khoản, tab "Thông tin cá nhân").

let currentProfile: CustomerProfile = { ...mockCustomerProfile }

export async function getMyProfile(): Promise<CustomerProfile> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<CustomerProfile>('/me/profile')

  return delay(currentProfile)
}

export async function updateMyProfile(payload: UpdateCustomerProfilePayload): Promise<CustomerProfile> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.put<CustomerProfile>('/me/profile', payload)

  if (!payload.fullName.trim() || !payload.phone.trim() || !payload.email.trim()) {
    throw new Error('Vui lòng nhập đầy đủ họ tên, số điện thoại và email.')
  }

  currentProfile = { ...payload }
  return delay(currentProfile)
}

// ---------------------------------------------------------------------------
// Địa chỉ giao hàng (tab "Địa chỉ giao hàng").

let addresses: CustomerAddress[] = [...mockCustomerAddresses]
let addressSeq = addresses.length

export async function getMyAddresses(): Promise<CustomerAddress[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<CustomerAddress[]>('/me/addresses')

  return delay(addresses)
}

export async function createAddress(payload: CreateCustomerAddressPayload): Promise<CustomerAddress> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.post<CustomerAddress>('/me/addresses', payload)

  if (!payload.recipientName.trim() || !payload.phone.trim() || !payload.address.trim()) {
    throw new Error('Vui lòng nhập đầy đủ tên người nhận, số điện thoại và địa chỉ.')
  }

  addressSeq += 1
  const newAddress: CustomerAddress = {
    id: `dc_${addressSeq}`,
    ...payload,
    isDefault: addresses.length === 0,
  }
  addresses = [...addresses, newAddress]
  return delay(newAddress)
}

export async function updateAddress(id: string, payload: CreateCustomerAddressPayload): Promise<CustomerAddress> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.put<CustomerAddress>(`/me/addresses/${id}`, payload)

  const index = addresses.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy địa chỉ.')
  }
  const updated: CustomerAddress = { ...addresses[index], ...payload }
  addresses = [...addresses.slice(0, index), updated, ...addresses.slice(index + 1)]
  return delay(updated)
}

export async function deleteAddress(id: string): Promise<{ message: string }> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.delete<{ message: string }>(`/me/addresses/${id}`)

  addresses = addresses.filter((item) => item.id !== id)
  return delay({ message: 'Đã xoá địa chỉ.' })
}

export async function setDefaultAddress(id: string): Promise<CustomerAddress[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.put<CustomerAddress[]>(`/me/addresses/${id}/set-default`)

  addresses = addresses.map((item) => ({ ...item, isDefault: item.id === id }))
  return delay(addresses)
}

// ---------------------------------------------------------------------------
// Phương thức thanh toán (tab "Phương thức thanh toán").

function maskPaymentNumber(type: CreatePaymentMethodPayload['type'], number: string): string {
  const digits = number.replace(/\s+/g, '')
  if (type === 'the-ngan-hang') {
    const last4 = digits.slice(-4).padStart(4, '•')
    return `**** **** **** ${last4}`
  }
  if (digits.length <= 6) return digits
  return `${digits.slice(0, 3)}*****${digits.slice(-3)}`
}

let paymentMethods: PaymentMethod[] = [...mockPaymentMethods]
let paymentMethodSeq = paymentMethods.length

export async function getMyPaymentMethods(): Promise<PaymentMethod[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<PaymentMethod[]>('/me/payment-methods')

  return delay(paymentMethods)
}

export async function createPaymentMethod(payload: CreatePaymentMethodPayload): Promise<PaymentMethod> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.post<PaymentMethod>('/me/payment-methods', payload)

  if (!payload.label.trim() || !payload.number.trim()) {
    throw new Error('Vui lòng nhập đầy đủ tên ngân hàng/ví và số thẻ/số ví.')
  }

  paymentMethodSeq += 1
  const newMethod: PaymentMethod = {
    id: `pm_${paymentMethodSeq}`,
    type: payload.type,
    label: payload.label,
    maskedNumber: maskPaymentNumber(payload.type, payload.number),
    holderName: payload.holderName,
    isDefault: paymentMethods.length === 0,
  }
  paymentMethods = [...paymentMethods, newMethod]
  return delay(newMethod)
}

export async function deletePaymentMethod(id: string): Promise<{ message: string }> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.delete<{ message: string }>(`/me/payment-methods/${id}`)

  paymentMethods = paymentMethods.filter((item) => item.id !== id)
  return delay({ message: 'Đã xoá phương thức thanh toán.' })
}

export async function setDefaultPaymentMethod(id: string): Promise<PaymentMethod[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.put<PaymentMethod[]>(`/me/payment-methods/${id}/set-default`)

  paymentMethods = paymentMethods.map((item) => ({ ...item, isDefault: item.id === id }))
  return delay(paymentMethods)
}

// ---------------------------------------------------------------------------
// Đổi mật khẩu (tab "Đổi mật khẩu").

export async function changeMyPassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.put<{ message: string }>('/me/password', payload)

  if (!payload.currentPassword || !payload.newPassword || !payload.confirmPassword) {
    throw new Error('Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới.')
  }
  if (payload.newPassword.length < 8) {
    throw new Error('Mật khẩu mới phải có ít nhất 8 ký tự.')
  }
  if (payload.newPassword !== payload.confirmPassword) {
    throw new Error('Mật khẩu xác nhận không khớp.')
  }

  return delay({ message: 'Đổi mật khẩu thành công.' })
}

// ---------------------------------------------------------------------------
// Thông báo (tab "Thông báo").

let notificationPreferences: NotificationPreference[] = [...mockNotificationPreferences]

export async function getMyNotificationPreferences(): Promise<NotificationPreference[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<NotificationPreference[]>('/me/notification-preferences')

  return delay(notificationPreferences)
}

export async function updateNotificationPreference(id: string, enabled: boolean): Promise<NotificationPreference[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.put<NotificationPreference[]>(`/me/notification-preferences/${id}`, { enabled })

  notificationPreferences = notificationPreferences.map((item) => (item.id === id ? { ...item, enabled } : item))
  return delay(notificationPreferences)
}
