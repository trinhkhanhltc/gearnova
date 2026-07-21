import type { Product } from '../types/product.types'

// TODO: thay bằng gọi API thật khi backend sẵn sàng
// Ghi chú: ảnh thiết kế danh sách sản phẩm ghi "96 sản phẩm trong kho" và phân
// trang 1..12, nhưng chỉ thể hiện đúng 8 sản phẩm ở trang 1. Mock hiện chỉ có
// đúng 8 sản phẩm này; các trang khác chưa có dữ liệu mock (xem ProductsPage).
//
// Ghi chú (storefront khách hàng): ảnh thiết kế trang chủ/danh sách sản phẩm
// dùng nhãn danh mục hơi khác ảnh chi tiết sản phẩm — "Âm thanh" (pill trang
// chủ, sidebar danh sách) so với "Thiết bị âm thanh" (breadcrumb chi tiết sản
// phẩm), và có thêm pill "Đồng hồ thông minh" dù sản phẩm đồng hồ trong mock
// đang gắn danh mục "Phụ kiện". Đây là chỗ chưa nhất quán trong ảnh thiết kế
// gốc — frontend giữ đúng field `category` thật của từng sản phẩm ("Thiết bị
// âm thanh", "Phụ kiện"...) để khớp breadcrumb, còn danh sách pill/sidebar ở
// trang chủ và danh sách sản phẩm liệt kê đúng theo ảnh (5 nhãn), lọc theo
// đúng chuỗi category — nghĩa là 2 pill "Âm thanh" và "Đồng hồ thông minh" sẽ
// không khớp sản phẩm nào cho tới khi backend chuẩn hoá lại danh mục.
export const mockProducts: Product[] = [
  {
    id: 'NV-NX2-BLK',
    name: 'Tai nghe chống ồn Nova X2',
    sku: 'NV-NX2-BLK',
    category: 'Thiết bị âm thanh',
    price: 2490000,
    stock: 4,
    status: 'dang-ban',
    sold: 482,
    description:
      'Tai nghe chống ồn chủ động Nova X2 mang lại âm thanh cân bằng, thời lượng pin 30 giờ và kết nối Bluetooth 5.3 ổn định — phù hợp cho công việc và giải trí hằng ngày.',
    specs: [
      { label: 'Pin', value: '30 giờ nghe nhạc' },
      { label: 'Kết nối', value: 'Bluetooth 5.3' },
      { label: 'Chống ồn', value: 'Chủ động (ANC)' },
      { label: 'Trọng lượng', value: '254g' },
    ],
    revenueContribution: '₫1,2 tỷ',
    rating: 4.8,
    reviewCount: 312,
    ratingBreakdown: { star5: 72, star4: 18, star3: 6, star2: 3, star1: 1 },
    originalPrice: 2990000,
    discountPercent: 17,
    colors: ['Đen', 'Trắng', 'Xanh'],
    reviews: [
      {
        id: 'rv_01',
        author: 'Lê Thị Hoa',
        rating: 5,
        date: '19/07/2026',
        content: 'Âm thanh rất tốt, chống ồn hiệu quả trong môi trường ồn ào. Pin dùng được gần cả tuần với mình.',
      },
      {
        id: 'rv_02',
        author: 'Phạm Quốc Huy',
        rating: 5,
        date: '15/07/2026',
        content: 'Đóng gói cẩn thận, giao hàng nhanh. Đeo cả ngày không bị đau tai, đáng tiền.',
      },
      {
        id: 'rv_03',
        author: 'Nguyễn Đức Anh',
        rating: 4,
        date: '08/07/2026',
        content: 'Chất lượng tốt so với giá, chỉ tiếc là hộp đựng hơi to so với nhu cầu mang đi lại.',
      },
    ],
  },
  {
    id: 'NV-NFIT-01',
    name: 'Đồng hồ thông minh Nova Fit',
    sku: 'NV-NFIT-01',
    category: 'Phụ kiện',
    price: 3290000,
    stock: 58,
    status: 'dang-ban',
    sold: 401,
    rating: 5,
    reviewCount: 198,
  },
  {
    id: 'NV-NBP14',
    name: 'Laptop Nova Book Pro 14',
    sku: 'NV-NBP14',
    category: 'Laptop',
    price: 18990000,
    stock: 21,
    status: 'dang-ban',
    sold: 355,
    rating: 5,
    reviewCount: 256,
  },
  {
    id: 'NV-CHG65',
    name: 'Sạc nhanh GaN 65W',
    sku: 'NV-CHG65',
    category: 'Phụ kiện',
    price: 490000,
    stock: 130,
    status: 'dang-ban',
    sold: 298,
  },
  {
    id: 'NV-SND-MN',
    name: 'Loa bluetooth Nova Sound Mini',
    sku: 'NV-SND-MN',
    category: 'Thiết bị âm thanh',
    price: 890000,
    stock: 0,
    status: 'het-hang',
    sold: 240,
  },
  {
    id: 'NV-NP12-BLU',
    name: 'Điện thoại Nova Phone 12',
    sku: 'NV-NP12-BLU',
    category: 'Điện thoại',
    price: 12990000,
    stock: 44,
    status: 'dang-ban',
    sold: 198,
    rating: 5,
    reviewCount: 410,
  },
  {
    id: 'NV-KBK2',
    name: 'Bàn phím cơ Nova Type K2',
    sku: 'NV-KBK2',
    category: 'Phụ kiện',
    price: 1590000,
    stock: 12,
    status: 'dang-ban',
    sold: 120,
  },
  {
    id: 'NV-CAM01',
    name: 'Camera hành trình Nova Cam',
    sku: 'NV-CAM01',
    category: 'Phụ kiện',
    price: 1190000,
    stock: 0,
    status: 'ngung-ban',
    sold: 64,
  },
]

export const mockProductCategories = ['Điện thoại', 'Laptop', 'Phụ kiện', 'Thiết bị âm thanh']

export const mockProductListMeta = {
  totalItems: 96,
  totalPages: 12,
}

// Danh mục hiển thị ở storefront (pill trang chủ + sidebar danh sách sản
// phẩm) — lấy đúng 5 nhãn theo ảnh thiết kế `customer-trang-chu.png` /
// `customer-danh-sach-san-pham.png`. Xem ghi chú ở đầu file về sự khác biệt
// với `category` thật của sản phẩm.
export const mockPublicProductCategories = ['Điện thoại', 'Laptop', 'Phụ kiện', 'Âm thanh', 'Đồng hồ thông minh']
