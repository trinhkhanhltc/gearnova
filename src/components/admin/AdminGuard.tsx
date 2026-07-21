import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../../utils/authStorage'

export interface AdminGuardProps {
  children: ReactNode
}

/**
 * Bảo vệ đơn giản cho toàn bộ route /admin/*: chưa đăng nhập (chưa có token
 * mock trong localStorage) thì không cho vào, điều hướng về trang đăng nhập.
 */
export function AdminGuard({ children }: AdminGuardProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
