import type { ReactNode } from 'react'

export interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  maxWidthClassName?: string
}

/**
 * Khung modal dùng chung cho toàn bộ popup admin (đăng xuất, mời nhân viên,
 * thêm sản phẩm, xem nhanh đơn hàng).
 */
export function Modal({ open, onClose, children, maxWidthClassName = 'max-w-md' }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-500/60 p-4">
      <button
        type="button"
        aria-label="Đóng"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        tabIndex={-1}
      />
      <div className={`relative z-10 w-full ${maxWidthClassName} rounded-3xl bg-white p-8 shadow-xl`}>{children}</div>
    </div>
  )
}
