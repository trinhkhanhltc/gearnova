import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { ImageDropzone } from '../../components/ui/ImageDropzone'
import { deletePost, getPosts } from '../../services/post.service'
import { postStatusMeta } from '../../utils/statusMeta'
import type { Post, PostStatus } from '../../types/post.types'

const tabs: Array<{ value: PostStatus | 'tat-ca'; label: string }> = [
  { value: 'tat-ca', label: 'Tất cả' },
  { value: 'da-dang', label: 'Đã đăng' },
  { value: 'ban-nhap', label: 'Bản nháp' },
]

export function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'tat-ca'>('tat-ca')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPosts = () => {
    setIsLoading(true)
    getPosts(statusFilter)
      .then(setPosts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải danh sách bài viết.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Xoá bài viết này?')) return
    await deletePost(id)
    loadPosts()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Bài viết</h1>
        <Link
          to="/admin/posts/new"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Viết bài mới
        </Link>
      </div>

      <div className="mb-6 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              statusFilter === tab.value ? 'bg-blue-50 text-blue-700' : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
              <ImageDropzone label="ảnh" className="h-20 w-20 shrink-0 p-2 text-[11px]" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-neutral-900">{post.title}</h3>
                  <Badge tone={postStatusMeta[post.status].tone}>{postStatusMeta[post.status].label}</Badge>
                </div>
                <p className="mt-1 text-sm text-neutral-500">
                  {post.publishedAt ?? '—'} · {post.views !== null ? `${(post.views / 1000).toFixed(1)}K lượt xem` : '— lượt xem'}
                </p>
              </div>
              <div className="flex shrink-0 gap-4 text-sm font-medium">
                <Link to={`/admin/posts/${post.id}`} className="text-neutral-700 hover:underline">
                  Sửa
                </Link>
                <button type="button" onClick={() => handleDelete(post.id)} className="text-red-600 hover:underline">
                  Xoá
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p className="text-sm text-neutral-500">Không có bài viết nào.</p>}
        </div>
      )}
    </div>
  )
}
