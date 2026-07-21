import { useEffect, useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { CategoryDonutChart } from '../../components/admin/CategoryDonutChart'
import { RevenueAreaChart } from '../../components/admin/RevenueAreaChart'
import { StatCard } from '../../components/admin/StatCard'
import { getDashboardOverview } from '../../services/dashboard.service'
import { orderStatusMeta } from '../../utils/statusMeta'
import { formatCurrency } from '../../utils/format'
import type { DashboardOverview } from '../../types/dashboard.types'

export function DashboardPage() {
  const [data, setData] = useState<DashboardOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    getDashboardOverview()
      .then((result) => {
        if (active) setData(result)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu tổng quan.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Tổng quan</h1>
        <p className="mt-1 text-sm text-neutral-500">Chào mừng trở lại, đây là tình hình cửa hàng hôm nay.</p>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard {...data.stats.revenue} />
            <StatCard {...data.stats.newOrders} />
            <StatCard {...data.stats.newCustomers} />
            <StatCard {...data.stats.lowStock} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 lg:col-span-2">
              <h2 className="mb-2 text-base font-semibold text-neutral-900">Doanh thu theo tháng</h2>
              <RevenueAreaChart data={data.revenueByMonth} />
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="mb-2 text-base font-semibold text-neutral-900">Tỷ trọng danh mục</h2>
              <CategoryDonutChart data={data.categoryShare} />
              <ul className="mt-2 space-y-1 text-xs text-neutral-600">
                {data.categoryShare.map((item) => (
                  <li key={item.category} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.category}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-neutral-900">Đơn hàng gần đây</h2>
            <div className="divide-y divide-neutral-100">
              {data.recentOrders.map((order) => (
                <div key={order.id} className="grid grid-cols-5 items-center gap-4 py-3 text-sm">
                  <span className="font-medium text-neutral-900">{order.id}</span>
                  <span className="text-neutral-700">{order.customerName}</span>
                  <span className="text-neutral-700">{order.productName}</span>
                  <span>
                    <Badge tone={orderStatusMeta[order.status].tone}>{orderStatusMeta[order.status].label}</Badge>
                  </span>
                  <span className="text-right font-semibold text-neutral-900">{formatCurrency(order.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
