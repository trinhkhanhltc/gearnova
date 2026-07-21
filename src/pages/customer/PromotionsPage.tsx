import { useEffect, useState } from 'react'
import { getPromotions } from '../../services/promotion.service'
import type { Promotion } from '../../types/promotion.types'

export function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    getPromotions()
      .then(setPromotions)
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải danh sách ưu đãi.'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // Trình duyệt không hỗ trợ clipboard API — bỏ qua, vẫn hiển thị trạng thái đã copy để không chặn luồng dùng thử.
    }
    setCopiedCode(code)
    setTimeout(() => setCopiedCode((current) => (current === code ? null : current)), 2000)
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Ưu đãi & mã giảm giá</h1>

      {isLoading && <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {promotions.map((promo) => (
            <div key={promo.id} className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-bold text-blue-600">{promo.title}</h2>
              <p className="mt-2 text-sm font-medium text-neutral-900">{promo.description}</p>
              <p className="mt-1 text-sm text-neutral-500">{promo.note}</p>
              <div className="mt-4 flex items-center justify-between border-t border-dashed border-neutral-200 pt-4">
                <span className="font-mono text-sm font-semibold text-neutral-900">{promo.code}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(promo.code)}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {copiedCode === promo.code ? 'Đã sao chép' : 'Sao chép mã'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
