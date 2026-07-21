import type { CustomerOrder } from '../types/order.types'

// TODO: thay bằng gọi API thật khi backend sẵn sàng
//
// Ghi chú: mã đơn "DH-10241" trùng với 1 đơn hàng khác trong mock của khu vực
// admin (`src/mocks/orders.mock.ts`, khách "Trần Thị Mai"). Đây là trùng lặp
// ngẫu nhiên giữa 2 bộ dữ liệu mock độc lập (admin quản lý đơn hàng tổng thể,
// còn file này chỉ phục vụ luồng "đơn hàng của tôi" ở storefront) — không ảnh
// hưởng chức năng vì 2 UI dùng 2 nguồn dữ liệu tách biệt, nhưng backend thật
// cần đảm bảo mã đơn hàng là duy nhất trên toàn hệ thống.
export const mockCustomerOrder: CustomerOrder = {
  id: 'DH-10241',
  createdAt: '20/07/2026',
  trackingStatus: 'dang-giao-hang',
  trackingSteps: [
    { status: 'da-dat-hang', label: 'Đã đặt hàng', time: '20/07 · 09:12', completed: true },
    { status: 'da-xac-nhan', label: 'Đã xác nhận', time: '20/07 · 10:05', completed: true },
    { status: 'dang-giao-hang', label: 'Đang giao hàng', time: '20/07 · 14:40', completed: true },
    { status: 'da-giao', label: 'Đã giao', time: 'Dự kiến 22/07', completed: false },
  ],
  items: [
    { productId: 'NV-NX2-BLK', name: 'Tai nghe chống ồn Nova X2', price: 2490000, quantity: 1 },
    { productId: 'NV-NFIT-01', name: 'Đồng hồ thông minh Nova Fit', price: 3290000, quantity: 1 },
  ],
  shippingAddress: {
    fullName: 'Trần Bảo Anh',
    phone: '0912 345 678',
    address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  },
  subtotal: 5780000,
  shippingFee: 30000,
  discount: 200000,
  total: 5610000,
  paymentMethod: 'chuyen-khoan-qr',
  paidAt: '20/07/2026 · 14:22',
}
