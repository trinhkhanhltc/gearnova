import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ImageDropzone } from '../../components/ui/ImageDropzone'
import { getOrderTracking } from '../../services/order.service'
import { formatCurrency } from '../../utils/format'
import type { CustomerOrder, OrderTrackingStatus } from '../../types/order.types'

const trackingStatusLabel: Record<OrderTrackingStatus, string> = {
  'da-dat-hang': 'Đã đặt hàng',
  'da-xac-nhan': 'Đã xác nhận',
  'dang-giao-hang': 'Đang giao hàng',
  'da-giao': 'Đã giao',
}

export function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<CustomerOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    setIsLoading(true)
    getOrderTracking(id)
      .then((result) => {
        if (active) setOrder(result)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Không thể tải thông tin đơn hàng.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  if (isLoading) return <p className="mx-auto max-w-4xl px-6 py-10 text-sm text-neutral-500">Đang tải dữ liệu...</p>
  if (error) return <p className="mx-auto max-w-4xl px-6 py-10 text-sm text-red-600">{error}</p>
  if (!order) return <p className="mx-auto max-w-4xl px-6 py-10 text-sm text-neutral-500">Không tìm thấy đơn hàng.</p>

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Đơn hàng #{order.id}</h1>
            <p className="mt-1 text-sm text-neutral-500">Đặt ngày {order.createdAt}</p>
          </div>
          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {trackingStatusLabel[order.trackingStatus]}
          </span>
        </div>

        <div className="mt-8 flex items-start">
          {order.trackingSteps.map((step, index) => (
            <div key={step.status} className="flex flex-1 flex-col items-center text-center last:flex-none last:w-auto">
              <div className="flex w-full items-center">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    step.completed ? 'bg-blue-600 text-white' : 'bg-neutral-200 text-neutral-400'
                  }`}
                >
                  {step.completed ? '✓' : '●'}
                </div>
                {index < order.trackingSteps.length - 1 && (
                  <div className={`h-0.5 flex-1 ${step.completed ? 'bg-blue-600' : 'bg-neutral-200'}`} />
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-neutral-900">{step.label}</p>
              <p className="text-xs text-neutral-500">{step.time ?? '—'}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="mb-3 text-sm font-bold text-neutral-900">Sản phẩm trong đơn</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 rounded-2xl border border-neutral-200 p-4">
                <ImageDropzone label="Ảnh" className="h-16 w-16 shrink-0 p-2 text-[10px]" />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{item.name}</p>
                  <p className="text-sm text-neutral-500">Số lượng: {item.quantity}</p>
                </div>
                <span className="font-semibold text-neutral-900">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-neutral-200 p-5">
          <div>
            <p className="font-semibold text-neutral-900">Giao đến</p>
            <p className="mt-1 text-sm text-neutral-500">{order.shippingAddress.address}</p>
          </div>
          <button
            type="button"
            title="Chưa có thiết kế cho trang liên hệ hỗ trợ"
            className="shrink-0 text-sm font-medium text-blue-600 hover:underline"
          >
            Liên hệ hỗ trợ
          </button>
        </div>
      </div>
    </div>
  )
}
