import { Link, useNavigate } from 'react-router-dom'
import { ImageDropzone } from '../../components/ui/ImageDropzone'
import { useCart } from '../../contexts/CartContext'
import { formatCurrency } from '../../utils/format'

/**
 * Trang giỏ hàng: chưa có ảnh thiết kế riêng cho màn này, được dựng theo đúng
 * pattern/style đã dùng ở trang Thanh toán (`CheckoutPage.tsx`) — danh sách
 * sản phẩm dạng card + khối tóm tắt tổng tiền.
 */
export function CartPage() {
  const navigate = useNavigate()
  const { items, subtotal, updateQuantity, removeItem } = useCart()

  const handleCheckout = () => {
    navigate('/checkout')
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Giỏ hàng của bạn</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
          <p className="text-sm text-neutral-500">Giỏ hàng của bạn đang trống.</p>
          <Link
            to="/products"
            className="mt-4 inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.color ?? ''}`}
                className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <ImageDropzone label="Ảnh" className="h-20 w-20 shrink-0 p-2 text-[10px]" />

                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{item.name}</p>
                  {item.color && <p className="mt-1 text-sm text-neutral-500">Màu: {item.color}</p>}
                  <p className="mt-1 text-sm text-neutral-500">Đơn giá: {formatCurrency(item.price)}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-xl border border-neutral-300">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.color, item.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center text-neutral-600 hover:text-neutral-900"
                      aria-label="Giảm số lượng"
                    >
                      −
                    </button>
                    <span className="flex h-9 w-9 items-center justify-center text-sm font-medium text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.color, item.quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center text-neutral-600 hover:text-neutral-900"
                      aria-label="Tăng số lượng"
                    >
                      +
                    </button>
                  </div>

                  <span className="w-28 shrink-0 text-right font-semibold text-neutral-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.color)}
                    aria-label="Xoá sản phẩm khỏi giỏ hàng"
                    className="text-neutral-400 hover:text-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl bg-neutral-100 p-6">
            <h2 className="mb-4 text-base font-bold text-neutral-900">Tóm tắt giỏ hàng</h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Tạm tính</span>
              <span className="font-medium text-neutral-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
              <span className="font-bold text-neutral-900">Tổng cộng</span>
              <span className="text-xl font-bold text-neutral-900">{formatCurrency(subtotal)}</span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Tiến hành thanh toán
            </button>
            <Link
              to="/products"
              className="mt-3 block text-center text-sm font-medium text-blue-600 hover:underline"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
