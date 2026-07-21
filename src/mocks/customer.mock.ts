import type { CustomerAddress, NotificationPreference, PaymentMethod } from '../types/customer.types'

// TODO: thay bằng gọi API thật khi backend sẵn sàng
// Ghi chú: 4 tab này chưa có ảnh thiết kế riêng — dữ liệu mẫu bên dưới được tự
// dựng theo đúng phong cách các màn hình customer đã có, dùng lại địa chỉ đã
// hardcode ở `CheckoutPage.tsx` cho địa chỉ mặc định để nhất quán xuyên suốt.

export const mockCustomerAddresses: CustomerAddress[] = [
  {
    id: 'dc_01',
    recipientName: 'Trần Bảo Anh',
    phone: '0912 345 678',
    address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    isDefault: true,
  },
  {
    id: 'dc_02',
    recipientName: 'Trần Bảo Anh',
    phone: '0912 345 678',
    address: '45 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    isDefault: false,
  },
]

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_01',
    type: 'the-ngan-hang',
    label: 'Vietcombank',
    maskedNumber: '**** **** **** 4242',
    holderName: 'TRAN BAO ANH',
    isDefault: true,
  },
  {
    id: 'pm_02',
    type: 'vi-dien-tu',
    label: 'Ví MoMo',
    maskedNumber: '090*****678',
    isDefault: false,
  },
]

export const mockNotificationPreferences: NotificationPreference[] = [
  {
    id: 'nt_01',
    label: 'Khuyến mãi qua email',
    description: 'Nhận thông tin ưu đãi, mã giảm giá mới nhất qua email.',
    enabled: true,
  },
  {
    id: 'nt_02',
    label: 'Cập nhật đơn hàng qua SMS',
    description: 'Nhận SMS khi đơn hàng được xác nhận, đang giao và đã giao.',
    enabled: true,
  },
  {
    id: 'nt_03',
    label: 'Bản tin công nghệ hàng tuần',
    description: 'Nhận email tổng hợp tin công nghệ mới nhất mỗi tuần.',
    enabled: false,
  },
]
