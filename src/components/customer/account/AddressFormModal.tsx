import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { FormMessage } from '../../ui/FormMessage'
import { Modal } from '../../ui/Modal'
import { createAddress, updateAddress } from '../../../services/customer.service'
import type { CustomerAddress } from '../../../types/customer.types'

export interface AddressFormModalProps {
  open: boolean
  editingAddress: CustomerAddress | null
  onClose: () => void
  onSaved: () => void
}

const initialForm = { recipientName: '', phone: '', address: '' }

/**
 * Modal thêm/sửa địa chỉ giao hàng — chưa có ảnh thiết kế riêng, dựng theo
 * đúng pattern popup đã dùng ở `AddProductModal.tsx` (khu vực admin).
 */
export function AddressFormModal({ open, editingAddress, onClose, onSaved }: AddressFormModalProps) {
  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setForm(
        editingAddress
          ? { recipientName: editingAddress.recipientName, phone: editingAddress.phone, address: editingAddress.address }
          : initialForm,
      )
      setError(null)
    }
  }, [open, editingAddress])

  const handleClose = () => {
    setError(null)
    onClose()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, form)
      } else {
        await createAddress(form)
      }
      onSaved()
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu địa chỉ thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidthClassName="max-w-lg">
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold text-neutral-900">{editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}</h2>
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
          <label htmlFor="address-recipient" className="text-sm font-medium text-neutral-900">
            Tên người nhận
          </label>
          <input
            id="address-recipient"
            required
            value={form.recipientName}
            onChange={(event) => setForm((prev) => ({ ...prev, recipientName: event.target.value }))}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="address-phone" className="text-sm font-medium text-neutral-900">
            Số điện thoại
          </label>
          <input
            id="address-phone"
            required
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="address-detail" className="text-sm font-medium text-neutral-900">
            Địa chỉ
          </label>
          <textarea
            id="address-detail"
            required
            rows={3}
            value={form.address}
            onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

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
            {isLoading ? 'Đang lưu...' : 'Lưu địa chỉ'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
