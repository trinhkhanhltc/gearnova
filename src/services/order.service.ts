import { mockOrders } from '../mocks/orders.mock'
import { mockCustomerOrder } from '../mocks/customerOrders.mock'
import type { CreateOrderPayload, CustomerOrder, Order, OrderStatus } from '../types/order.types'

const MOCK_DELAY_MS = 500

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

export interface GetOrdersParams {
  status?: OrderStatus | 'tat-ca'
  search?: string
}

export async function getOrders(params: GetOrdersParams = {}): Promise<Order[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng (truyền params qua query string)
  // return apiClient.get<Order[]>(`/admin/orders?status=${params.status ?? ''}&search=${params.search ?? ''}`)

  let result = mockOrders
  if (params.status && params.status !== 'tat-ca') {
    result = result.filter((order) => order.status === params.status)
  }
  if (params.search) {
    const keyword = params.search.trim().toLowerCase()
    result = result.filter(
      (order) =>
        order.id.toLowerCase().includes(keyword) || order.customerName.toLowerCase().includes(keyword),
    )
  }

  return delay(result)
}

// ---------------------------------------------------------------------------
// Các hàm dưới đây phục vụ luồng đặt hàng của khách hàng (Thanh toán, Chuyển
// khoản QR, Thanh toán thành công, Theo dõi đơn hàng).
//
// Ghi chú quan trọng: ảnh thiết kế chỉ thể hiện đúng 1 kịch bản đơn hàng mẫu
// (mã "DH-10241", 2 sản phẩm Tai nghe Nova X2 + Đồng hồ Nova Fit). Mock
// `createOrder` dưới đây vì vậy luôn trả về mã đơn cố định "DH-10241" bất kể
// giỏ hàng thật khi thao tác trên UI — đây là giả định đơn giản hoá vì chưa
// có backend sinh mã đơn thật. Khi có backend thật, mã đơn cần được sinh động
// (không cố định) và `getOrderTracking` cần nhận đúng mã đơn vừa tạo.

function nowDateTimeLabel(): string {
  const now = new Date()
  const date = now.toLocaleDateString('vi-VN')
  const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  return `${date} · ${time}`
}

export async function createOrder(payload: CreateOrderPayload): Promise<CustomerOrder> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.post<CustomerOrder>('/orders', payload)

  if (payload.items.length === 0) {
    throw new Error('Giỏ hàng đang trống, vui lòng chọn sản phẩm trước khi đặt hàng.')
  }

  const isQr = payload.paymentMethod === 'chuyen-khoan-qr'
  const order: CustomerOrder = {
    ...mockCustomerOrder,
    items: payload.items,
    shippingAddress: payload.shippingAddress,
    subtotal: payload.subtotal,
    shippingFee: payload.shippingFee,
    discount: payload.discount,
    total: payload.total,
    paymentMethod: payload.paymentMethod,
    paidAt: isQr ? null : nowDateTimeLabel(),
  }

  return delay(order)
}

export async function confirmQrPayment(orderId: string): Promise<CustomerOrder> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.post<CustomerOrder>(`/orders/${orderId}/confirm-qr-payment`)

  if (orderId !== mockCustomerOrder.id) {
    throw new Error('Không tìm thấy đơn hàng.')
  }

  return delay({ ...mockCustomerOrder, paidAt: nowDateTimeLabel() })
}

export async function getOrderTracking(orderId: string): Promise<CustomerOrder | null> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<CustomerOrder>(`/orders/${orderId}`)

  if (orderId !== mockCustomerOrder.id) {
    return delay(null)
  }
  return delay(mockCustomerOrder)
}
