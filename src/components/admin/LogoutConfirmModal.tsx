import { Modal } from '../ui/Modal'

export interface LogoutConfirmModalProps {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function LogoutConfirmModal({ open, onCancel, onConfirm }: LogoutConfirmModalProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </span>

        <h2 className="mt-4 text-xl font-bold text-neutral-900">Đăng xuất khỏi GearNova?</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Bạn sẽ cần đăng nhập lại để tiếp tục quản lý cửa hàng.
        </p>

        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-neutral-300 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </Modal>
  )
}
