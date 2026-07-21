import { Link, NavLink } from 'react-router-dom'

const menuItems = [
  { to: '/admin/dashboard', label: 'Tổng quan' },
  { to: '/admin/products', label: 'Sản phẩm' },
  { to: '/admin/orders', label: 'Đơn hàng' },
  { to: '/admin/customers', label: 'Khách hàng' },
  { to: '/admin/posts', label: 'Bài viết' },
  { to: '/admin/revenue', label: 'Doanh thu' },
  { to: '/admin/settings', label: 'Cài đặt' },
]

export interface AdminSidebarProps {
  userName: string
  userRole: string
  onLogoutClick: () => void
}

export function AdminSidebar({ userName, userRole, onLogoutClick }: AdminSidebarProps) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col justify-between border-r border-neutral-200 bg-white py-6">
      <div>
        <div className="flex items-center gap-3 px-6 pb-8">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white">
            G
          </span>
          <span className="text-lg font-semibold text-neutral-900">GearNova</span>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'border-l-2 border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-l-2 border-transparent text-neutral-600 hover:bg-neutral-50'
                }`
              }
            >
              <span className={`h-1.5 w-1.5 rounded-full bg-current`} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mx-3 flex items-center justify-between gap-2 rounded-xl bg-neutral-50 px-3 py-3">
        <Link to="/admin/profile" className="flex items-center gap-2 hover:opacity-80">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
            {userName
              .split(' ')
              .slice(-2)
              .map((part) => part[0])
              .join('')
              .toUpperCase()}
          </span>
          <div>
            <p className="text-sm font-semibold text-neutral-900">{userName}</p>
            <p className="text-xs text-neutral-500">{userRole}</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={onLogoutClick}
          aria-label="Đăng xuất"
          className="text-red-500 hover:text-red-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  )
}
