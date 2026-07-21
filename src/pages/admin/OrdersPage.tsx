import { useEffect, useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { OrderQuickViewModal } from '../../components/admin/OrderQuickViewModal'
import { getOrders } from '../../services/order.service'
import { orderStatusFilters, orderStatusMeta } from '../../utils/statusMeta'
import { formatCurrency } from '../../utils/format'
import type { Order, OrderStatus } from '../../types/order.types'

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'tat-ca'>('tat-ca')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    getOrders({ status: statusFilter, search })
      .then((result) => {
        if (active) setOrders(result)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Không thể tải danh sách đơn hàng.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [statusFilter, search])

  return (
    <div>
      <div className="mb-6 border-b border-neutral-200 pb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Đơn hàng</h1>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {orderStatusFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatusFilter(filter.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              statusFilter === filter.value
                ? 'bg-blue-50 text-blue-700'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="relative mb-6 max-w-xl">
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
          placeholder="Tìm theo mã đơn hoặc tên khách hàng..."
          className="w-full rounded-xl border border-neutral-300 py-2.5 pl-10 pr-4 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-neutral-500">
              <tr>
                <th className="px-6 py-3 font-medium">Mã đơn</th>
                <th className="px-6 py-3 font-medium">Khách hàng</th>
                <th className="px-6 py-3 font-medium">Sản phẩm</th>
                <th className="px-6 py-3 font-medium">Trạng thái</th>
                <th className="px-6 py-3 text-right font-medium">Tổng tiền</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 font-medium text-neutral-900">{order.id}</td>
                  <td className="px-6 py-4 text-neutral-700">{order.customerName}</td>
                  <td className="px-6 py-4 text-neutral-700">{order.productName}</td>
                  <td className="px-6 py-4">
                    <Badge tone={orderStatusMeta[order.status].tone}>{orderStatusMeta[order.status].label}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-neutral-900">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">
                    Không tìm thấy đơn hàng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <OrderQuickViewModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  )
}
