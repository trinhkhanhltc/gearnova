import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../../components/auth/AuthLayout'
import { Button } from '../../components/ui/Button'
import { CheckboxField } from '../../components/ui/CheckboxField'
import { FormMessage } from '../../components/ui/FormMessage'
import { InputField } from '../../components/ui/InputField'
import { login } from '../../services/auth.service'
import { setAuthToken } from '../../utils/authStorage'
import type { LoginPayload } from '../../types/auth.types'

const initialForm: LoginPayload = {
  email: '',
  password: '',
  rememberMe: false,
}

export function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginPayload>(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await login(form)
      setAuthToken(response.token)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      heading="Nền tảng quản lý & mua sắm công nghệ hiện đại"
      description="Theo dõi doanh thu, quản lý sản phẩm và cập nhật tin công nghệ mới nhất — tất cả trong một nơi."
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-neutral-900">Chào mừng trở lại</h2>
        <p className="text-sm text-neutral-500">Đăng nhập để tiếp tục quản lý hoặc mua sắm tại GearNova</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {error && <FormMessage variant="error">{error}</FormMessage>}

        <InputField
          id="login-email"
          label="Email"
          type="email"
          placeholder="ban@gearnova.vn"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />

        <InputField
          id="login-password"
          label="Mật khẩu"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          required
        />

        <div className="flex items-center justify-between">
          <CheckboxField
            id="login-remember"
            checked={form.rememberMe}
            onChange={(checked) => setForm((prev) => ({ ...prev, rememberMe: checked }))}
          >
            Ghi nhớ đăng nhập
          </CheckboxField>

          <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="submit" isLoading={isLoading}>
          Đăng nhập
        </Button>

        <p className="text-center text-sm text-neutral-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
