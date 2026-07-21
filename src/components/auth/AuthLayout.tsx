import type { ReactNode } from 'react'

export interface AuthLayoutProps {
  heading: string
  description: string
  children: ReactNode
}

/**
 * Khung 2 cột dùng chung cho màn Đăng nhập và Đăng ký:
 * cột trái nền xanh giới thiệu thương hiệu, cột phải chứa form.
 */
export function AuthLayout({ heading, description, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        <div className="flex flex-col justify-between bg-blue-600 p-10 text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-blue-600">
              G
            </span>
            <span className="text-lg font-semibold">GearNova</span>
          </div>

          <div className="my-10 space-y-4">
            <h1 className="text-3xl font-bold leading-tight">{heading}</h1>
            <p className="text-blue-100">{description}</p>
          </div>

          <p className="text-sm text-blue-200">© 2026 GearNova. Đã đăng ký bản quyền.</p>
        </div>

        <div className="flex flex-col justify-center px-8 py-10 sm:px-12">{children}</div>
      </div>
    </div>
  )
}
