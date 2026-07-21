import { useEffect, useState } from 'react'
import { Badge } from '../../ui/Badge'
import { PaymentMethodFormModal } from './PaymentMethodFormModal'
import { deletePaymentMethod, getMyPaymentMethods, setDefaultPaymentMethod } from '../../../services/customer.service'
import type { PaymentMethod } from '../../../types/customer.types'

const typeLabel: Record<PaymentMethod['type'], string> = {
  'the-ngan-hang': 'Thẻ ngân hàng',
  'vi-dien-tu': 'Ví điện tử',
}

export function PaymentMethodsTab() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const load = () => {
    setIsLoading(true)
    getMyPaymentMethods()
      .then(setMethods)
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải danh sách phương thức thanh toán.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id: string) => {
    await deletePaymentMethod(id)
    load()
  }

  const handleSetDefault = async (id: string) => {
    await setDefaultPaymentMethod(id)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Phương thức thanh toán</h2>
          <p className="mt-1 text-sm text-neutral-500">Quản lý thẻ/ví đã lưu để thanh toán nhanh hơn</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Thêm phương thức
        </button>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && (
        <div className="space-y-3">
          {methods.length === 0 && (
            <p className="text-sm text-neutral-500">Bạn chưa lưu phương thức thanh toán nào.</p>
          )}
          {methods.map((method) => (
            <div key={method.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-neutral-900">{method.label}</p>
                    <Badge tone="gray">{typeLabel[method.type]}</Badge>
                    {method.isDefault && <Badge tone="blue">Mặc định</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{method.maskedNumber}</p>
                  {method.holderName && <p className="text-sm text-neutral-500">{method.holderName}</p>}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm font-medium">
                <button type="button" onClick={() => handleDelete(method.id)} className="text-red-600 hover:underline">
                  Xoá
                </button>
                {!method.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(method.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Đặt làm mặc định
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <PaymentMethodFormModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSaved={load} />
    </div>
  )
}
