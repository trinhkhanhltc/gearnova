import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { FormMessage } from '../../components/ui/FormMessage'
import { ImageDropzone } from '../../components/ui/ImageDropzone'
import { getMyAdminProfile, updateMyAdminProfile } from '../../services/adminProfile.service'
import type { AdminProfile } from '../../types/staff.types'

/**
 * Hồ sơ cá nhân của admin đang đăng nhập — chưa có ảnh thiết kế riêng, dựng
 * theo đúng pattern tab "Thông tin cá nhân" bên customer
 * (`AccountSettingsPage.tsx`) để nhất quán giữa 2 khu vực.
 */
export function AdminProfilePage() {
  const [form, setForm] = useState<AdminProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    getMyAdminProfile()
      .then(setForm)
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải hồ sơ cá nhân.'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form) return
    setError(null)
    setSuccessMessage(null)
    setIsSaving(true)
    try {
      const updated = await updateMyAdminProfile(form)
      setForm(updated)
      setSuccessMessage('Đã lưu thay đổi hồ sơ cá nhân.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thay đổi thất bại. Vui lòng thử lại.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6 border-b border-neutral-200 pb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Hồ sơ cá nhân</h1>
        <p className="mt-1 text-sm text-neutral-500">Thông tin tài khoản của bạn trong hệ thống quản trị</p>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>}

      {!isLoading && form && (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {error && <FormMessage variant="error">{error}</FormMessage>}
          {successMessage && <FormMessage variant="success">{successMessage}</FormMessage>}

          <div className="flex items-center gap-4">
            <ImageDropzone label="Ảnh đại diện" variant="circle" className="h-24 w-24 shrink-0" />
            <div>
              <p className="cursor-pointer text-sm font-medium text-blue-600 hover:underline">Đổi ảnh đại diện</p>
              <p className="text-xs text-neutral-500">JPG hoặc PNG, tối đa 5MB</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-profile-fullname" className="text-sm font-medium text-neutral-900">
                Họ và tên
              </label>
              <input
                id="admin-profile-fullname"
                required
                value={form.fullName}
                onChange={(event) => setForm((prev) => (prev ? { ...prev, fullName: event.target.value } : prev))}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="admin-profile-phone" className="text-sm font-medium text-neutral-900">
                Số điện thoại
              </label>
              <input
                id="admin-profile-phone"
                required
                value={form.phone}
                onChange={(event) => setForm((prev) => (prev ? { ...prev, phone: event.target.value } : prev))}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="admin-profile-email" className="text-sm font-medium text-neutral-900">
                Email
              </label>
              <input
                id="admin-profile-email"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((prev) => (prev ? { ...prev, email: event.target.value } : prev))}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="admin-profile-role" className="text-sm font-medium text-neutral-900">
                Vai trò
              </label>
              <input
                id="admin-profile-role"
                readOnly
                disabled
                value={form.role}
                className="w-full cursor-not-allowed rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm text-neutral-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null)
                setSuccessMessage(null)
                getMyAdminProfile().then(setForm)
              }}
              className="rounded-xl border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              Huỷ
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
