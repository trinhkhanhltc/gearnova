import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartItem } from '../types/cart.types'

const CART_STORAGE_KEY = 'gearnova_cart'

/**
 * Giỏ hàng phía khách hàng: chỉ là state cục bộ của frontend (lưu tạm ở
 * localStorage), KHÔNG có API riêng — trang Giỏ hàng (`/cart`) và trang
 * Thanh toán đọc thẳng nội dung giỏ hàng để hiển thị + tạo đơn (API thật ở
 * `POST /orders`, xem `order.service.ts`).
 *
 * Giỏ hàng khởi tạo sẵn 2 sản phẩm mẫu (Tai nghe Nova X2 + Đồng hồ Nova Fit)
 * để khớp đúng số "2" trên icon giỏ hàng và danh sách sản phẩm trong ảnh
 * `customer-thanh-toan.png` — đây là giả định để có dữ liệu demo xuyên suốt
 * các màn hình mà không cần thao tác "Thêm vào giỏ" trước.
 */
const defaultCartItems: CartItem[] = [
  { productId: 'NV-NX2-BLK', name: 'Tai nghe chống ồn Nova X2', price: 2490000, quantity: 1, color: 'Đen' },
  { productId: 'NV-NFIT-01', name: 'Đồng hồ thông minh Nova Fit', price: 3290000, quantity: 1 },
]

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return defaultCartItems
    const parsed = JSON.parse(raw) as CartItem[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultCartItems
  } catch {
    return defaultCartItems
  }
}

interface CartContextValue {
  items: CartItem[]
  totalQuantity: number
  subtotal: number
  addItem: (item: CartItem) => void
  updateQuantity: (productId: string, color: string | undefined, quantity: number) => void
  removeItem: (productId: string, color: string | undefined) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadInitialCart)

  const persist = useCallback((next: CartItem[]) => {
    setItems(next)
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addItem = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((it) => it.productId === item.productId && it.color === item.color)
        let next: CartItem[]
        if (existingIndex >= 0) {
          next = [...prev]
          next[existingIndex] = { ...next[existingIndex], quantity: next[existingIndex].quantity + item.quantity }
        } else {
          next = [...prev, item]
        }
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    [],
  )

  const updateQuantity = useCallback(
    (productId: string, color: string | undefined, quantity: number) => {
      setItems((prev) => {
        const next = prev.map((item) =>
          item.productId === productId && item.color === color ? { ...item, quantity: Math.max(1, quantity) } : item,
        )
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    [],
  )

  const removeItem = useCallback(
    (productId: string, color: string | undefined) => {
      setItems((prev) => {
        const next = prev.filter((item) => !(item.productId === productId && item.color === color))
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    [],
  )

  const clearCart = useCallback(() => {
    persist([])
  }, [persist])

  const totalQuantity = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])

  const value = useMemo(
    () => ({ items, totalQuantity, subtotal, addItem, updateQuantity, removeItem, clearCart }),
    [items, totalQuantity, subtotal, addItem, updateQuantity, removeItem, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart phải được dùng bên trong <CartProvider>.')
  return ctx
}
