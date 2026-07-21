import { useState } from 'react'
import type { FormEvent } from 'react'
import { FormMessage } from '../ui/FormMessage'
import { Modal } from '../ui/Modal'
import { createProductReview } from '../../services/product.service'

export interface WriteReviewModalProps {
  open: boolean
  productId: string
  onClose: () => void
  onSubmitted: () => void
}

/**
 * Modal viết đánh giá sản phẩm — chưa có ảnh thiết kế riêng, dựng theo đúng
 * pattern popup đã dùng ở `AddProductModal.tsx` (khu vực admin).
 */
export function WriteReviewModal({ open, productId, onClose, onSubmitted }: WriteReviewModalProps) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setRating(5)
    setHoverRating(0)
    setContent('')
    setError(null)
    onClose()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await createProductReview(productId, { rating, content })
      onSubmitted()
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi đánh giá thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidthClassName="max-w-lg">
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Viết đánh giá</h2>
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

        <div>
          <p className="mb-2 text-sm font-medium text-neutral-900">Số sao</p>
          <div className="flex items-center gap-1 text-2xl text-amber-500" onMouseLeave={() => setHoverRating(0)}>
            {Array.from({ length: 5 }, (_, index) => {
              const starValue = index + 1
              const filled = starValue <= (hoverRating || rating)
              return (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  aria-label={`${starValue} sao`}
                  className="leading-none"
                >
                  {filled ? '★' : '☆'}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="review-content" className="text-sm font-medium text-neutral-900">
            Nội dung đánh giá
          </label>
          <textarea
            id="review-content"
            required
            rows={4}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
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
            {isLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
