const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

interface RequestOptions extends RequestInit {
  body?: BodyInit | null
}

async function request<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    const message =
      (data as { message?: string } | null)?.message ?? `Yêu cầu thất bại (mã lỗi ${response.status})`
    throw new Error(message)
  }

  return response.json() as Promise<TResponse>
}

/**
 * Client fetch dùng chung cho toàn bộ service. Khi backend thật đã sẵn sàng,
 * chỉ cần đổi biến môi trường VITE_API_BASE_URL, không cần sửa từng service.
 */
export const apiClient = {
  get: <TResponse>(path: string) => request<TResponse>(path, { method: 'GET' }),
  post: <TResponse>(path: string, body?: unknown) =>
    request<TResponse>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: <TResponse>(path: string, body?: unknown) =>
    request<TResponse>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <TResponse>(path: string) => request<TResponse>(path, { method: 'DELETE' }),
}
