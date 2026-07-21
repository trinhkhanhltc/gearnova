import { mockAuthUser } from '../mocks/auth.mock'
import type {
  AuthResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  RegisterPayload,
} from '../types/auth.types'

// Backend chưa tồn tại nên các hàm dưới đây mock trực tiếp response.
// Khi backend sẵn sàng: bỏ phần mock, dùng dòng apiClient.post(...) đã comment sẵn.

const MOCK_DELAY_MS = 600

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.post<AuthResponse>('/auth/login', payload)

  if (!payload.email || !payload.password) {
    throw new Error('Vui lòng nhập đầy đủ email và mật khẩu.')
  }
  if (payload.password.length < 6) {
    throw new Error('Email hoặc mật khẩu không đúng.')
  }

  return delay({
    user: { ...mockAuthUser, email: payload.email },
    token: 'mock-jwt-token',
  })
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.post<AuthResponse>('/auth/register', payload)

  if (!payload.fullName || !payload.email || !payload.phone) {
    throw new Error('Vui lòng nhập đầy đủ thông tin bắt buộc.')
  }
  if (payload.password.length < 8) {
    throw new Error('Mật khẩu phải có ít nhất 8 ký tự.')
  }
  if (payload.password !== payload.confirmPassword) {
    throw new Error('Mật khẩu xác nhận không khớp.')
  }
  if (!payload.acceptTerms) {
    throw new Error('Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.')
  }

  return delay({
    user: {
      ...mockAuthUser,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
    },
    token: 'mock-jwt-token',
  })
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.post<ForgotPasswordResponse>('/auth/forgot-password', payload)

  if (!payload.email) {
    throw new Error('Vui lòng nhập email đã đăng ký.')
  }

  return delay({
    message: `Nếu email ${payload.email} tồn tại trong hệ thống, liên kết đặt lại mật khẩu đã được gửi tới hộp thư của bạn.`,
  })
}
