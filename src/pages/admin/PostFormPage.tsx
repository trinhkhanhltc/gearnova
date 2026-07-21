import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { FormMessage } from '../../components/ui/FormMessage'
import { ImageDropzone } from '../../components/ui/ImageDropzone'
import { createPost, deletePost, getPostById, updatePost } from '../../services/post.service'
import { postStatusMeta } from '../../utils/statusMeta'
import type { PostStatus } from '../../types/post.types'

const initialForm = {
  title: '',
  excerpt: '',
  content: '',
  status: 'ban-nhap' as PostStatus,
}

export function PostFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(isEditMode)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    let active = true
    setIsLoading(true)
    getPostById(id)
      .then((post) => {
        if (!active) return
        if (!post) {
          setNotFound(true)
          return
        }
        setForm({
          title: post.title,
          excerpt: post.excerpt ?? '',
          content: post.content ?? '',
          status: post.status,
        })
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSaving(true)
    try {
      if (isEditMode && id) {
        await updatePost(id, form)
      } else {
        await createPost(form)
      }
      navigate('/admin/posts')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu bài viết thất bại. Vui lòng thử lại.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    if (!window.confirm('Xoá bài viết này?')) return
    await deletePost(id)
    navigate('/admin/posts')
  }

  if (isLoading) return <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>
  if (notFound) return <p className="text-sm text-neutral-500">Không tìm thấy bài viết.</p>

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
        <Link to="/admin/posts" className="flex items-center gap-1 hover:text-neutral-700">
          ‹ Bài viết
        </Link>
        <span>/</span>
        <span className="text-neutral-700">{isEditMode ? form.title || 'Sửa bài viết' : 'Viết bài mới'}</span>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-neutral-900">{isEditMode ? 'Sửa bài viết' : 'Viết bài mới'}</h1>
        <Badge tone={postStatusMeta[form.status].tone}>{postStatusMeta[form.status].label}</Badge>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {error && (
          <div className="lg:col-span-2">
            <FormMessage variant="error">{error}</FormMessage>
          </div>
        )}

        <div className="space-y-4">
          <ImageDropzone label="Kéo thả ảnh đại diện bài viết" className="min-h-[240px]" />

          <div className="flex flex-col gap-2">
            <label htmlFor="post-status" className="text-sm font-medium text-neutral-900">
              Trạng thái
            </label>
            <select
              id="post-status"
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as PostStatus }))}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="ban-nhap">Bản nháp</option>
              <option value="da-dang">Đã đăng</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="post-title" className="text-sm font-medium text-neutral-900">
              Tiêu đề
            </label>
            <input
              id="post-title"
              required
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="VD: Nova Phone 13 lộ diện với chip thế hệ mới"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="post-excerpt" className="text-sm font-medium text-neutral-900">
              Tóm tắt
            </label>
            <textarea
              id="post-excerpt"
              rows={2}
              value={form.excerpt}
              onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
              placeholder="Tóm tắt ngắn gọn nội dung bài viết..."
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="post-content" className="text-sm font-medium text-neutral-900">
              Nội dung bài viết
            </label>
            <textarea
              id="post-content"
              required
              rows={10}
              value={form.content}
              onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              placeholder="Nội dung chi tiết bài viết..."
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-between lg:col-span-2">
          {isEditMode ? (
            <button type="button" onClick={handleDelete} className="text-sm font-medium text-red-600 hover:underline">
              Xoá bài viết này
            </button>
          ) : (
            <span />
          )}

          <div className="flex gap-3">
            <Link
              to="/admin/posts"
              className="rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              Huỷ
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Đang lưu...' : isEditMode ? 'Lưu thay đổi' : 'Đăng bài viết'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
