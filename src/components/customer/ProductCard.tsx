import { Link } from 'react-router-dom'
import { ImageDropzone } from '../ui/ImageDropzone'
import { RatingStars } from './RatingStars'
import { formatCurrency } from '../../utils/format'
import type { Product } from '../../types/product.types'

export interface ProductCardProps {
  product: Product
  /**
   * 'featured': dùng ở khối "Sản phẩm nổi bật" trang chủ — có nhãn danh mục,
   * số sao đánh giá và nút thêm nhanh vào giỏ.
   * 'grid': dùng ở danh sách sản phẩm và "Sản phẩm liên quan" — chỉ có ảnh,
   * tên và giá (đúng như ảnh thiết kế, không có sao/nút thêm giỏ).
   */
  variant?: 'featured' | 'grid'
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, variant = 'grid', onAddToCart }: ProductCardProps) {
  const isFeatured = variant === 'featured'

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <Link to={`/products/${product.id}`}>
        <ImageDropzone label="Ảnh sản phẩm" className="aspect-square w-full rounded-none border-0 border-b border-dashed border-neutral-300" />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {isFeatured && <p className="text-xs text-neutral-500">{product.category}</p>}
        <Link to={`/products/${product.id}`} className="font-semibold text-neutral-900 hover:text-blue-600">
          {product.name}
        </Link>
        {isFeatured && product.rating !== undefined && (
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        )}
        <div className="mt-1 flex items-center justify-between">
          <span className="text-lg font-bold text-neutral-900">{formatCurrency(product.price)}</span>
          {isFeatured && onAddToCart && (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              aria-label={`Thêm ${product.name} vào giỏ`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
