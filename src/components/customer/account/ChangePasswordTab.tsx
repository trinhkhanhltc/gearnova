import { useState } from 'react'
import type { FormEvent } from 'react'
import { FormMessage } from '../../ui/FormMessage'
import { InputField } from '../../ui/InputField'
import { changeMyPassword } from '../../../services/customer.service'

const initialForm = { currentPassword: '', newPassword: '', confirmPassword: '' }

export function ChangePasswordTab() {
  const [form, setForm] = useState(initialForm)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (form.newPassword !== form.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp với mật khẩu mới.')
      return
    }

    setIsSaving(true)
    try {
      const result = await changeMyPassword(form)
      setSuccessMessage(result.message)
      setForm(initialForm)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đổi mật khẩu thất bại. Vui lòng thử lại.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900">Đổi mật khẩu</h2>
      <p className="mt-1 text-sm text-neutral-500">Cập nhật mật khẩu đăng nhập của bạn</p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-5">
        {error && <FormMessage variant="error">{error}</FormMessage>}
        {successMessage && <FormMessage variant="success">{successMessage}</FormMessage>}

        <InputField
          label="Mật khẩu hiện tại"
          type="password"
          required
          value={form.currentPassword}
          onChange={(event) => setForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
        />
        <InputField
          label="Mật khẩu mới"
          type="password"
          required
          value={form.newPassword}
          onChange={(event) => setForm((prev) => ({ ...prev, newPassword: event.target.value }))}
          placeholder="Tối thiểu 8 ký tự"
        />
        <InputField
          label="Xác nhận mật khẩu mới"
          type="password"
          required
          value={form.confirmPassword}
          onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
        />

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Đang lưu...' : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  )
}
