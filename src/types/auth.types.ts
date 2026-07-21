export interface AuthUser {
  id: string
  fullName: string
  email: string
  phone: string
}

export interface LoginPayload {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterPayload {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface ForgotPasswordPayload {
  email: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export interface ForgotPasswordResponse {
  message: string
}
