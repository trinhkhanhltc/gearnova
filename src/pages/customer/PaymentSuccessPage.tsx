import { Link, useLocation, useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../utils/format'
import type { CustomerOrder, PaymentMethod } from '../../types/order.types'

const paymentMethodLabel: Record<PaymentMethod, string> = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  'the-ngan-hang': 'Thẻ ngân hàng / Ghi nợ',
  'vi-dien-tu': 'Ví điện tử',
  'chuyen-khoan-qr': 'Chuyển khoản QR',
}

export function PaymentSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const order = (location.state as { order?: CustomerOrder } | null)?.order

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">Không tìm thấy thông tin đơn hàng vừa thanh toán.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Về trang chủ
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
          ✓
        </span>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Thanh toán thành công</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Cảm ơn bạn đã mua sắm tại GearNova. Đơn hàng của bạn đang được chuẩn bị.
        </p>

        <dl className="mt-6 space-y-2 rounded-2xl bg-neutral-100 p-5 text-left text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-neutral-500">Mã đơn hàng</dt>
            <dd className="font-bold text-neutral-900">#{order.id}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-neutral-500">Số tiền đã thanh toán</dt>
            <dd className="font-bold text-neutral-900">{formatCurrency(order.total)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-neutral-500">Phương thức</dt>
            <dd className="font-bold text-neutral-900">{paymentMethodLabel[order.paymentMethod]}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-neutral-500">Thời gian</dt>
            <dd className="font-bold text-neutral-900">{order.paidAt ?? '—'}</dd>
          </div>
        </dl>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            to={`/orders/${order.id}/tracking`}
            className="rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Theo dõi đơn hàng
          </Link>
          <Link
            to="/"
            className="rounded-xl border border-neutral-300 py-3 text-sm font-bold text-neutral-900 hover:bg-neutral-50"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
