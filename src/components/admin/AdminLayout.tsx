import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { clearAuthToken } from '../../utils/authStorage'
import { AdminSidebar } from './AdminSidebar'
import { AdminTopbar } from './AdminTopbar'
import { LogoutConfirmModal } from './LogoutConfirmModal'

/**
 * Layout chung cho toàn bộ khu vực admin: sidebar bên trái + topbar trên
 * cùng, nội dung từng trang render qua <Outlet />.
 */
export function AdminLayout() {
  const navigate = useNavigate()
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  const handleConfirmLogout = () => {
    clearAuthToken()
    setLogoutModalOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar
        userName="Nguyễn Văn A"
        userRole="Quản lý cửa hàng"
        onLogoutClick={() => setLogoutModalOpen(true)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar userName="Nguyễn Văn A" notificationCount={4} />
        <main className="flex-1 px-8 py-8">
          <Outlet />
        </main>
      </div>

      <LogoutConfirmModal
        open={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  )
}
