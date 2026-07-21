import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { getMyProfile } from '../../services/customer.service'
import { clearAuthToken } from '../../utils/authStorage'
import type { CustomerProfile } from '../../types/customer.types'

const navLinks = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/products', label: 'Sản phẩm', end: false },
  { to: '/articles', label: 'Tin công nghệ', end: false },
  { to: '/promotions', label: 'Khuyến mãi', end: false },
]

/**
 * Header dùng chung cho toàn bộ storefront khách hàng. Ảnh thiết kế chỉ thể
 * hiện đủ ô tìm kiếm + icon giỏ hàng ở trang chủ/chi tiết sản phẩm, các trang
 * còn lại chỉ có avatar — nhưng để trải nghiệm nhất quán (giống cách
 * `AdminTopbar` đã áp dụng cho khu vực admin), header này dùng đồng nhất cho
 * mọi trang customer.
 */
export function CustomerHeader() {
  const navigate = useNavigate()
  const { totalQuantity } = useCart()
  const [search, setSearch] = useState('')
  const [profile, setProfile] = useState<CustomerProfile | null>(null)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getMyProfile().then(setProfile).catch(() => setProfile(null))
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const keyword = search.trim()
    navigate(keyword ? `/products?search=${encodeURIComponent(keyword)}` : '/products')
  }

  const initials = profile
    ? profile.fullName
        .split(' ')
        .slice(-2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : ''

  const handleLogout = () => {
    setIsAccountMenuOpen(false)
    clearAuthToken()
    navigate('/login')
  }

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            G
          </span>
          <span className="text-lg font-bold text-neutral-900">GearNova</span>
        </Link>

        <nav className="flex shrink-0 items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'text-blue-600' : 'text-neutral-700 hover:text-neutral-900')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={handleSearchSubmit} className="ml-auto hidden max-w-sm flex-1 sm:block">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm sản phẩm..."
              className="w-full rounded-xl border border-neutral-300 bg-neutral-50 py-2 pl-10 pr-4 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-4 sm:ml-0">
          <Link
            to="/cart"
            aria-label="Giỏ hàng"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6L4.5 3H2" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            {totalQuantity > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                {totalQuantity}
              </span>
            )}
          </Link>

          <div className="relative" ref={accountMenuRef}>
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen((prev) => !prev)}
              aria-label="Tài khoản của tôi"
              aria-expanded={isAccountMenuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700"
            >
              {initials}
            </button>

            {isAccountMenuOpen && profile && (
              <div className="absolute right-0 top-12 z-20 w-64 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg">
                <div className="border-b border-neutral-100 px-3 py-3">
                  <p className="text-sm font-semibold text-neutral-900">{profile.fullName}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">{profile.email}</p>
                </div>
                <Link
                  to="/account"
                  onClick={() => setIsAccountMenuOpen(false)}
                  className="mt-1 block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Tài khoản của tôi
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
