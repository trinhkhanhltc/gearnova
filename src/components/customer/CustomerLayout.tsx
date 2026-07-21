import { Outlet } from 'react-router-dom'
import { CustomerFooter } from './CustomerFooter'
import { CustomerHeader } from './CustomerHeader'

/**
 * Layout chung cho toàn bộ storefront khách hàng: header + nội dung trang
 * (qua <Outlet />) + footer.
 */
export function CustomerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <CustomerHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  )
}
