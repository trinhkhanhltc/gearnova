import { useEffect, useState } from 'react'
import { Badge } from '../../ui/Badge'
import { AddressFormModal } from './AddressFormModal'
import { deleteAddress, getMyAddresses, setDefaultAddress } from '../../../services/customer.service'
import type { CustomerAddress } from '../../../types/customer.types'

export function AddressesTab() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null)

  const load = () => {
    setIsLoading(true)
    getMyAddresses()
      .then(setAddresses)
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải danh sách địa chỉ.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(load, [])

  const handleAdd = () => {
    setEditingAddress(null)
    setIsModalOpen(true)
  }

  const handleEdit = (address: CustomerAddress) => {
    setEditingAddress(address)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await deleteAddress(id)
    load()
  }

  const handleSetDefault = async (id: string) => {
    await setDefaultAddress(id)
    load()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Địa chỉ giao hàng</h2>
          <p className="mt-1 text-sm text-neutral-500">Quản lý các địa chỉ nhận hàng của bạn</p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Thêm địa chỉ mới
        </button>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && (
        <div className="space-y-3">
          {addresses.length === 0 && (
            <p className="text-sm text-neutral-500">Bạn chưa có địa chỉ giao hàng nào.</p>
          )}
          {addresses.map((address) => (
            <div key={address.id} className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-neutral-900">
                      {address.recipientName} · {address.phone}
                    </p>
                    {address.isDefault && <Badge tone="blue">Mặc định</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{address.address}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm font-medium">
                <button type="button" onClick={() => handleEdit(address)} className="text-neutral-700 hover:underline">
                  Sửa
                </button>
                <button type="button" onClick={() => handleDelete(address.id)} className="text-red-600 hover:underline">
                  Xoá
                </button>
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address.id)}
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

      <AddressFormModal
        open={isModalOpen}
        editingAddress={editingAddress}
        onClose={() => setIsModalOpen(false)}
        onSaved={load}
      />
    </div>
  )
}
