import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../../components/customer/ProductCard'
import { getPublicProducts } from '../../services/product.service'
import type { Product, ProductPriceRange, ProductSortOption } from '../../types/product.types'

const priceRangeOptions: Array<{ value: ProductPriceRange; label: string }> = [
  { value: 'duoi-2tr', label: 'Dưới ₫2.000.000' },
  { value: '2tr-10tr', label: '₫2.000.000 – ₫10.000.000' },
  { value: 'tren-10tr', label: 'Trên ₫10.000.000' },
]

export function ProductListPage() {
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const initialCategory = searchParams.get('category') ?? 'tat-ca'

  const [category, setCategory] = useState(initialCategory)
  const [priceRanges, setPriceRanges] = useState<ProductPriceRange[]>([])
  const [sort, setSort] = useState<ProductSortOption>('noi-bat')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setCategory(searchParams.get('category') ?? 'tat-ca')
  }, [searchParams])

  useEffect(() => {
    setIsLoading(true)
    getPublicProducts({ search, category, priceRanges, sort })
      .then((result) => {
        setProducts(result.items)
        setCategories(result.categories)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải danh sách sản phẩm.'))
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, priceRanges, sort])

  const togglePriceRange = (value: ProductPriceRange) => {
    setPriceRanges((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        <aside className="space-y-8">
          <div>
            <h3 className="mb-3 text-sm font-bold text-neutral-900">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setCategory('tat-ca')}
                  className={category === 'tat-ca' ? 'font-semibold text-blue-600' : 'text-neutral-600 hover:text-neutral-900'}
                >
                  Tất cả
                </button>
              </li>
              {categories.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => setCategory(item)}
                    className={category === item ? 'font-semibold text-blue-600' : 'text-neutral-600 hover:text-neutral-900'}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-neutral-900">Khoảng giá</h3>
            <ul className="space-y-2 text-sm">
              {priceRangeOptions.map((option) => (
                <li key={option.value}>
                  <label className="flex items-center gap-2 text-neutral-600">
                    <input
                      type="checkbox"
                      checked={priceRanges.includes(option.value)}
                      onChange={() => togglePriceRange(option.value)}
                      className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    {option.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-neutral-900">Tất cả sản phẩm</h1>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as ProductSortOption)}
              className="rounded-xl border border-neutral-300 px-4 py-2 text-sm text-neutral-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="noi-bat">Sắp xếp: Nổi bật</option>
              <option value="gia-tang-dan">Sắp xếp: Giá tăng dần</option>
              <option value="gia-giam-dan">Sắp xếp: Giá giảm dần</option>
            </select>
          </div>

          {isLoading && <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {!isLoading && !error && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} variant="grid" />
                ))}
              </div>
              {products.length === 0 && (
                <p className="mt-6 text-sm text-neutral-500">Không tìm thấy sản phẩm phù hợp.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
