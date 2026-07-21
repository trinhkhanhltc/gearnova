import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ImageDropzone } from '../../components/ui/ImageDropzone'
import { useCart } from '../../contexts/CartContext'
import { createOrder } from '../../services/order.service'
import { formatCurrency } from '../../utils/format'
import type { PaymentMethod } from '../../types/order.types'

// Ghi chú: phí vận chuyển và giảm giá cố định theo đúng số liệu trong ảnh
// `customer-thanh-toan.png` (₫30.000 phí ship, giảm ₫200.000) — ảnh thiết kế
// không thể hiện cách tính 2 giá trị này (mã giảm giá áp dụng tự động?), nên
// đây là giả định đơn giản hoá, cần backend thật tính toán lại theo logic
// khuyến mãi/phí vận chuyển thực tế.
const SHIPPING_FEE = 30000
const DISCOUNT = 200000

const paymentMethods: Array<{ value: PaymentMethod; label: string; description: string }> = [
  { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', description: 'Trả tiền mặt khi nhận sản phẩm' },
  { value: 'the-ngan-hang', label: 'Thẻ ngân hàng / Ghi nợ', description: 'Visa, Mastercard, JCB, thẻ nội địa' },
  { value: 'vi-dien-tu', label: 'Ví điện tử', description: 'MoMo, ZaloPay, VNPay' },
  { value: 'chuyen-khoan-qr', label: 'Chuyển khoản QR', description: 'Quét mã QR ngân hàng để thanh toán' },
]

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('chuyen-khoan-qr')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const total = Math.max(subtotal + SHIPPING_FEE - DISCOUNT, 0)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const order = await createOrder({
        items: items.map((item) => ({ productId: item.productId, name: item.name, price: item.price, quantity: item.quantity })),
        shippingAddress: {
          fullName: 'Trần Bảo Anh',
          phone: '0912 345 678',
          address: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
        },
        paymentMethod,
        subtotal,
        shippingFee: SHIPPING_FEE,
        discount: DISCOUNT,
        total,
      })

      if (paymentMethod === 'chuyen-khoan-qr') {
        navigate('/checkout/qr-transfer', { state: { order } })
      } else {
        clearCart()
        navigate('/checkout/success', { state: { order } })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đặt hàng thất bại. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Thanh toán</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

          <div>
            <h2 className="mb-3 text-sm font-bold text-neutral-900">Địa chỉ giao hàng</h2>
            <div className="flex items-start justify-between rounded-2xl border border-neutral-200 bg-white p-5">
              <div>
                <p className="font-semibold text-neutral-900">Trần Bảo Anh · 0912 345 678</p>
                <p className="mt-1 text-sm text-neutral-500">
                  123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
                </p>
              </div>
              <Link to="/account" className="shrink-0 text-sm font-medium text-blue-600 hover:underline">
                Thay đổi
              </Link>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-bold text-neutral-900">Sản phẩm</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
                  <ImageDropzone label="Ảnh" className="h-16 w-16 shrink-0 p-2 text-[10px]" />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{item.name}</p>
                    <p className="text-sm text-neutral-500">Số lượng: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-neutral-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              {items.length === 0 && <p className="text-sm text-neutral-500">Giỏ hàng đang trống.</p>}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-bold text-neutral-900">Phương thức thanh toán</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${
                    paymentMethod === method.value ? 'border-blue-600 ring-1 ring-blue-100' : 'border-neutral-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === method.value}
                    onChange={() => setPaymentMethod(method.value)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    <span className="block font-semibold text-neutral-900">{method.label}</span>
                    <span className="block text-sm text-neutral-500">{method.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="h-fit rounded-2xl bg-neutral-100 p-6">
          <h2 className="mb-4 text-base font-bold text-neutral-900">Tóm tắt đơn hàng</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Tạm tính</span>
              <span className="font-medium text-neutral-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Phí vận chuyển</span>
              <span className="font-medium text-neutral-900">{formatCurrency(SHIPPING_FEE)}</span>
            </div>
            <div className="flex items-center justify-between text-green-600">
              <span>Giảm giá</span>
              <span className="font-medium">-{formatCurrency(DISCOUNT)}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
            <span className="font-bold text-neutral-900">Tổng cộng</span>
            <span className="text-xl font-bold text-neutral-900">{formatCurrency(total)}</span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
          </button>
        </div>
      </form>
    </div>
  )
}
