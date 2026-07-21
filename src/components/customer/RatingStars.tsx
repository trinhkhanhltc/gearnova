export interface RatingStarsProps {
  rating: number
  reviewCount?: number
  className?: string
}

/**
 * Hiển thị sao đánh giá (làm tròn đến sao gần nhất) kèm số lượt đánh giá,
 * dùng chung cho thẻ sản phẩm ở trang chủ, trang chi tiết sản phẩm và khối
 * đánh giá sản phẩm.
 */
export function RatingStars({ rating, reviewCount, className = '' }: RatingStarsProps) {
  const rounded = Math.round(rating)

  return (
    <div className={`flex items-center gap-1.5 text-sm ${className}`}>
      <span className="text-amber-500" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (index < rounded ? '★' : '☆')).join('')}
      </span>
      {reviewCount !== undefined && <span className="text-neutral-500">({reviewCount})</span>}
    </div>
  )
}
