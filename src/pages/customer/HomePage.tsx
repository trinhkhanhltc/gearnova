import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArticleCard } from '../../components/customer/ArticleCard'
import { ProductCard } from '../../components/customer/ProductCard'
import { ImageDropzone } from '../../components/ui/ImageDropzone'
import { useCart } from '../../contexts/CartContext'
import { mockPublicProductCategories } from '../../mocks/products.mock'
import { getFeaturedProducts } from '../../services/product.service'
import { getFeaturedPosts } from '../../services/post.service'
import type { Product } from '../../types/product.types'
import type { Post } from '../../types/post.types'

export function HomePage() {
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([getFeaturedProducts(), getFeaturedPosts(3)])
      .then(([productsResult, postsResult]) => {
        setProducts(productsResult)
        setPosts(postsResult)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu trang chủ.'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div>
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              Sắp ra mắt
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl">
              Khám phá công nghệ mới nhất 2026
            </h1>
            <p className="mt-4 max-w-md text-neutral-600">
              Điện thoại, laptop và thiết bị thông minh mới nhất — cập nhật tin tức và mua sắm thuận tiện ngay tại
              GearNova.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Mua ngay
              </Link>
              <Link
                to="/articles"
                className="rounded-xl border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
              >
                Xem tin công nghệ
              </Link>
            </div>
          </div>
          <ImageDropzone label="Ảnh sản phẩm nổi bật" className="min-h-[320px] w-full" />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {mockPublicProductCategories.map((category) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-blue-600 hover:text-blue-600"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {error && <p className="mx-auto max-w-7xl px-6 text-sm text-red-600">{error}</p>}

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">Sản phẩm nổi bật</h2>
          <Link to="/products" className="text-sm font-medium text-blue-600 hover:underline">
            Xem tất cả →
          </Link>
        </div>
        {isLoading ? (
          <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="featured"
                onAddToCart={(item) => addItem({ productId: item.id, name: item.name, price: item.price, quantity: 1 })}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">Tin công nghệ mới nhất</h2>
          <Link to="/articles" className="text-sm font-medium text-blue-600 hover:underline">
            Xem tất cả →
          </Link>
        </div>
        {isLoading ? (
          <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
