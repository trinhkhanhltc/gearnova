import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArticleCard } from '../../components/customer/ArticleCard'
import { Badge } from '../../components/ui/Badge'
import { ImageDropzone } from '../../components/ui/ImageDropzone'
import { getPostById, getPublicPosts } from '../../services/post.service'
import type { Post } from '../../types/post.types'

export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [related, setRelated] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    setIsLoading(true)
    Promise.all([getPostById(id), getPublicPosts()])
      .then(([postResult, allPosts]) => {
        if (!active) return
        setPost(postResult)
        setRelated(allPosts.filter((item) => item.id !== id).slice(0, 3))
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Không thể tải bài viết.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  if (isLoading) return <p className="mx-auto max-w-4xl px-6 py-10 text-sm text-neutral-500">Đang tải dữ liệu...</p>
  if (error) return <p className="mx-auto max-w-4xl px-6 py-10 text-sm text-red-600">{error}</p>
  if (!post) return <p className="mx-auto max-w-4xl px-6 py-10 text-sm text-neutral-500">Không tìm thấy bài viết.</p>

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-4 flex items-center gap-2 text-sm text-neutral-500">
        <Link to="/articles" className="hover:text-neutral-700">
          Tin công nghệ
        </Link>
        {post.tag && (
          <>
            <span>/</span>
            <span className="font-medium text-neutral-900">{post.tag}</span>
          </>
        )}
      </div>

      {post.tag && (
        <div className="mb-3">
          <Badge tone="blue">{post.tag}</Badge>
        </div>
      )}

      <h1 className="text-3xl font-bold text-neutral-900">{post.title}</h1>
      <p className="mt-3 text-sm text-neutral-500">
        Đăng ngày {post.publishedAt} · {post.author ?? 'Đội ngũ biên tập GearNova'}
      </p>

      <ImageDropzone label="Ảnh minh hoạ bài viết" className="mt-6 min-h-[320px] w-full" />

      <div className="mt-6 space-y-4 text-neutral-700">
        {(post.content ?? '').split('\n\n').map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 text-xl font-bold text-neutral-900">Bài viết liên quan</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
