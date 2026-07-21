export interface ImageDropzoneProps {
  label: string
  className?: string
  /** 'circle' dùng cho ảnh đại diện (vd trang Cài đặt tài khoản khách hàng). */
  variant?: 'square' | 'circle'
}

/**
 * Ô kéo-thả ảnh dùng chung cho toàn bộ khu vực admin và customer (popup Thêm
 * sản phẩm, Chi tiết sản phẩm, ảnh bài viết, ảnh sản phẩm/bài viết ở storefront,
 * ảnh đại diện tài khoản...). Ảnh thiết kế chỉ thể hiện trạng thái rỗng (chưa
 * có ảnh thật nào được upload) nên component này chỉ hiển thị UI tĩnh, chưa
 * xử lý upload thật.
 */
export function ImageDropzone({ label, className = '', variant = 'square' }: ImageDropzoneProps) {
  const isCircle = variant === 'circle'

  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 border-2 border-dashed border-neutral-300 bg-neutral-50 text-center text-neutral-400 ${
        isCircle ? 'rounded-full px-2 py-2 text-[10px] leading-tight' : 'rounded-2xl px-4 py-8'
      } ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={isCircle ? 'h-4 w-4' : 'h-6 w-6'}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <span className={`font-medium text-neutral-500 ${isCircle ? 'text-[10px]' : 'text-sm'}`}>{label}</span>
      <span className={isCircle ? 'text-[9px]' : 'text-xs'}>
        or <span className="cursor-pointer text-blue-600 underline">browse files</span>
      </span>
    </div>
  )
}
