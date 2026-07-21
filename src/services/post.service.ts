import { mockPosts } from '../mocks/posts.mock'
import type { CreatePostPayload, Post, PostStatus } from '../types/post.types'

const MOCK_DELAY_MS = 500
let posts = [...mockPosts]
let postSeq = posts.length

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

export async function getPosts(status?: PostStatus | 'tat-ca'): Promise<Post[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<Post[]>(`/admin/posts?status=${status ?? ''}`)

  const result = status && status !== 'tat-ca' ? posts.filter((post) => post.status === status) : posts
  return delay(result)
}

export async function deletePost(id: string): Promise<{ message: string }> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.delete<{ message: string }>(`/admin/posts/${id}`)

  posts = posts.filter((post) => post.id !== id)
  return delay({ message: 'Đã xoá bài viết.' })
}

export async function getPostById(id: string): Promise<Post | null> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<Post>(`/admin/posts/${id}`)

  const post = posts.find((item) => item.id === id) ?? null
  return delay(post)
}

export async function createPost(payload: CreatePostPayload): Promise<Post> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.post<Post>('/admin/posts', payload)

  if (!payload.title.trim()) {
    throw new Error('Vui lòng nhập tiêu đề bài viết.')
  }

  postSeq += 1
  const newPost: Post = {
    id: `bv_${String(postSeq).padStart(2, '0')}`,
    title: payload.title,
    excerpt: payload.excerpt,
    content: payload.content,
    status: payload.status,
    publishedAt: payload.status === 'da-dang' ? new Date().toLocaleDateString('vi-VN') : null,
    views: payload.status === 'da-dang' ? 0 : null,
  }
  posts = [newPost, ...posts]

  return delay(newPost)
}

// ---------------------------------------------------------------------------
// Các hàm dưới đây phục vụ storefront khách hàng (trang chủ, danh sách "Tin
// công nghệ", chi tiết bài viết). Chỉ trả về bài viết đã đăng (`da-dang`).

export async function getPublicPosts(): Promise<Post[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<Post[]>('/posts')

  return delay(posts.filter((post) => post.status === 'da-dang'))
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<Post[]>(`/posts/featured?limit=${limit}`)

  return delay(posts.filter((post) => post.status === 'da-dang').slice(0, limit))
}

export async function updatePost(id: string, payload: Partial<CreatePostPayload>): Promise<Post> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.put<Post>(`/admin/posts/${id}`, payload)

  const index = posts.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy bài viết.')
  }

  const current = posts[index]
  const nextStatus = payload.status ?? current.status
  const updated: Post = {
    ...current,
    ...payload,
    publishedAt:
      nextStatus === 'da-dang' ? (current.publishedAt ?? new Date().toLocaleDateString('vi-VN')) : null,
    views: nextStatus === 'da-dang' ? (current.views ?? 0) : current.views,
  }
  posts = [...posts.slice(0, index), updated, ...posts.slice(index + 1)]

  return delay(updated)
}
