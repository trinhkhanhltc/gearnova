import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ImageDropzone } from '../../components/ui/ImageDropzone'
import { useCart } from '../../contexts/CartContext'
import { confirmQrPayment } from '../../services/order.service'
import { formatCurrency } from '../../utils/format'
import type { CustomerOrder } from '../../types/order.types'

const COUNTDOWN_SECONDS = 14 * 60 + 32

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function toTransferContent(orderId: string, fullName: string): string {
  const normalizedName = fullName
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .replace(/\s+/g, '')
    .toUpperCase()
  return `${orderId.replace('-', '')} ${normalizedName}`
}

export function QrTransferPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { clearCart } = useCart()
  const order = (location.state as { order?: CustomerOrder } | null)?.order

  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS)
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!order) return
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [order])

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="text-sm text-neutral-500">
          Không tìm thấy thông tin đơn hàng cần thanh toán. Vui lòng quay lại trang thanh toán.
        </p>
        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="mt-4 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Về trang thanh toán
        </button>
      </div>
    )
  }

  const handleConfirm = async () => {
    setError(null)
    setIsConfirming(true)
    try {
      const confirmedOrder = await confirmQrPayment(order.id)
      clearCart()
      navigate('/checkout/success', { state: { order: confirmedOrder } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác nhận chuyển khoản thất bại. Vui lòng thử lại.')
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-10">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8">
        <h1 className="text-xl font-bold text-neutral-900">Quét mã để chuyển khoản</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Đơn hàng sẽ được xác nhận tự động sau khi hệ thống nhận được thanh toán
        </p>

        <ImageDropzone label="Mã QR ngân hàng" className="mx-auto mt-6 aspect-square w-full max-w-[260px]" />

        <div className="mt-6 flex justify-center">
          <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
            Còn lại {formatCountdown(secondsLeft)} để hoàn tất thanh toán
          </span>
        </div>

        <dl className="mt-6 divide-y divide-neutral-100 rounded-2xl border border-neutral-200 text-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="text-neutral-500">Ngân hàng</dt>
            <dd className="font-semibold text-neutral-900">Vietcombank – Chi nhánh HCM</dd>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="text-neutral-500">Chủ tài khoản</dt>
            <dd className="font-semibold text-neutral-900">CÔNG TY TNHH GEARNOVA</dd>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="text-neutral-500">Số tài khoản</dt>
            <dd className="font-mono font-semibold text-neutral-900">0071 0012 3456 78</dd>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="text-neutral-500">Số tiền</dt>
            <dd className="font-semibold text-blue-600">{formatCurrency(order.total)}</dd>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <dt className="text-neutral-500">Nội dung</dt>
            <dd className="font-mono font-semibold text-neutral-900">
              {toTransferContent(order.id, order.shippingAddress.fullName)}
            </dd>
          </div>
        </dl>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh nhất.
        </p>

        {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isConfirming}
          className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isConfirming ? 'Đang xác nhận...' : 'Tôi đã chuyển khoản'}
        </button>
      </div>
    </div>
  )
}
