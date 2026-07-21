export type ProductStatus = 'dang-ban' | 'het-hang' | 'ngung-ban'

export interface ProductSpec {
  label: string
  value: string
}

export interface ProductReview {
  id: string
  author: string
  rating: number
  date: string
  content: string
}

export interface ProductRatingBreakdown {
  star5: number
  star4: number
  star3: number
  star2: number
  star1: number
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: ProductStatus
  sold: number
  description?: string
  specs?: ProductSpec[]
  revenueContribution?: string
  // Các field dưới đây phục vụ storefront khách hàng (không dùng ở admin):
  rating?: number
  reviewCount?: number
  ratingBreakdown?: ProductRatingBreakdown
  originalPrice?: number
  discountPercent?: number
  colors?: string[]
  reviews?: ProductReview[]
}

export interface CreateProductPayload {
  name: string
  sku: string
  category: string
  price: number
  stock: number
  description: string
}

export interface ProductListParams {
  search?: string
  category?: string
  status?: ProductStatus | 'tat-ca'
}

export type ProductSortOption = 'noi-bat' | 'gia-tang-dan' | 'gia-giam-dan'

export type ProductPriceRange = 'duoi-2tr' | '2tr-10tr' | 'tren-10tr'

export interface PublicProductListParams {
  search?: string
  category?: string
  priceRanges?: ProductPriceRange[]
  sort?: ProductSortOption
}

export interface CreateProductReviewPayload {
  rating: number
  content: string
}
