export type OrderStatus = 'cho-xac-nhan' | 'dang-xu-ly' | 'da-giao' | 'da-huy'

export interface Order {
  id: string
  customerName: string
  productName: string
  status: OrderStatus
  total: number
}

// ---------------------------------------------------------------------------
// Phần dưới đây phục vụ luồng đặt hàng của khách hàng (thanh toán, chuyển
// khoản QR, theo dõi đơn hàng) — không dùng ở khu vực admin.

export type PaymentMethod = 'cod' | 'the-ngan-hang' | 'vi-dien-tu' | 'chuyen-khoan-qr'

export interface ShippingAddress {
  fullName: string
  phone: string
  address: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

export type OrderTrackingStatus = 'da-dat-hang' | 'da-xac-nhan' | 'dang-giao-hang' | 'da-giao'

export interface OrderTrackingStep {
  status: OrderTrackingStatus
  label: string
  time: string | null
  completed: boolean
}

export interface CustomerOrder {
  id: string
  createdAt: string
  trackingStatus: OrderTrackingStatus
  trackingSteps: OrderTrackingStep[]
  items: OrderItem[]
  shippingAddress: ShippingAddress
  subtotal: number
  shippingFee: number
  discount: number
  total: number
  paymentMethod: PaymentMethod
  paidAt: string | null
}

export interface CreateOrderPayload {
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  subtotal: number
  shippingFee: number
  discount: number
  total: number
}
