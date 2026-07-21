import { useEffect, useState } from 'react'
import { getCustomerOverview } from '../../services/customer.service'
import { formatCurrency } from '../../utils/format'
import type { CustomerOverview } from '../../types/customer.types'

export function CustomersPage() {
  const [data, setData] = useState<CustomerOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getCustomerOverview()
      .then((result) => {
        if (active) setData(result)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Không thể tải danh sách khách hàng.')
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
      <div className="mb-6 border-b border-neutral-200 pb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Khách hàng</h1>
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <p className="text-sm text-neutral-500">Tổng khách hàng</p>
              <p className="mt-2 text-2xl font-bold text-neutral-900">{data.totalCustomers.toLocaleString('vi-VN')}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <p className="text-sm text-neutral-500">Khách hàng mới tháng này</p>
              <p className="mt-2 text-2xl font-bold text-neutral-900">{data.newThisMonth}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <p className="text-sm text-neutral-500">Khách hàng thân thiết</p>
              <p className="mt-2 text-2xl font-bold text-neutral-900">{data.loyalCustomers}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 text-neutral-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Khách hàng</th>
                  <th className="px-6 py-3 font-medium">Số điện thoại</th>
                  <th className="px-6 py-3 font-medium">Số đơn hàng</th>
                  <th className="px-6 py-3 font-medium">Tổng chi tiêu</th>
                  <th className="px-6 py-3 font-medium">Tham gia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {data.customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                          {customer.name
                            .split(' ')
                            .slice(-2)
                            .map((part) => part[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                        <div>
                          <p className="font-medium text-neutral-900">{customer.name}</p>
                          <p className="text-xs text-neutral-500">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-700">{customer.phone}</td>
                    <td className="px-6 py-4 text-neutral-700">{customer.ordersCount}</td>
                    <td className="px-6 py-4 font-semibold text-neutral-900">
                      {formatCurrency(customer.totalSpent)}
                    </td>
                    <td className="px-6 py-4 text-neutral-700">{customer.joinedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
