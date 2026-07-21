import { useState } from 'react'
import type { FormEvent } from 'react'
import { FormMessage } from '../../ui/FormMessage'
import { Modal } from '../../ui/Modal'
import { createPaymentMethod } from '../../../services/customer.service'
import type { PaymentMethodType } from '../../../types/customer.types'

export interface PaymentMethodFormModalProps {
  open: boolean
  onClose: () => void
  onSaved: () => void
}

const initialForm = { type: 'the-ngan-hang' as PaymentMethodType, label: '', number: '', holderName: '' }

/**
 * Modal thêm phương thức thanh toán — chưa có ảnh thiết kế riêng, dựng theo
 * đúng pattern popup đã dùng ở `AddProductModal.tsx` (khu vực admin). Số
 * thẻ/số ví chỉ dùng để tính chuỗi che bớt (`maskedNumber`), không lưu số
 * gốc — xem `maskPaymentNumber` trong `customer.service.ts`.
 */
export function PaymentMethodFormModal({ open, onClose, onSaved }: PaymentMethodFormModalProps) {
  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setForm(initialForm)
    setError(null)
    onClose()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await createPaymentMethod(form)
      onSaved()
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Thêm phương thức thanh toán thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidthClassName="max-w-lg">
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Thêm phương thức thanh toán</h2>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Đóng"
          className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {error && <FormMessage variant="error">{error}</FormMessage>}

        <div className="flex flex-col gap-2">
          <label htmlFor="pm-type" className="text-sm font-medium text-neutral-900">
            Loại
          </label>
          <select
            id="pm-type"
            value={form.type}
            onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as PaymentMethodType }))}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="the-ngan-hang">Thẻ ngân hàng</option>
            <option value="vi-dien-tu">Ví điện tử</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="pm-label" className="text-sm font-medium text-neutral-900">
            {form.type === 'the-ngan-hang' ? 'Tên ngân hàng' : 'Tên ví điện tử'}
          </label>
          <input
            id="pm-label"
            required
            value={form.label}
            onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))}
            placeholder={form.type === 'the-ngan-hang' ? 'VD: Vietcombank' : 'VD: MoMo'}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="pm-number" className="text-sm font-medium text-neutral-900">
            {form.type === 'the-ngan-hang' ? 'Số thẻ' : 'Số điện thoại/tài khoản ví'}
          </label>
          <input
            id="pm-number"
            required
            value={form.number}
            onChange={(event) => setForm((prev) => ({ ...prev, number: event.target.value }))}
            placeholder={form.type === 'the-ngan-hang' ? 'VD: 4242 4242 4242 4242' : 'VD: 0909 000 678'}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <p className="text-xs text-neutral-500">Số này sẽ được che bớt và không lưu trữ đầy đủ.</p>
        </div>

        {form.type === 'the-ngan-hang' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="pm-holder" className="text-sm font-medium text-neutral-900">
              Tên chủ thẻ
            </label>
            <input
              id="pm-holder"
              value={form.holderName}
              onChange={(event) => setForm((prev) => ({ ...prev, holderName: event.target.value }))}
              placeholder="VD: NGUYEN VAN A"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Đang lưu...' : 'Lưu phương thức'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
