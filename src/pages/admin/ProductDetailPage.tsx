import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { ImageDropzone } from '../../components/ui/ImageDropzone'
import { deleteProduct, getProductById, updateProduct } from '../../services/product.service'
import { productStatusMeta } from '../../utils/statusMeta'
import { formatCurrency } from '../../utils/format'
import type { Product } from '../../types/product.types'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    let active = true
    setIsLoading(true)
    getProductById(id)
      .then((result) => {
        if (!active) return
        setProduct(result)
        setDescription(result?.description ?? '')
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Không thể tải chi tiết sản phẩm.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  const handleSave = async () => {
    if (!product) return
    setIsSaving(true)
    try {
      const updated = await updateProduct(product.id, { description })
      setProduct(updated)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thay đổi thất bại.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!product) return
    if (!window.confirm('Xoá sản phẩm này khỏi danh sách?')) return
    await deleteProduct(product.id)
    navigate('/admin/products')
  }

  if (isLoading) return <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!product) return <p className="text-sm text-neutral-500">Không tìm thấy sản phẩm.</p>

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
        <Link to="/admin/products" className="flex items-center gap-1 hover:text-neutral-700">
          ‹ Sản phẩm
        </Link>
        <span>/</span>
        <span className="text-neutral-700">{product.name}</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-neutral-900">{product.name}</h1>
          <Badge tone={productStatusMeta[product.status].tone}>{productStatusMeta[product.status].label}</Badge>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              Chỉnh sửa
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                setDescription(product.description ?? '')
              }}
              className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              Huỷ
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!isEditing || isSaving}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      <p className="mb-6 text-sm text-neutral-500">
        SKU: {product.sku} · Danh mục: {product.category}
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <ImageDropzone label="Kéo thả ảnh sản phẩm chính" className="min-h-[320px]" />
          <div className="grid grid-cols-4 gap-3">
            <ImageDropzone label="ảnh 1" />
            <ImageDropzone label="ảnh 2" />
            <ImageDropzone label="ảnh 3" />
            <ImageDropzone label="ảnh 4" />
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-neutral-50 p-6">
            <div>
              <p className="text-sm text-neutral-500">Giá bán</p>
              <p className="mt-1 text-xl font-bold text-neutral-900">{formatCurrency(product.price)}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Tồn kho</p>
              <p className="mt-1 text-xl font-bold text-amber-600">{product.stock} sản phẩm</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Đã bán</p>
              <p className="mt-1 text-xl font-bold text-neutral-900">{product.sold}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">Doanh thu đóng góp</p>
              <p className="mt-1 text-xl font-bold text-neutral-900">{product.revenueContribution ?? '—'}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="mb-2 text-base font-semibold text-neutral-900">Mô tả sản phẩm</h2>
            {isEditing ? (
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            ) : (
              <p className="text-sm leading-relaxed text-neutral-700">
                {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
              </p>
            )}
          </div>

          <div className="mt-6">
            <h2 className="mb-2 text-base font-semibold text-neutral-900">Thông số kỹ thuật</h2>
            {product.specs && product.specs.length > 0 ? (
              <dl className="divide-y divide-neutral-100 text-sm">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between py-2">
                    <dt className="text-neutral-500">{spec.label}</dt>
                    <dd className="font-medium text-neutral-900">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-neutral-500">Chưa có thông số kỹ thuật được cập nhật.</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="mt-6 text-sm font-medium text-red-600 hover:underline"
          >
            Xoá sản phẩm này
          </button>
        </div>
      </div>
    </div>
  )
}
