import { Link } from 'react-router-dom'

export interface AdminTopbarProps {
  userName: string
  notificationCount?: number
}

/**
 * Topbar dùng chung cho toàn bộ trang admin (tìm kiếm + chuông thông báo +
 * tên người dùng). Ảnh gốc chỉ thể hiện topbar này ở Tổng quan và Sản phẩm,
 * nhưng theo yêu cầu layout chung cho khu vực admin nên áp dụng đồng nhất
 * cho tất cả các trang.
 */
export function AdminTopbar({ userName, notificationCount = 0 }: AdminTopbarProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-8 py-4">
      <div className="relative w-full max-w-md">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm, đơn hàng..."
          className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-4 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Thông báo"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              {notificationCount}
            </span>
          )}
        </button>

        <Link to="/admin/profile" className="flex items-center gap-2 hover:opacity-80">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
            {userName
              .split(' ')
              .slice(-2)
              .map((part) => part[0])
              .join('')
              .toUpperCase()}
          </span>
          <span className="text-sm font-medium text-neutral-900">{userName}</span>
        </Link>
      </div>
    </header>
  )
}
