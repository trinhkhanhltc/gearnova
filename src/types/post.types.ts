export type PostStatus = 'da-dang' | 'ban-nhap'

export interface Post {
  id: string
  title: string
  status: PostStatus
  publishedAt: string | null
  views: number | null
  excerpt?: string
  content?: string
  // Field dưới đây phục vụ storefront khách hàng (chuyên mục hiển thị dạng
  // badge trên thẻ bài viết, vd "Sản phẩm" / "Sự kiện" / "Mẹo hay").
  tag?: string
  author?: string
}

export interface CreatePostPayload {
  title: string
  excerpt: string
  content: string
  status: PostStatus
}
