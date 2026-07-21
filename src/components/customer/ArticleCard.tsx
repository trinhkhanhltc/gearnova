import { Link } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { ImageDropzone } from '../ui/ImageDropzone'
import type { Post } from '../../types/post.types'

export interface ArticleCardProps {
  post: Post
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link
      to={`/articles/${post.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white"
    >
      <ImageDropzone label="Ảnh bài viết" className="aspect-video w-full rounded-none border-0 border-b border-dashed border-neutral-300" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        {post.tag && (
          <div>
            <Badge tone="blue">{post.tag}</Badge>
          </div>
        )}
        <h3 className="font-semibold text-neutral-900">{post.title}</h3>
        <p className="mt-auto text-sm text-neutral-500">{post.publishedAt}</p>
      </div>
    </Link>
  )
}
