import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { AddProductModal } from '../../components/admin/AddProductModal'
import { deleteProduct, getProducts } from '../../services/product.service'
import { productStatusMeta } from '../../utils/statusMeta'
import { formatCurrency } from '../../utils/format'
import type { Product, ProductStatus } from '../../types/product.types'

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('tat-ca')
  const [status, setStatus] = useState<ProductStatus | 'tat-ca'>('tat-ca')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const loadProducts = () => {
    setIsLoading(true)
    getProducts({ search, category, status })
      .then((result) => {
        setProducts(result.items)
        setCategories(result.categories)
        setTotalItems(result.totalItems)
        setTotalPages(result.totalPages)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải danh sách sản phẩm.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, status])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xoá sản phẩm này khỏi danh sách?')) return
    await deleteProduct(id)
    loadProducts()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Sản phẩm</h1>
          <p className="mt-1 text-sm text-neutral-500">{totalItems} sản phẩm trong kho</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Thêm sản phẩm mới
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên sản phẩm hoặc SKU..."
            className="w-full rounded-xl border border-neutral-300 py-2.5 pl-10 pr-4 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="tat-ca">Danh mục: Tất cả</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as ProductStatus | 'tat-ca')}
          className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <option value="tat-ca">Trạng thái: Tất cả</option>
          <option value="dang-ban">Đang bán</option>
          <option value="het-hang">Hết hàng</option>
          <option value="ngung-ban">Ngừng bán</option>
        </select>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-neutral-500">
              <tr>
                <th className="px-6 py-3 font-medium">Sản phẩm</th>
                <th className="px-6 py-3 font-medium">Danh mục</th>
                <th className="px-6 py-3 font-medium">Giá</th>
                <th className="px-6 py-3 font-medium">Tồn kho</th>
                <th className="px-6 py-3 font-medium">Trạng thái</th>
                <th className="px-6 py-3 font-medium">Đã bán</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-[10px] text-neutral-400">
                        or browse
                      </span>
                      <div>
                        <p className="font-medium text-neutral-900">{product.name}</p>
                        <p className="text-xs text-neutral-500">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-700">{product.category}</td>
                  <td className="px-6 py-4 font-semibold text-neutral-900">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4 text-neutral-700">{product.stock}</td>
                  <td className="px-6 py-4">
                    <Badge tone={productStatusMeta[product.status].tone}>{productStatusMeta[product.status].label}</Badge>
                  </td>
                  <td className="px-6 py-4 text-neutral-700">{product.sold}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Link to={`/admin/products/${product.id}`} className="font-medium text-blue-600 hover:underline">
                      Sửa
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="ml-4 font-medium text-red-600 hover:underline"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">
                    Không tìm thấy sản phẩm phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-sm text-neutral-500">
        <span>
          Hiển thị 1-{products.length} trong {totalItems} sản phẩm
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              disabled={page !== 1}
              title={page !== 1 ? 'Chưa có dữ liệu mock cho trang này' : undefined}
              className={`h-8 w-8 rounded-lg text-sm font-medium ${
                page === 1 ? 'bg-blue-600 text-white' : 'cursor-not-allowed text-neutral-300'
              }`}
            >
              {page}
            </button>
          ))}
          {totalPages > 3 && <span className="px-1 text-neutral-300">...</span>}
          {totalPages > 3 && (
            <button
              type="button"
              disabled
              title="Chưa có dữ liệu mock cho trang này"
              className="h-8 w-8 cursor-not-allowed rounded-lg text-sm font-medium text-neutral-300"
            >
              {totalPages}
            </button>
          )}
        </div>
      </div>

      <AddProductModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onCreated={() => loadProducts()}
      />
    </div>
  )
}
