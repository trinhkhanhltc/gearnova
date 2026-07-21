import { useEffect, useState } from 'react'
import { ArticleCard } from '../../components/customer/ArticleCard'
import { getPublicPosts } from '../../services/post.service'
import type { Post } from '../../types/post.types'

export function ArticlesPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPublicPosts()
      .then(setPosts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải danh sách tin công nghệ.'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Tin công nghệ</h1>

      {isLoading && <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
