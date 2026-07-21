import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProductCard } from '../../components/customer/ProductCard'
import { RatingStars } from '../../components/customer/RatingStars'
import { WriteReviewModal } from '../../components/customer/WriteReviewModal'
import { ImageDropzone } from '../../components/ui/ImageDropzone'
import { useCart } from '../../contexts/CartContext'
import { getPublicProductById, getRelatedProducts } from '../../services/product.service'
import { formatCurrency } from '../../utils/format'
import type { Product, ProductRatingBreakdown } from '../../types/product.types'

const breakdownRows: Array<{ key: keyof ProductRatingBreakdown; label: string }> = [
  { key: 'star5', label: '5 sao' },
  { key: 'star4', label: '4 sao' },
  { key: 'star3', label: '3 sao' },
  { key: 'star2', label: '2 sao' },
  { key: 'star1', label: '1 sao' },
]

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined)
  const [quantity, setQuantity] = useState(1)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    let active = true
    setIsLoading(true)
    Promise.all([getPublicProductById(id), getRelatedProducts(id)])
      .then(([productResult, relatedResult]) => {
        if (!active) return
        setProduct(productResult)
        setRelated(relatedResult)
        setSelectedColor(productResult?.colors?.[0])
        setQuantity(1)
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

  const handleReviewSubmitted = () => {
    if (!id) return
    getPublicProductById(id).then(setProduct)
  }

  if (isLoading) return <p className="mx-auto max-w-7xl px-6 py-10 text-sm text-neutral-500">Đang tải dữ liệu...</p>
  if (error) return <p className="mx-auto max-w-7xl px-6 py-10 text-sm text-red-600">{error}</p>
  if (!product) return <p className="mx-auto max-w-7xl px-6 py-10 text-sm text-neutral-500">Không tìm thấy sản phẩm.</p>

  const handleAddToCart = () => {
    addItem({ productId: product.id, name: product.name, price: product.price, quantity, color: selectedColor })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
        <Link to="/" className="hover:text-neutral-700">
          Trang chủ
        </Link>
        <span>/</span>
        <span className="text-neutral-700">{product.category}</span>
        <span>/</span>
        <span className="font-medium text-neutral-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <ImageDropzone label="Ảnh sản phẩm chính" className="aspect-square w-full" />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((index) => (
              <ImageDropzone key={index} label={`Ảnh ${index}`} className="aspect-square" />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{product.name}</h1>
          {product.rating !== undefined && (
            <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500">
              <RatingStars rating={product.rating} />
              <span>
                {product.rating.toFixed(1)} ({product.reviewCount} đánh giá) · Đã bán {product.sold}
              </span>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-neutral-900">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-neutral-400 line-through">{formatCurrency(product.originalPrice)}</span>
            )}
            {product.discountPercent && (
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                -{product.discountPercent}%
              </span>
            )}
          </div>

          {product.description && <p className="mt-4 text-sm leading-relaxed text-neutral-600">{product.description}</p>}

          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-neutral-900">Màu sắc</p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-xl border px-4 py-2 text-sm font-medium ${
                      selectedColor === color
                        ? 'border-blue-600 text-blue-600'
                        : 'border-neutral-300 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-xl border border-neutral-300">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-neutral-900"
                aria-label="Giảm số lượng"
              >
                −
              </button>
              <span className="flex h-10 w-10 items-center justify-center text-sm font-medium text-neutral-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.min(product.stock || prev + 1, prev + 1))}
                className="flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-neutral-900"
                aria-label="Tăng số lượng"
              >
                +
              </button>
            </div>
            {product.stock > 0 ? (
              <span className="text-sm font-medium text-amber-600">Chỉ còn {product.stock} sản phẩm</span>
            ) : (
              <span className="text-sm font-medium text-red-600">Tạm hết hàng</span>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="rounded-xl border border-neutral-300 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Thêm vào giỏ
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Mua ngay
            </button>
          </div>

          {product.specs && product.specs.length > 0 && (
            <dl className="mt-6 divide-y divide-neutral-100 border-t border-neutral-100 text-sm">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex items-center justify-between py-3">
                  <dt className="text-neutral-500">{spec.label}</dt>
                  <dd className="font-medium text-neutral-900">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && product.ratingBreakdown && (
        <section className="mt-14">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Đánh giá sản phẩm</h2>
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Viết đánh giá
            </button>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-[160px_1fr]">
              <div className="flex flex-col items-center justify-center text-center sm:border-r sm:border-neutral-100">
                <span className="text-4xl font-bold text-neutral-900">{product.rating?.toFixed(1)}</span>
                <RatingStars rating={product.rating ?? 0} className="mt-2" />
                <span className="mt-1 text-sm text-neutral-500">{product.reviewCount} đánh giá</span>
              </div>
              <div className="space-y-2">
                {breakdownRows.map((row) => (
                  <div key={row.key} className="flex items-center gap-3 text-sm">
                    <span className="w-12 shrink-0 text-neutral-500">{row.label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: `${product.ratingBreakdown![row.key]}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-neutral-500">{product.ratingBreakdown![row.key]}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white">
            {product.reviews.map((review) => (
              <div key={review.id} className="flex gap-4 p-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                  {review.author
                    .split(' ')
                    .slice(-2)
                    .map((part) => part[0])
                    .join('')
                    .toUpperCase()}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-neutral-900">{review.author}</p>
                    <span className="text-sm text-neutral-500">{review.date}</span>
                  </div>
                  <RatingStars rating={review.rating} className="mt-1" />
                  <p className="mt-2 text-sm text-neutral-600">{review.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 text-xl font-bold text-neutral-900">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} variant="grid" />
            ))}
          </div>
        </section>
      )}

      <WriteReviewModal
        open={isReviewModalOpen}
        productId={product.id}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmitted={handleReviewSubmitted}
      />
    </div>
  )
}
