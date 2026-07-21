import { mockProductCategories, mockProductListMeta, mockProducts, mockPublicProductCategories } from '../mocks/products.mock'
import type {
  CreateProductPayload,
  CreateProductReviewPayload,
  Product,
  ProductListParams,
  PublicProductListParams,
} from '../types/product.types'

const MOCK_DELAY_MS = 500
let products = [...mockProducts]
let productSeq = products.length

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

export interface ProductListResult {
  items: Product[]
  totalItems: number
  totalPages: number
  categories: string[]
}

export async function getProducts(params: ProductListParams = {}): Promise<ProductListResult> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng (truyền params qua query string)
  // return apiClient.get<ProductListResult>(`/admin/products?search=${params.search ?? ''}&category=${params.category ?? ''}&status=${params.status ?? ''}`)

  let items = products
  if (params.search) {
    const keyword = params.search.trim().toLowerCase()
    items = items.filter(
      (product) => product.name.toLowerCase().includes(keyword) || product.sku.toLowerCase().includes(keyword),
    )
  }
  if (params.category && params.category !== 'tat-ca') {
    items = items.filter((product) => product.category === params.category)
  }
  if (params.status && params.status !== 'tat-ca') {
    items = items.filter((product) => product.status === params.status)
  }

  return delay({
    items,
    totalItems: mockProductListMeta.totalItems,
    totalPages: mockProductListMeta.totalPages,
    categories: mockProductCategories,
  })
}

export async function getProductById(id: string): Promise<Product | null> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<Product>(`/admin/products/${id}`)

  const product = products.find((item) => item.id === id) ?? null
  return delay(product)
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.post<Product>('/admin/products', payload)

  if (!payload.name || !payload.sku) {
    throw new Error('Vui lòng nhập đầy đủ tên sản phẩm và SKU.')
  }

  productSeq += 1
  const newProduct: Product = {
    id: payload.sku || `NV-${productSeq}`,
    name: payload.name,
    sku: payload.sku,
    category: payload.category,
    price: payload.price,
    stock: payload.stock,
    status: payload.stock > 0 ? 'dang-ban' : 'het-hang',
    sold: 0,
    description: payload.description,
  }
  products = [newProduct, ...products]

  return delay(newProduct)
}

export async function updateProduct(id: string, payload: Partial<CreateProductPayload>): Promise<Product> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.put<Product>(`/admin/products/${id}`, payload)

  const index = products.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy sản phẩm.')
  }
  const updated: Product = { ...products[index], ...payload }
  products = [...products.slice(0, index), updated, ...products.slice(index + 1)]

  return delay(updated)
}

export async function deleteProduct(id: string): Promise<{ message: string }> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.delete<{ message: string }>(`/admin/products/${id}`)

  products = products.filter((product) => product.id !== id)
  return delay({ message: 'Đã xoá sản phẩm.' })
}

// ---------------------------------------------------------------------------
// Các hàm dưới đây phục vụ storefront khách hàng (trang chủ, danh sách sản
// phẩm, chi tiết sản phẩm). Ảnh thiết kế customer hiển thị đúng 8 sản phẩm
// hiện có trong `mockProducts`, không phân biệt trạng thái tồn kho/ngừng bán
// như bên admin — nên các hàm này không lọc theo `status`.

export interface PublicProductListResult {
  items: Product[]
  categories: string[]
}

export async function getPublicProducts(params: PublicProductListParams = {}): Promise<PublicProductListResult> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<PublicProductListResult>(`/products?search=${params.search ?? ''}&category=${params.category ?? ''}&sort=${params.sort ?? ''}`)

  let items = [...products]

  if (params.search) {
    const keyword = params.search.trim().toLowerCase()
    items = items.filter((product) => product.name.toLowerCase().includes(keyword))
  }
  if (params.category && params.category !== 'tat-ca') {
    items = items.filter((product) => product.category === params.category)
  }
  if (params.priceRanges && params.priceRanges.length > 0) {
    items = items.filter((product) =>
      params.priceRanges!.some((range) => {
        if (range === 'duoi-2tr') return product.price < 2000000
        if (range === '2tr-10tr') return product.price >= 2000000 && product.price <= 10000000
        return product.price > 10000000
      }),
    )
  }
  if (params.sort === 'gia-tang-dan') {
    items = [...items].sort((a, b) => a.price - b.price)
  } else if (params.sort === 'gia-giam-dan') {
    items = [...items].sort((a, b) => b.price - a.price)
  }

  return delay({ items, categories: mockPublicProductCategories })
}

export async function getFeaturedProducts(): Promise<Product[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<Product[]>('/products/featured')

  return delay(products.slice(0, 4))
}

export async function getPublicProductById(id: string): Promise<Product | null> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<Product>(`/products/${id}`)

  const product = products.find((item) => item.id === id) ?? null
  return delay(product)
}

export async function getRelatedProducts(id: string): Promise<Product[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<Product[]>(`/products/${id}/related`)

  return delay(products.filter((product) => product.id !== id).slice(0, 4))
}

export async function createProductReview(id: string, payload: CreateProductReviewPayload): Promise<Product> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.post<Product>(`/products/${id}/reviews`, payload)

  if (!payload.rating || payload.rating < 1 || payload.rating > 5) {
    throw new Error('Vui lòng chọn số sao đánh giá.')
  }
  if (!payload.content.trim()) {
    throw new Error('Vui lòng nhập nội dung đánh giá.')
  }

  const index = products.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error('Không tìm thấy sản phẩm.')
  }

  const target = products[index]
  const newReview = {
    id: `rv_${Date.now()}`,
    author: 'Trần Bảo Anh',
    rating: payload.rating,
    date: new Date().toLocaleDateString('vi-VN'),
    content: payload.content.trim(),
  }
  const updated: Product = {
    ...target,
    reviews: [newReview, ...(target.reviews ?? [])],
    reviewCount: (target.reviewCount ?? 0) + 1,
  }
  products = [...products.slice(0, index), updated, ...products.slice(index + 1)]

  return delay(updated)
}
