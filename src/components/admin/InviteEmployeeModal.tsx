import { useState } from 'react'
import type { FormEvent } from 'react'
import { FormMessage } from '../ui/FormMessage'
import { Modal } from '../ui/Modal'
import { inviteEmployee } from '../../services/staff.service'
import type { Staff, StaffRole } from '../../types/staff.types'

export interface InviteEmployeeModalProps {
  open: boolean
  onClose: () => void
  onInvited: (staff: Staff) => void
}

const roleOptions: Array<{ value: StaffRole; label: string }> = [
  { value: 'quan-ly', label: 'Quản lý' },
  { value: 'nv-ban-hang', label: 'Nhân viên bán hàng' },
  { value: 'nv-kho', label: 'Nhân viên kho' },
]

export function InviteEmployeeModal({ open, onClose, onInvited }: InviteEmployeeModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<StaffRole>('nv-ban-hang')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setEmail('')
    setRole('nv-ban-hang')
    setError(null)
    onClose()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const staff = await inviteEmployee({ email, role })
      onInvited(staff)
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mời nhân viên thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Mời nhân viên mới</h2>
          <p className="mt-1 text-sm text-neutral-500">Gửi lời mời qua email để nhân viên tham gia GearNova</p>
        </div>
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

        <div className="flex flex-col gap-2">
          <label htmlFor="invite-email" className="text-sm font-medium text-neutral-900">
            Email nhân viên
          </label>
          <input
            id="invite-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nhanvien@gearnova.vn"
            className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-neutral-900">Vai trò</span>
          <div className="flex flex-col gap-2">
            {roleOptions.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
                  role === option.value ? 'border-blue-600 text-blue-700' : 'border-neutral-300 text-neutral-700'
                }`}
              >
                <input
                  type="radio"
                  name="invite-role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={() => setRole(option.value)}
                  className="h-4 w-4 scheme-light text-blue-600 focus:ring-blue-500"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-neutral-300 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Đang gửi...' : 'Gửi lời mời'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
