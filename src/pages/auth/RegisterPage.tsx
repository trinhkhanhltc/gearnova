import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { Button } from '../../components/ui/Button'
import { CheckboxField } from '../../components/ui/CheckboxField'
import { FormMessage } from '../../components/ui/FormMessage'
import { InputField } from '../../components/ui/InputField'
import { register } from '../../services/auth.service'
import type { RegisterPayload } from '../../types/auth.types'

const initialForm: RegisterPayload = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
}

export function RegisterPage() {
  const [form, setForm] = useState<RegisterPayload>(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      const response = await register(form)
      setSuccessMessage(`Tạo tài khoản thành công. Chào mừng ${response.user.fullName} đến với GearNova!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tạo tài khoản thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      heading="Tham gia cộng đồng công nghệ GearNova"
      description="Mua sắm thuận tiện, cập nhật tin công nghệ mới nhất và theo dõi đơn hàng dễ dàng."
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-neutral-900">Tạo tài khoản mới</h2>
        <p className="text-sm text-neutral-500">Chỉ mất một phút để bắt đầu</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {successMessage && <FormMessage variant="success">{successMessage}</FormMessage>}
        {error && <FormMessage variant="error">{error}</FormMessage>}

        <InputField
          id="register-fullname"
          label="Họ và tên"
          type="text"
          placeholder="Nguyễn Văn A"
          value={form.fullName}
          onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
          required
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField
            id="register-email"
            label="Email"
            type="email"
            placeholder="ban@email.com"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <InputField
            id="register-phone"
            label="Số điện thoại"
            type="tel"
            placeholder="09xx xxx xxx"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InputField
            id="register-password"
            label="Mật khẩu"
            type="password"
            placeholder="Tối thiểu 8 ký tự"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          <InputField
            id="register-confirm-password"
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
            required
          />
        </div>

        <CheckboxField
          id="register-accept-terms"
          checked={form.acceptTerms}
          onChange={(checked) => setForm((prev) => ({ ...prev, acceptTerms: checked }))}
        >
          Tôi đồng ý với{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Chính sách bảo mật
          </a>{' '}
          của GearNova
        </CheckboxField>

        <Button type="submit" isLoading={isLoading}>
          Tạo tài khoản
        </Button>

        <p className="text-center text-sm text-neutral-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
