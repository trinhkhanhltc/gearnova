import { useState } from 'react'
import type { FormEvent } from 'react'
import { FormMessage } from '../ui/FormMessage'
import { Modal } from '../ui/Modal'
import { ImageDropzone } from '../ui/ImageDropzone'
import { createProduct } from '../../services/product.service'
import { mockProductCategories } from '../../mocks/products.mock'
import type { Product } from '../../types/product.types'

export interface AddProductModalProps {
  open: boolean
  onClose: () => void
  onCreated: (product: Product) => void
}

const initialForm = {
  name: '',
  sku: '',
  category: mockProductCategories[0],
  price: '',
  stock: '',
  description: '',
}

export function AddProductModal({ open, onClose, onCreated }: AddProductModalProps) {
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
      const product = await createProduct({
        name: form.name,
        sku: form.sku,
        category: form.category,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        description: form.description,
      })
      onCreated(product)
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Thêm sản phẩm thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidthClassName="max-w-2xl">
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Thêm sản phẩm mới</h2>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Đóng"
          className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 max-h-[70vh] space-y-5 overflow-y-auto pr-1">
        {error && <FormMessage variant="error">{error}</FormMessage>}

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-neutral-900">Ảnh sản phẩm</span>
          <div className="grid grid-cols-3 gap-3">
            <ImageDropzone label="Ảnh chính" />
            <ImageDropzone label="Ảnh 2" />
            <ImageDropzone label="Ảnh 3" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="product-name" className="text-sm font-medium text-neutral-900">
            Tên sản phẩm
          </label>
          <input
            id="product-name"
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="VD: Tai nghe chống ồn Nova X3"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="product-sku" className="text-sm font-medium text-neutral-900">
              SKU
            </label>
            <input
              id="product-sku"
              required
              value={form.sku}
              onChange={(event) => setForm((prev) => ({ ...prev, sku: event.target.value }))}
              placeholder="NV-XXX-001"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="product-category" className="text-sm font-medium text-neutral-900">
              Danh mục
            </label>
            <select
              id="product-category"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {mockProductCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="product-price" className="text-sm font-medium text-neutral-900">
              Giá bán (đ)
            </label>
            <input
              id="product-price"
              type="number"
              min={0}
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              placeholder="0"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="product-stock" className="text-sm font-medium text-neutral-900">
              Số lượng tồn kho
            </label>
            <input
              id="product-stock"
              type="number"
              min={0}
              value={form.stock}
              onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
              placeholder="0"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="product-description" className="text-sm font-medium text-neutral-900">
            Mô tả sản phẩm
          </label>
          <textarea
            id="product-description"
            rows={4}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Mô tả ngắn gọn về sản phẩm..."
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
            {isLoading ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
