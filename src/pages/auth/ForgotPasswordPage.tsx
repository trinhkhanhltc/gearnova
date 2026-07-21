import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { FormMessage } from '../../components/ui/FormMessage'
import { InputField } from '../../components/ui/InputField'
import { LockIcon } from '../../components/ui/LockIcon'
import { forgotPassword } from '../../services/auth.service'
import type { ForgotPasswordPayload } from '../../types/auth.types'

const initialForm: ForgotPasswordPayload = {
  email: '',
}

export function ForgotPasswordPage() {
  const [form, setForm] = useState<ForgotPasswordPayload>(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      const response = await forgotPassword(form)
      setSuccessMessage(response.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi liên kết thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <LockIcon />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-neutral-900">Quên mật khẩu?</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {successMessage && <FormMessage variant="success">{successMessage}</FormMessage>}
          {error && <FormMessage variant="error">{error}</FormMessage>}

          <InputField
            id="forgot-password-email"
            label="Email"
            type="email"
            placeholder="ban@gearnova.vn"
            value={form.email}
            onChange={(event) => setForm({ email: event.target.value })}
            required
          />

          <Button type="submit" isLoading={isLoading}>
            Gửi liên kết đặt lại mật khẩu
          </Button>

          <p className="text-center text-sm text-neutral-600">
            Nhớ ra mật khẩu rồi?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
              Quay lại đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
