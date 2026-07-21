const TOKEN_KEY = 'gearnova_auth_token'

/**
 * Lưu trạng thái đăng nhập (mock) vào localStorage.
 * Dùng chung cho khu vực admin để bảo vệ route /admin/* đơn giản.
 * Khi có backend thật, thay giá trị lưu bằng JWT thật trả về từ API login.
 */
export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return Boolean(getAuthToken())
}
