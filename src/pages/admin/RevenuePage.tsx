import { useEffect, useState } from 'react'
import { RevenueAreaChart } from '../../components/admin/RevenueAreaChart'
import { exportRevenueReport, getRevenueOverview } from '../../services/revenue.service'
import { formatCurrency } from '../../utils/format'
import type { RevenueOverview } from '../../types/revenue.types'

export function RevenuePage() {
  const [data, setData] = useState<RevenueOverview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exportMessage, setExportMessage] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    let active = true
    getRevenueOverview()
      .then((result) => {
        if (active) setData(result)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu doanh thu.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const handleExport = async () => {
    setIsExporting(true)
    setExportMessage(null)
    try {
      const result = await exportRevenueReport()
      setExportMessage(result.message)
    } catch (err) {
      setExportMessage(err instanceof Error ? err.message : 'Xuất báo cáo thất bại.')
    } finally {
      setIsExporting(false)
    }
  }

  const maxAmount = data ? Math.max(...data.revenueByCategory.map((item) => item.amount)) : 0

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Doanh thu</h1>
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExporting ? 'Đang xuất...' : 'Xuất báo cáo'}
        </button>
      </div>

      {exportMessage && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {exportMessage}
        </div>
      )}

      {isLoading && <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <p className="text-sm text-neutral-500">Doanh thu tháng này</p>
              <p className="mt-2 text-2xl font-bold text-neutral-900">{data.revenueThisMonth}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <p className="text-sm text-neutral-500">Lợi nhuận ước tính</p>
              <p className="mt-2 text-2xl font-bold text-neutral-900">{data.estimatedProfit}</p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <p className="text-sm text-neutral-500">Giá trị đơn hàng trung bình</p>
              <p className="mt-2 text-2xl font-bold text-neutral-900">{data.averageOrderValue}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-2 text-base font-semibold text-neutral-900">Doanh thu theo tháng</h2>
            <RevenueAreaChart data={data.revenueByMonth} height={300} />
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-base font-semibold text-neutral-900">Doanh thu theo danh mục</h2>
            <div className="space-y-4">
              {data.revenueByCategory.map((item) => (
                <div key={item.category}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-900">{item.category}</span>
                    <span className="font-semibold text-neutral-900">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
