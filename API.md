# API cần code backend

File này được agent `design-to-code` tự động cập nhật mỗi khi ghép thêm 1 API
(mock) vào frontend. Dùng file này làm spec để code backend thật — khớp đúng
method, path, request/response mà frontend đang gọi.

> Cập nhật (khu vực Admin): sau khi đăng nhập thành công ở `LoginPage`, token
> trả về từ `POST /auth/login` được lưu vào `localStorage` (key
> `gearnova_auth_token`, xem `src/utils/authStorage.ts`) và frontend điều
> hướng ngay sang `/admin/dashboard`. Toàn bộ route `/admin/*` được bảo vệ đơn
> giản bởi `AdminGuard` — chỉ kiểm tra token có tồn tại trong localStorage hay
> không, chưa kiểm tra vai trò/quyền hạn thật (ma trận phân quyền ở màn hình
> Cài đặt hiện chỉ mang tính hiển thị tham khảo, backend cần tự triển khai
> kiểm tra quyền theo vai trò khi có API thật). Khi đăng xuất (xác nhận ở
> popup `admin-popup-dang-xuat.png`), token bị xoá khỏi localStorage và
> frontend điều hướng về `/login`.
>
> Ảnh `admin-dang-nhap.png` (đăng nhập quản trị riêng, nhãn "Email nội bộ")
> đã được xem để thống kê tính năng, nhưng theo yêu cầu của người dùng, màn
> hình đăng nhập dùng chung là `LoginPage` hiện có (`/login`) — không tạo
> route đăng nhập admin riêng. Nếu sau này cần tách biệt đăng nhập
> khách hàng/nhân viên, cần bổ sung route + API riêng và cập nhật lại phần
> này.

## Auth

### POST /auth/login

**Mục đích:** Xác thực người dùng bằng email + mật khẩu, trả về thông tin user
và token đăng nhập.
**Dùng ở màn hình:** Đăng nhập (`gearnova-dang-nhap.png` — `src/pages/auth/LoginPage.tsx`).

**Request**
- Params/Query: không có
- Body (JSON):
```json
{
  "email": "ban@gearnova.vn",
  "password": "matkhau123",
  "rememberMe": true
}
```

**Response thành công (200)**
```json
{
  "user": {
    "id": "usr_001",
    "fullName": "Nguyễn Văn A",
    "email": "ban@gearnova.vn",
    "phone": "0901234567"
  },
  "token": "mock-jwt-token"
}
```

**Response lỗi cần xử lý:**
- 400 — thiếu `email` hoặc `password`: hiển thị "Vui lòng nhập đầy đủ email và
  mật khẩu." (banner đỏ trên form, dùng component `FormMessage`).
- 401 — sai email/mật khẩu: hiển thị "Email hoặc mật khẩu không đúng." (banner
  đỏ, không có trạng thái này trong ảnh thiết kế gốc nên là giả định để form
  dùng được).
- 500 — lỗi hệ thống: hiển thị thông báo lỗi chung "Đăng nhập thất bại. Vui
  lòng thử lại."

---

### POST /auth/register

**Mục đích:** Tạo tài khoản mới cho người dùng.
**Dùng ở màn hình:** Đăng ký (`gearnova-dang-ky.png` — `src/pages/auth/RegisterPage.tsx`).

**Request**
- Params/Query: không có
- Body (JSON):
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "ban@email.com",
  "phone": "0912345678",
  "password": "matkhau123",
  "confirmPassword": "matkhau123",
  "acceptTerms": true
}
```

**Response thành công (200)**
```json
{
  "user": {
    "id": "usr_001",
    "fullName": "Nguyễn Văn A",
    "email": "ban@email.com",
    "phone": "0912345678"
  },
  "token": "mock-jwt-token"
}
```

**Response lỗi cần xử lý:**
- 400 — thiếu `fullName`/`email`/`phone`: "Vui lòng nhập đầy đủ thông tin bắt
  buộc."
- 400 — `password` ngắn hơn 8 ký tự: "Mật khẩu phải có ít nhất 8 ký tự." (giả
  định lấy theo placeholder "Tối thiểu 8 ký tự" trong ảnh thiết kế).
- 400 — `password` khác `confirmPassword`: "Mật khẩu xác nhận không khớp."
- 400 — `acceptTerms` = false: "Bạn cần đồng ý với Điều khoản dịch vụ và Chính
  sách bảo mật."
- 409 — email hoặc số điện thoại đã tồn tại: cần backend trả lỗi rõ ràng để
  frontend hiển thị (hiện mock chưa kiểm tra trùng lặp, cần bổ sung khi có
  backend thật).
- 500 — lỗi hệ thống: "Tạo tài khoản thất bại. Vui lòng thử lại."

---

### POST /auth/forgot-password

**Mục đích:** Gửi email chứa liên kết đặt lại mật khẩu cho người dùng.
**Dùng ở màn hình:** Quên mật khẩu (`gearnova-quen-mat-khau.png` —
`src/pages/auth/ForgotPasswordPage.tsx`).

**Request**
- Params/Query: không có
- Body (JSON):
```json
{
  "email": "ban@gearnova.vn"
}
```

**Response thành công (200)**
```json
{
  "message": "Nếu email ban@gearnova.vn tồn tại trong hệ thống, liên kết đặt lại mật khẩu đã được gửi tới hộp thư của bạn."
}
```

**Response lỗi cần xử lý:**
- 400 — thiếu `email`: "Vui lòng nhập email đã đăng ký."
- 500 — lỗi hệ thống (vd gửi email thất bại): "Gửi liên kết thất bại. Vui lòng
  thử lại."
- Lưu ý bảo mật gợi ý cho backend: nên trả 200 với message trung lập ngay cả
  khi email không tồn tại trong hệ thống (tránh lộ thông tin email nào đã đăng
  ký), thay vì trả 404.

## Admin — Dashboard

### GET /admin/dashboard

**Mục đích:** Lấy toàn bộ số liệu tổng quan cho trang Dashboard: 4 chỉ số
nhanh, dữ liệu biểu đồ doanh thu theo tháng, tỷ trọng danh mục và danh sách
đơn hàng gần đây.
**Dùng ở màn hình:** Tổng quan (`admin-dashboard.png` —
`src/pages/admin/DashboardPage.tsx`).

**Request**
- Params/Query: không có (giả định BE tự suy ra theo cửa hàng/kỳ hiện tại)

**Response thành công (200)**
```json
{
  "stats": {
    "revenue": { "label": "Doanh thu", "value": "₫128.500.000", "changeLabel": "+12.4% so với kỳ trước", "changeTone": "positive" },
    "newOrders": { "label": "Đơn hàng mới", "value": "348", "changeLabel": "+8.1% so với kỳ trước", "changeTone": "positive" },
    "newCustomers": { "label": "Khách hàng mới", "value": "126", "changeLabel": "+4.6% so với kỳ trước", "changeTone": "positive" },
    "lowStock": { "label": "Tồn kho thấp", "value": "7 sản phẩm", "note": "dưới ngưỡng an toàn", "changeTone": "warning" }
  },
  "revenueByMonth": [{ "month": "T1", "value": 62 }, { "month": "T2", "value": 58 }],
  "categoryShare": [{ "category": "Điện thoại", "value": 40, "color": "#2563eb" }],
  "recentOrders": [
    { "id": "DH-10241", "customerName": "Trần Thị Mai", "productName": "Nova Book Pro 14", "status": "cho-xac-nhan", "total": 18990000 }
  ]
}
```
Ghi chú: `value` trong `revenueByMonth` là đơn vị "triệu đồng" (khớp cách hiển
thị "128.500.000" ở card doanh thu và trục biểu đồ chỉ hiện tên tháng, không
hiện số — đây là giả định để vẽ được biểu đồ, BE có thể trả đơn vị khác miễn
nhất quán).

**Response lỗi cần xử lý:**
- 401 — chưa đăng nhập/token hết hạn: điều hướng về `/login`.
- 500 — lỗi hệ thống: hiển thị "Không thể tải dữ liệu tổng quan."

---

## Admin — Doanh thu

### GET /admin/revenue

**Mục đích:** Lấy số liệu trang Doanh thu (3 chỉ số, biểu đồ theo tháng,
doanh thu theo danh mục dạng progress bar).
**Dùng ở màn hình:** Doanh thu (`admin-doanh-thu.png` —
`src/pages/admin/RevenuePage.tsx`).

**Request**
- Params/Query: không có

**Response thành công (200)**
```json
{
  "revenueThisMonth": "₫128.500.000",
  "estimatedProfit": "₫38.200.000",
  "averageOrderValue": "₫1.620.000",
  "revenueByMonth": [{ "month": "T1", "value": 62 }],
  "revenueByCategory": [{ "category": "Điện thoại", "amount": 48200000 }]
}
```

**Response lỗi cần xử lý:** 401 / 500 tương tự các API admin khác.

---

### POST /admin/revenue/export

**Mục đích:** Xuất báo cáo doanh thu.
**Dùng ở màn hình:** Doanh thu — nút "Xuất báo cáo".

**Giả định quan trọng (đã xác nhận với người dùng):** ảnh thiết kế không nêu
rõ định dạng file xuất (PDF/Excel/CSV). Hiện mock chỉ trả về message xác
nhận, **chưa có tải file thật**. Khi code BE thật, cần hỏi lại định dạng
mong muốn hoặc bổ sung link tải file trong response.

**Request**
- Params/Query: không có
- Body: không có

**Response thành công (200)**
```json
{ "message": "Đã tạo báo cáo." }
```

**Response lỗi cần xử lý:** 500 — "Xuất báo cáo thất bại."

---

## Admin — Đơn hàng

### GET /admin/orders

**Mục đích:** Lấy danh sách đơn hàng, hỗ trợ lọc theo trạng thái và tìm kiếm
theo mã đơn/tên khách hàng.
**Dùng ở màn hình:** Đơn hàng (`admin-don-hang.png` —
`src/pages/admin/OrdersPage.tsx`), và tái sử dụng dữ liệu cho "Đơn hàng gần
đây" ở Dashboard.

**Request**
- Params/Query:
  - `status` (tuỳ chọn): `cho-xac-nhan` | `dang-xu-ly` | `da-giao` | `da-huy` | `tat-ca`
  - `search` (tuỳ chọn): tìm theo mã đơn hoặc tên khách hàng

**Response thành công (200)**
```json
[
  { "id": "DH-10241", "customerName": "Trần Thị Mai", "productName": "Nova Book Pro 14", "status": "cho-xac-nhan", "total": 18990000 }
]
```

**Response lỗi cần xử lý:** 401 / 500 tương tự các API admin khác.

**Ghi chú quan trọng:** nút "Xem" trên mỗi dòng đơn hàng **không** gọi thêm
API — modal xem nhanh chỉ hiển thị lại đúng dữ liệu đã có trong response của
`GET /admin/orders` (mã đơn, khách hàng, sản phẩm, trạng thái, tổng tiền).
Đây là quyết định đã được người dùng xác nhận vì ảnh thiết kế chưa có trang
chi tiết đơn hàng riêng. Nếu sau này có thiết kế trang chi tiết đơn hàng đầy
đủ hơn (địa chỉ giao hàng, lịch sử trạng thái...), cần bổ sung thêm
`GET /admin/orders/:id`.

---

## Admin — Khách hàng

### GET /admin/customers

**Mục đích:** Lấy 3 chỉ số tổng quan và danh sách khách hàng.
**Dùng ở màn hình:** Khách hàng (`admin-khach-hang.png` —
`src/pages/admin/CustomersPage.tsx`).

**Request**
- Params/Query: không có (ảnh thiết kế không có ô tìm kiếm/lọc riêng cho
  trang này, khác với trang Đơn hàng và Sản phẩm)

**Response thành công (200)**
```json
{
  "totalCustomers": 2418,
  "newThisMonth": 186,
  "loyalCustomers": 312,
  "customers": [
    { "id": "kh_01", "name": "Trần Bảo Anh", "email": "baoanh.tran@gmail.com", "phone": "0912 345 678", "ordersCount": 8, "totalSpent": 24680000, "joinedAt": "12/02/2025" }
  ]
}
```

**Response lỗi cần xử lý:** 401 / 500 tương tự các API admin khác.

---

## Admin — Sản phẩm

### GET /admin/products

**Mục đích:** Lấy danh sách sản phẩm, hỗ trợ tìm kiếm theo tên/SKU, lọc theo
danh mục và trạng thái, kèm phân trang.
**Dùng ở màn hình:** Sản phẩm (`admin-san-pham.png` —
`src/pages/admin/ProductsPage.tsx`).

**Request**
- Params/Query:
  - `search` (tuỳ chọn)
  - `category` (tuỳ chọn)
  - `status` (tuỳ chọn): `dang-ban` | `het-hang` | `ngung-ban` | `tat-ca`
  - `page` (tuỳ chọn, mock hiện chưa hỗ trợ phân trang thật — xem ghi chú)

**Response thành công (200)**
```json
{
  "items": [
    { "id": "NV-NX2-BLK", "name": "Tai nghe chống ồn Nova X2", "sku": "NV-NX2-BLK", "category": "Thiết bị âm thanh", "price": 2490000, "stock": 4, "status": "dang-ban", "sold": 482 }
  ],
  "totalItems": 96,
  "totalPages": 12,
  "categories": ["Điện thoại", "Laptop", "Phụ kiện", "Thiết bị âm thanh"]
}
```

**Ghi chú quan trọng về phân trang:** ảnh thiết kế ghi "96 sản phẩm trong
kho" và hiển thị nút trang 1..12, nhưng chỉ thể hiện đúng 8 sản phẩm ở trang
1. Mock hiện tại chỉ có 8 sản phẩm này; các nút trang khác trên UI hiện bị vô
hiệu hoá (disabled) vì chưa có dữ liệu mock. **Khi code BE thật, cần triển
khai phân trang thật sự** theo `page`/`pageSize` để các nút trang 2, 3... 12
hoạt động.

**Response lỗi cần xử lý:** 401 / 500 tương tự các API admin khác.

---

### GET /admin/products/:id

**Mục đích:** Lấy chi tiết 1 sản phẩm (giá, tồn kho, đã bán, doanh thu đóng
góp, mô tả, thông số kỹ thuật).
**Dùng ở màn hình:** Chi tiết sản phẩm (`admin-chi-tiet-san-pham.png` —
`src/pages/admin/ProductDetailPage.tsx`).

**Response thành công (200)**
```json
{
  "id": "NV-NX2-BLK",
  "name": "Tai nghe chống ồn Nova X2",
  "sku": "NV-NX2-BLK",
  "category": "Thiết bị âm thanh",
  "price": 2490000,
  "stock": 4,
  "status": "dang-ban",
  "sold": 482,
  "description": "Tai nghe chống ồn chủ động Nova X2 mang lại âm thanh cân bằng...",
  "specs": [{ "label": "Pin", "value": "30 giờ nghe nhạc" }],
  "revenueContribution": "₫1,2 tỷ"
}
```

**Ghi chú quan trọng:** ảnh thiết kế chỉ thể hiện chi tiết đầy đủ (mô tả,
thông số) cho đúng 1 sản phẩm mẫu ("Tai nghe chống ồn Nova X2"). Các sản
phẩm khác trong mock **chưa có** `description`/`specs` — frontend hiển thị
"Chưa có mô tả chi tiết..."/"Chưa có thông số kỹ thuật..." khi các field này
rỗng. BE cần đảm bảo trả đủ dữ liệu thật cho mọi sản phẩm.

Ảnh thiết kế cũng chỉ hiện các ô upload ảnh ở trạng thái rỗng (chưa có ảnh
thật nào) — vì vậy response mẫu ở trên chưa có field ảnh; khi BE hỗ trợ upload
ảnh thật, cần bổ sung thêm field (vd `images: string[]`) và API upload riêng.

**Response lỗi cần xử lý:**
- 404 — không tìm thấy sản phẩm: hiển thị "Không tìm thấy sản phẩm."
- 401 / 500 tương tự các API admin khác.

---

### POST /admin/products

**Mục đích:** Tạo sản phẩm mới.
**Dùng ở màn hình:** Popup "Thêm sản phẩm mới" (`admin-popup-them-san-pham.png`
— `src/components/admin/AddProductModal.tsx`), mở từ nút "+ Thêm sản phẩm
mới" ở trang Sản phẩm.

**Request**
- Body (JSON):
```json
{
  "name": "Tai nghe chống ồn Nova X3",
  "sku": "NV-XXX-001",
  "category": "Thiết bị âm thanh",
  "price": 2990000,
  "stock": 50,
  "description": "Mô tả ngắn gọn về sản phẩm..."
}
```

**Response thành công (200)**
```json
{
  "id": "NV-XXX-001",
  "name": "Tai nghe chống ồn Nova X3",
  "sku": "NV-XXX-001",
  "category": "Thiết bị âm thanh",
  "price": 2990000,
  "stock": 50,
  "status": "dang-ban",
  "sold": 0,
  "description": "Mô tả ngắn gọn về sản phẩm..."
}
```

**Response lỗi cần xử lý:**
- 400 — thiếu `name` hoặc `sku`: "Vui lòng nhập đầy đủ tên sản phẩm và SKU."
- 409 — SKU đã tồn tại: BE cần trả lỗi rõ ràng (mock chưa kiểm tra trùng SKU).
- 401 / 500 tương tự các API admin khác.

Ghi chú: popup có 3 ô upload ảnh (Ảnh chính, Ảnh 2, Ảnh 3) nhưng ở trạng thái
rỗng trong ảnh thiết kế — mock hiện chưa xử lý upload ảnh thật, cần bổ sung
API upload riêng khi có yêu cầu cụ thể.

---

### PUT /admin/products/:id

**Mục đích:** Cập nhật sản phẩm (hiện dùng cho nút "Lưu thay đổi" ở trang chi
tiết sản phẩm, đang chỉnh sửa được trường mô tả).
**Dùng ở màn hình:** Chi tiết sản phẩm (`admin-chi-tiet-san-pham.png`).

**Request**
- Body (JSON, các field đều tuỳ chọn — chỉ gửi field đã thay đổi):
```json
{ "description": "Mô tả mới sau khi chỉnh sửa..." }
```

**Response thành công (200)**: trả về object `Product` đầy đủ sau khi cập
nhật (cấu trúc giống response của `GET /admin/products/:id`).

**Response lỗi cần xử lý:**
- 404 — không tìm thấy sản phẩm.
- 401 / 500 tương tự các API admin khác.

---

### DELETE /admin/products/:id

**Mục đích:** Xoá sản phẩm.
**Dùng ở màn hình:** Danh sách sản phẩm (link "Xoá") và Chi tiết sản phẩm
(link "Xoá sản phẩm này").

**Response thành công (200)**
```json
{ "message": "Đã xoá sản phẩm." }
```

**Response lỗi cần xử lý:** 404 / 401 / 500.

---

## Admin — Bài viết

### GET /admin/posts

**Mục đích:** Lấy danh sách bài viết, lọc theo trạng thái.
**Dùng ở màn hình:** Bài viết (`admin-bai-viet.png` —
`src/pages/admin/PostsPage.tsx`).

**Request**
- Params/Query: `status` (tuỳ chọn): `da-dang` | `ban-nhap` | `tat-ca`

**Response thành công (200)**
```json
[
  { "id": "bv_01", "title": "Nova Phone 13 lộ diện với chip thế hệ mới", "status": "da-dang", "publishedAt": "18/07/2026", "views": 4200 }
]
```

**Response lỗi cần xử lý:** 401 / 500.

---

### DELETE /admin/posts/:id

**Mục đích:** Xoá bài viết.
**Dùng ở màn hình:** Bài viết — link "Xoá".

**Response thành công (200)**
```json
{ "message": "Đã xoá bài viết." }
```

**Response lỗi cần xử lý:** 404 / 401 / 500.

---

### GET /admin/posts/:id

**Mục đích:** Lấy chi tiết một bài viết để hiển thị màn "Sửa bài viết".
**Dùng ở màn hình:** Sửa bài viết (`src/pages/admin/PostFormPage.tsx`, chế độ
sửa — chưa có ảnh thiết kế riêng, dựng theo phong cách trang Chi tiết sản
phẩm).

**Response thành công (200)**
```json
{ "id": "bv_01", "title": "Nova Phone 13 lộ diện với chip thế hệ mới", "status": "da-dang", "publishedAt": "18/07/2026", "views": 4200, "excerpt": "...", "content": "..." }
```

**Response lỗi cần xử lý:** 404 / 401 / 500.

---

### POST /admin/posts

**Mục đích:** Tạo bài viết mới.
**Dùng ở màn hình:** Viết bài mới (`src/pages/admin/PostFormPage.tsx`, chế độ
tạo mới — nút "+ Viết bài mới" ở màn Bài viết).

**Request body**
```json
{ "title": "string", "excerpt": "string", "content": "string", "status": "ban-nhap | da-dang" }
```

**Response thành công (201)**
```json
{ "id": "bv_05", "title": "...", "status": "ban-nhap", "publishedAt": null, "views": null, "excerpt": "...", "content": "..." }
```

**Response lỗi cần xử lý:** 422 (thiếu tiêu đề) / 401 / 500.

---

### PUT /admin/posts/:id

**Mục đích:** Cập nhật bài viết (tiêu đề, tóm tắt, nội dung, trạng thái).
**Dùng ở màn hình:** Sửa bài viết (`src/pages/admin/PostFormPage.tsx`, chế độ
sửa) và nút "Xoá bài viết này" dùng lại `DELETE /admin/posts/:id`.

**Request body:** như `POST /admin/posts`, các field đều tuỳ chọn.

**Response thành công (200)**
```json
{ "id": "bv_01", "title": "...", "status": "da-dang", "publishedAt": "18/07/2026", "views": 4200, "excerpt": "...", "content": "..." }
```

**Response lỗi cần xử lý:** 404 / 422 / 401 / 500.

---

## Admin — Cài đặt & phân quyền

### GET /admin/staff

**Mục đích:** Lấy danh sách nhân viên (tên, email, vai trò, trạng thái, ngày
tham gia).
**Dùng ở màn hình:** Cài đặt — tab "Người dùng & phân quyền"
(`admin-cai-dat-phan-quyen.png` — `src/pages/admin/SettingsPage.tsx`).

**Response thành công (200)**
```json
[
  { "id": "nv_01", "name": "Nguyễn Văn A", "email": "a.nguyen@gearnova.vn", "role": "quan-ly", "status": "hoat-dong", "joinedAt": "01/03/2024" }
]
```

**Response lỗi cần xử lý:** 401 / 500.

---

### GET /admin/staff/permission-matrix

**Mục đích:** Lấy bảng ma trận phân quyền theo vai trò (chỉ đọc, hiển thị
tham khảo).
**Dùng ở màn hình:** Cài đặt — tab "Người dùng & phân quyền".

**Response thành công (200)**
```json
[
  { "permission": "Xem thống kê doanh thu", "quanLy": true, "nvBanHang": true, "nvKho": false }
]
```

**Response lỗi cần xử lý:** 401 / 500.

---

### POST /admin/staff/invite

**Mục đích:** Mời nhân viên mới tham gia qua email với vai trò được chọn
trước.
**Dùng ở màn hình:** Popup "Mời nhân viên mới"
(`admin-popup-moi-nhan-vien.png` — `src/components/admin/InviteEmployeeModal.tsx`).

**Request**
- Body (JSON):
```json
{ "email": "nhanvien@gearnova.vn", "role": "nv-ban-hang" }
```
`role` nhận 1 trong 3 giá trị: `quan-ly` | `nv-ban-hang` | `nv-kho`.

**Response thành công (200)**
```json
{
  "id": "nv_05",
  "name": "nhanvien",
  "email": "nhanvien@gearnova.vn",
  "role": "nv-ban-hang",
  "status": "hoat-dong",
  "joinedAt": "20/07/2026"
}
```
Ghi chú: mock tạm lấy `name` từ phần trước dấu `@` của email vì lời mời chưa
xác nhận nên chưa có tên thật — BE thật nên trả về trạng thái "đang chờ xác
nhận lời mời" thay vì "Hoạt động" ngay, và cập nhật tên thật khi nhân viên
chấp nhận lời mời (mock hiện đơn giản hoá, để trạng thái "Hoạt động" ngay).

**Response lỗi cần xử lý:**
- 400 — thiếu `email`: "Vui lòng nhập email nhân viên."
- 409 — email đã được mời/đã là nhân viên: BE cần trả lỗi rõ ràng (mock chưa
  kiểm tra trùng lặp).
- 401 / 500 tương tự các API admin khác.

---

### PUT /admin/staff/:id/toggle-status

**Mục đích:** Khoá/Mở khoá tài khoản nhân viên (chuyển đổi qua lại giữa
"Hoạt động" và "Tạm khoá").
**Dùng ở màn hình:** Cài đặt — link "Khoá"/"Mở khoá" trên mỗi dòng nhân viên.

**Giả định (đã ghi chú):** ảnh thiết kế chỉ hiển thị label "Khoá" cho tất cả
các dòng (kể cả dòng đang "Tạm khoá"), không có ảnh chụp trạng thái label khi
đã khoá. Frontend tự suy luận: nếu đang "Hoạt động" thì hiện nút "Khoá", nếu
đang "Tạm khoá" thì hiện nút "Mở khoá" — hành vi toggle qua lại hợp lý hơn so
với việc chỉ có 1 chiều. Xác nhận lại với người dùng nếu cần hành vi khác.

**Response thành công (200)**: trả về object `Staff` sau khi cập nhật.

**Response lỗi cần xử lý:** 404 — không tìm thấy nhân viên; 401 / 500.

**Ghi chú:** link "Sửa" trên mỗi dòng nhân viên **chưa được ghép API** vì ảnh
thiết kế không có form sửa nhân viên riêng.

---

## Customer — Trang chủ, Sản phẩm, Chi tiết sản phẩm

> Ghi chú chung khu vực Customer: storefront hiện **không có màn đăng nhập
> riêng** — header ở mọi trang customer luôn hiển thị avatar "TB" (giả định
> đã đăng nhập với tài khoản demo "Trần Bảo Anh", trùng dữ liệu khách hàng
> `kh_01` trong `GET /admin/customers`). Route `/` giờ là trang chủ storefront
> công khai (không còn tự động chuyển hướng sang `/login`); các route
> `/login`, `/register`, `/forgot-password`, `/admin/*` giữ nguyên như cũ.
>
> Giỏ hàng (icon giỏ hàng ở header, trang `/cart`, "Thêm vào giỏ"/"Mua
> ngay") hiện **chỉ là state cục bộ phía frontend** (lưu tạm ở `localStorage`,
> xem `src/contexts/CartContext.tsx`), KHÔNG có API riêng — trang Thanh toán
> đọc thẳng nội dung giỏ hàng để tạo đơn (`POST /orders`). Giỏ hàng khởi tạo
> sẵn 2 sản phẩm mẫu (Tai nghe Nova X2 + Đồng hồ Nova Fit) để khớp số "2" trên
> icon giỏ hàng và danh sách sản phẩm ở ảnh `customer-thanh-toan.png`. Khi có
> backend thật và cần đồng bộ giỏ hàng nhiều thiết bị, cần bổ sung API giỏ
> hàng riêng (`GET/POST/PUT/DELETE /cart/items`) — hiện chưa có vì tính năng
> giỏ hàng ban đầu không xuất phát từ ảnh thiết kế nào.
>
> **Cập nhật (bổ sung tính năng ngoài phạm vi ảnh thiết kế ban đầu):** khu vực
> customer được bổ sung thêm 5 tính năng vốn chỉ là nút/khu vực placeholder
> tĩnh ("Chưa có thiết kế cho mục này") — trang giỏ hàng (`/cart`), viết
> đánh giá sản phẩm, dropdown tài khoản ở header (lấy tên thật qua
> `GET /me/profile` thay vì chữ tắt "TB" hardcode), và 4 tab còn lại trong Cài
> đặt tài khoản (Địa chỉ giao hàng, Phương thức thanh toán, Đổi mật khẩu,
> Thông báo). Các API mock tương ứng được mô tả ở các mục bên dưới. Phía
> Admin cũng được bổ sung trang "Hồ sơ cá nhân" (`/admin/profile`), xem
> mục "Admin — Hồ sơ cá nhân" ở cuối file.

### GET /products

**Mục đích:** Lấy danh sách sản phẩm công khai cho storefront, hỗ trợ tìm
kiếm, lọc theo danh mục, khoảng giá và sắp xếp theo giá.
**Dùng ở màn hình:** Danh sách sản phẩm (`customer-danh-sach-san-pham.png` —
`src/pages/customer/ProductListPage.tsx`).

**Request**
- Params/Query:
  - `search` (tuỳ chọn): tìm theo tên sản phẩm
  - `category` (tuỳ chọn): 1 trong 5 nhãn hiển thị ở sidebar — `Điện thoại`,
    `Laptop`, `Phụ kiện`, `Âm thanh`, `Đồng hồ thông minh`, hoặc bỏ trống/`tat-ca`
  - `priceRanges` (tuỳ chọn, có thể chọn nhiều): `duoi-2tr` | `2tr-10tr` | `tren-10tr`
  - `sort` (tuỳ chọn): `noi-bat` | `gia-tang-dan` | `gia-giam-dan`

**Response thành công (200)**
```json
{
  "items": [
    { "id": "NV-NX2-BLK", "name": "Tai nghe chống ồn Nova X2", "category": "Thiết bị âm thanh", "price": 2490000, "stock": 4 }
  ],
  "categories": ["Điện thoại", "Laptop", "Phụ kiện", "Âm thanh", "Đồng hồ thông minh"]
}
```

**Ghi chú quan trọng (đã xác nhận là giả định, chưa hỏi lại người dùng):** ảnh
thiết kế dùng nhãn danh mục không hoàn toàn nhất quán — sidebar/pill trang chủ
ghi "Âm thanh" và "Đồng hồ thông minh", trong khi breadcrumb ở trang chi tiết
sản phẩm lại ghi "Thiết bị âm thanh" và sản phẩm đồng hồ thực tế được gắn danh
mục "Phụ kiện". Mock hiện lọc theo đúng chuỗi `category` của từng sản phẩm nên
2 nhãn "Âm thanh"/"Đồng hồ thông minh" sẽ không trả về sản phẩm nào cho tới khi
backend chuẩn hoá lại danh mục — cần backend/BA xác nhận lại taxonomy danh mục
chính thức.

**Response lỗi cần xử lý:** 500 — hiển thị "Không thể tải danh sách sản phẩm."

---

### GET /products/featured

**Mục đích:** Lấy danh sách sản phẩm nổi bật hiển thị ở trang chủ (kèm số sao
đánh giá, số lượt đánh giá).
**Dùng ở màn hình:** Trang chủ (`customer-trang-chu.png` —
`src/pages/customer/HomePage.tsx`), khối "Sản phẩm nổi bật".

**Response thành công (200)**
```json
[
  { "id": "NV-NX2-BLK", "name": "Tai nghe chống ồn Nova X2", "category": "Thiết bị âm thanh", "price": 2490000, "rating": 4.8, "reviewCount": 312 }
]
```

**Ghi chú:** ảnh thiết kế không nêu rõ tiêu chí "nổi bật" (bán chạy nhất? đánh
giá cao nhất?) — mock hiện chỉ lấy 4 sản phẩm đầu tiên trong danh sách. Cần
backend xác nhận lại tiêu chí thật khi triển khai.

**Response lỗi cần xử lý:** 500.

---

### GET /products/:id

**Mục đích:** Lấy chi tiết 1 sản phẩm cho storefront: giá, giá gốc/% giảm, màu
sắc, thông số kỹ thuật, số sao trung bình, phân bố đánh giá theo sao, và danh
sách đánh giá của khách hàng.
**Dùng ở màn hình:** Chi tiết sản phẩm (`customer-chi-tiet-san-pham.png` —
`src/pages/customer/ProductDetailPage.tsx`).

**Response thành công (200)**
```json
{
  "id": "NV-NX2-BLK",
  "name": "Tai nghe chống ồn Nova X2",
  "category": "Thiết bị âm thanh",
  "price": 2490000,
  "originalPrice": 2990000,
  "discountPercent": 17,
  "stock": 4,
  "sold": 482,
  "description": "Tai nghe chống ồn chủ động Nova X2 mang lại âm thanh cân bằng...",
  "colors": ["Đen", "Trắng", "Xanh"],
  "specs": [{ "label": "Pin", "value": "30 giờ nghe nhạc" }],
  "rating": 4.8,
  "reviewCount": 312,
  "ratingBreakdown": { "star5": 72, "star4": 18, "star3": 6, "star2": 3, "star1": 1 },
  "reviews": [
    { "id": "rv_01", "author": "Lê Thị Hoa", "rating": 5, "date": "19/07/2026", "content": "Âm thanh rất tốt..." }
  ]
}
```

**Ghi chú quan trọng:** ảnh thiết kế chỉ thể hiện đầy đủ dữ liệu này (giá gốc,
màu sắc, đánh giá...) cho đúng 1 sản phẩm mẫu ("Tai nghe chống ồn Nova X2").
Các sản phẩm khác trong mock chỉ có `rating`/`reviewCount` cơ bản (lấy từ ảnh
trang chủ), chưa có `colors`/`reviews`/`ratingBreakdown`/giá gốc — BE cần đảm
bảo trả đủ dữ liệu thật cho mọi sản phẩm khi triển khai.

Nút "Viết đánh giá" ở khối đánh giá sản phẩm nay đã được ghép API — xem
`POST /products/:id/reviews` ngay bên dưới `GET /products/:id/related`.

**Response lỗi cần xử lý:**
- 404 — không tìm thấy sản phẩm: hiển thị "Không tìm thấy sản phẩm."
- 500.

---

### GET /products/:id/related

**Mục đích:** Lấy danh sách sản phẩm liên quan hiển thị ở cuối trang chi tiết
sản phẩm.
**Dùng ở màn hình:** Chi tiết sản phẩm — khối "Sản phẩm liên quan".

**Response thành công (200)**: mảng `Product` rút gọn (id, name, price), tối
đa 4 sản phẩm.

**Ghi chú:** ảnh thiết kế `customer-chi-tiet-san-pham.png` thực chất hiển thị
lại đúng 4 sản phẩm ở khối "Sản phẩm nổi bật" (kể cả chính sản phẩm đang xem)
— nhiều khả năng đây chỉ là dữ liệu placeholder lặp lại trong ảnh mock, không
phải chủ đích thiết kế. Mock hiện triển khai theo hành vi hợp lý hơn: loại trừ
sản phẩm đang xem, lấy tối đa 4 sản phẩm còn lại. Cần xác nhận lại với người
dùng nếu hành vi mong muốn khác.

**Response lỗi cần xử lý:** 404 / 500.

---

### POST /products/:id/reviews

**Mục đích:** Gửi đánh giá mới (số sao + nội dung) cho 1 sản phẩm.
**Dùng ở màn hình:** Chi tiết sản phẩm — modal "Viết đánh giá"
(`src/components/customer/WriteReviewModal.tsx`), mở từ nút "Viết đánh giá"
ở khối đánh giá sản phẩm. Đây là nút vốn chỉ là placeholder tĩnh (`title="Chưa
có thiết kế cho form viết đánh giá"`), chưa có ảnh thiết kế riêng — modal được
tự thiết kế bổ sung theo đúng pattern popup đã dùng ở `AddProductModal.tsx`
(khu vực admin).

**Request**
- Params: `id` — mã sản phẩm
- Body (JSON):
```json
{ "rating": 5, "content": "Sản phẩm dùng rất tốt, đóng gói cẩn thận." }
```

**Response thành công (200)**: trả về object `Product` đầy đủ sau khi thêm
đánh giá (cấu trúc giống response của `GET /products/:id`), với đánh giá mới
được thêm vào đầu mảng `reviews` và `reviewCount` tăng thêm 1.

**Ghi chú:** mock hiện gán tác giả đánh giá cố định là "Trần Bảo Anh" (trùng
tài khoản khách hàng demo đang đăng nhập, xem `GET /me/profile`) vì storefront
chưa có màn đăng nhập/token thật để xác định người dùng. Mock cũng **chưa tính
lại** `ratingBreakdown` (phân bố % theo từng mức sao) sau khi có đánh giá mới
— backend thật cần tính lại giá trị này cho chính xác.

**Response lỗi cần xử lý:**
- 400 — thiếu `rating` (ngoài khoảng 1-5) hoặc `content` rỗng: "Vui lòng chọn
  số sao đánh giá." / "Vui lòng nhập nội dung đánh giá."
- 401 — chưa đăng nhập (giả định, storefront hiện không có màn đăng nhập
  riêng nên chưa xử lý case này ở FE).
- 404 — không tìm thấy sản phẩm.
- 500.

---

## Customer — Khuyến mãi

### GET /promotions

**Mục đích:** Lấy danh sách ưu đãi/mã giảm giá đang áp dụng.
**Dùng ở màn hình:** Khuyến mãi (`customer-khuyen-mai.png` —
`src/pages/customer/PromotionsPage.tsx`).

**Response thành công (200)**
```json
[
  { "id": "promo_01", "title": "Giảm 15%", "description": "Giảm 15% cho đơn hàng đầu tiên", "note": "Áp dụng cho khách hàng mới, tối đa ₫300.000", "code": "NOVA15" }
]
```

**Ghi chú:** nút "Sao chép mã" chỉ copy mã vào clipboard ở phía frontend
(`navigator.clipboard`), không gọi API nào — mã khuyến mãi thật sự được áp
dụng khi khách hàng nhập ở bước thanh toán (hiện `POST /orders` bên dưới
chưa nhận field mã giảm giá vì ảnh thanh toán không có ô nhập mã, số tiền
giảm ₫200.000 đang bị hardcode ở FE, xem ghi chú tại `POST /orders`).

**Response lỗi cần xử lý:** 500.

---

## Customer — Tin công nghệ

### GET /posts

**Mục đích:** Lấy danh sách bài viết đã đăng (không bao gồm bản nháp) cho
storefront.
**Dùng ở màn hình:** Tin công nghệ (`customer-tin-cong-nghe.png` —
`src/pages/customer/ArticlesPage.tsx`) và khối "Tin công nghệ mới nhất" ở
trang chủ (dùng thêm tham số giới hạn số lượng, xem `GET /posts/featured`).

**Response thành công (200)**
```json
[
  { "id": "bv_01", "title": "Nova Phone 13 lộ diện với chip thế hệ mới", "tag": "Sản phẩm", "publishedAt": "18/07/2026", "views": 4200 }
]
```

**Ghi chú quan trọng:** ảnh `customer-tin-cong-nghe.png` hiển thị 6 bài viết
đã đăng, trong đó 3 bài không có sẵn trong dữ liệu mock ban đầu của khu vực
admin (`GET /admin/posts` chỉ có 3 bài đã đăng + 1 bài nháp). Đặc biệt, tiêu đề
"So sánh tai nghe chống ồn tầm trung 2026" trùng với bài đang ở trạng thái Bản
nháp bên admin (`bv_04`) — để không phá vỡ demo bên admin, bài viết này được
thêm là **bản ghi mới** (`bv_05`, đã đăng) thay vì đổi trạng thái `bv_04`. Cần
xác nhận lại với người dùng/BE đây là 1 bài hay 2 bài viết khác nhau khi có
backend thật. 2 bài còn lại ("GearNova mở rộng showroom tại TP.HCM", "Cách
chọn laptop phù hợp cho công việc") được thêm mới hoàn toàn theo đúng tiêu đề/
tag/ngày đăng trong ảnh, nội dung chi tiết là giả định vì ảnh không có trang
chi tiết cho 2 bài này.

Field `tag` (badge "Sản phẩm"/"Sự kiện"/"Mẹo hay") là field mới bổ sung so với
`Post` gốc bên admin — admin hiện chưa có UI để chọn `tag` khi tạo/sửa bài
viết (ảnh `admin-bai-viet.png` không có ô này); cần bổ sung UI đó bên admin
nếu muốn nhân viên tự gán tag khi đăng bài.

**Response lỗi cần xử lý:** 500.

---

### GET /posts/featured

**Mục đích:** Lấy N bài viết mới nhất đã đăng, dùng cho khối rút gọn ở trang
chủ.
**Dùng ở màn hình:** Trang chủ — khối "Tin công nghệ mới nhất" (3 bài).

**Request**
- Params/Query: `limit` (mặc định 3)

**Response thành công (200)**: mảng `Post` giống `GET /posts`, giới hạn theo
`limit`.

**Response lỗi cần xử lý:** 500.

---

### GET /posts/:id (dùng chung với admin)

**Mục đích:** Lấy chi tiết 1 bài viết. Đây là API dùng chung với
`GET /admin/posts/:id` đã mô tả ở phần Admin — Bài viết phía trên (cùng
1 endpoint, storefront gọi lại y hệt để hiển thị trang chi tiết bài viết công
khai).
**Dùng ở màn hình:** Chi tiết bài viết (`customer-chi-tiet-bai-viet.png` —
`src/pages/customer/ArticleDetailPage.tsx`).

**Response thành công (200)**: giống response của `GET /admin/posts/:id`,
bổ sung thêm field `tag` và `author` (vd `"Đội ngũ biên tập GearNova"` — lấy
từ dòng "Đăng ngày ... · Đội ngũ biên tập GearNova" duy nhất thấy được trong
ảnh, áp dụng làm tác giả mặc định cho mọi bài viết vì không có ảnh nào khác
thể hiện tác giả khác).

**Response lỗi cần xử lý:** 404 — hiển thị "Không tìm thấy bài viết."; 500.

---

## Customer — Thanh toán, Chuyển khoản QR, Theo dõi đơn hàng

### POST /orders

**Mục đích:** Tạo đơn hàng mới từ giỏ hàng khi khách hàng bấm "Đặt hàng".
**Dùng ở màn hình:** Thanh toán (`customer-thanh-toan.png` —
`src/pages/customer/CheckoutPage.tsx`).

**Request**
- Body (JSON):
```json
{
  "items": [
    { "productId": "NV-NX2-BLK", "name": "Tai nghe chống ồn Nova X2", "price": 2490000, "quantity": 1 },
    { "productId": "NV-NFIT-01", "name": "Đồng hồ thông minh Nova Fit", "price": 3290000, "quantity": 1 }
  ],
  "shippingAddress": { "fullName": "Trần Bảo Anh", "phone": "0912 345 678", "address": "123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh" },
  "paymentMethod": "chuyen-khoan-qr",
  "subtotal": 5780000,
  "shippingFee": 30000,
  "discount": 200000,
  "total": 5610000
}
```

**Response thành công (200)**
```json
{
  "id": "DH-10241",
  "createdAt": "20/07/2026",
  "trackingStatus": "da-dat-hang",
  "items": [{ "productId": "NV-NX2-BLK", "name": "Tai nghe chống ồn Nova X2", "price": 2490000, "quantity": 1 }],
  "shippingAddress": { "fullName": "Trần Bảo Anh", "phone": "0912 345 678", "address": "123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh" },
  "subtotal": 5780000,
  "shippingFee": 30000,
  "discount": 200000,
  "total": 5610000,
  "paymentMethod": "chuyen-khoan-qr",
  "paidAt": null
}
```

**Ghi chú quan trọng (nhiều giả định — cần backend/BA xác nhận lại):**
- Địa chỉ giao hàng, phí vận chuyển (₫30.000) và số tiền giảm giá (₫200.000)
  đang bị **hardcode ở frontend** theo đúng số liệu trong ảnh thiết kế, vì
  ảnh không thể hiện cách tính các giá trị này hay ô nhập mã giảm giá. Backend
  thật cần tính lại phí ship theo địa chỉ/đơn vị vận chuyển thực tế và áp dụng
  mã giảm giá theo logic khuyến mãi thật (liên kết với `GET /promotions`).
- Mã đơn hàng mock luôn trả về cố định `"DH-10241"` (không sinh động) — chỉ để
  phục vụ demo luồng Thanh toán → QR → Thành công → Theo dõi đơn hàng xuyên
  suốt. Backend thật phải sinh mã đơn duy nhất.
- Với `paymentMethod` khác `chuyen-khoan-qr` (COD/Thẻ ngân hàng/Ví điện tử),
  ảnh thiết kế không có màn hình xử lý riêng (vd nhập thông tin thẻ, redirect
  cổng thanh toán) — mock coi như thanh toán thành công ngay lập tức và điều
  hướng thẳng tới trang "Thanh toán thành công". Cần bổ sung thiết kế/API
  riêng cho từng phương thức khi triển khai thật.
- Nếu giỏ hàng rỗng, mock trả lỗi 400 (xem bên dưới) — ảnh thiết kế không có
  trạng thái giỏ hàng rỗng ở trang Thanh toán, đây là giả định hợp lý để form
  không submit được khi không có sản phẩm.

**Response lỗi cần xử lý:**
- 400 — giỏ hàng rỗng: "Giỏ hàng đang trống, vui lòng chọn sản phẩm trước khi
  đặt hàng."
- 401 — chưa đăng nhập (nếu backend yêu cầu đăng nhập mới được đặt hàng — ảnh
  thiết kế không làm rõ, storefront hiện không có màn đăng nhập riêng nên giả
  định luôn ở trạng thái "đã đăng nhập").
- 500 — "Đặt hàng thất bại. Vui lòng thử lại."

---

### POST /orders/:id/confirm-qr-payment

**Mục đích:** Xác nhận khách hàng đã chuyển khoản (khi bấm "Tôi đã chuyển
khoản"), đánh dấu đơn hàng đã thanh toán.
**Dùng ở màn hình:** Chuyển khoản QR (`customer-chuyen-khoan-qr.png` —
`src/pages/customer/QrTransferPage.tsx`).

**Request:** không có body.

**Response thành công (200)**: trả về `CustomerOrder` đầy đủ với `paidAt`
đã có giá trị (giống cấu trúc response của `POST /orders`).

**Ghi chú:** Bộ đếm ngược "Còn lại 14:32 để hoàn tất thanh toán" hiện chỉ chạy
ở frontend (không đồng bộ với thời gian thực tạo đơn từ backend) — khi hết
thời gian, ảnh thiết kế không thể hiện trạng thái "hết hạn" nên frontend hiện
chưa xử lý (đếm về 00:00 rồi dừng). Backend thật nên trả thêm field hạn thanh
toán (vd `expiresAt`) để frontend tính đúng thời gian còn lại và biết khi nào
đơn hàng bị huỷ do quá hạn.

**Response lỗi cần xử lý:**
- 404 — không tìm thấy đơn hàng.
- 410 — đơn hàng đã quá hạn thanh toán (giả định, cần bổ sung UI xử lý khi có
  thiết kế).
- 500 — "Xác nhận chuyển khoản thất bại. Vui lòng thử lại."

---

### GET /orders/:id

**Mục đích:** Lấy chi tiết đơn hàng để hiển thị trang theo dõi đơn hàng (lịch
sử trạng thái, sản phẩm, địa chỉ giao hàng).
**Dùng ở màn hình:** Theo dõi đơn hàng (`customer-theo-doi-don-hang.png` —
`src/pages/customer/OrderTrackingPage.tsx`), cũng được dùng lại ở trang
"Thanh toán thành công" (`customer-thanh-toan-thanh-cong.png`) để hiển thị
tóm tắt đơn vừa đặt (frontend hiện truyền thẳng dữ liệu qua điều hướng route
thay vì gọi lại API — nếu người dùng vào thẳng URL `/checkout/success`
không qua luồng đặt hàng, trang sẽ không có dữ liệu để hiển thị).

**Response thành công (200)**
```json
{
  "id": "DH-10241",
  "createdAt": "20/07/2026",
  "trackingStatus": "dang-giao-hang",
  "trackingSteps": [
    { "status": "da-dat-hang", "label": "Đã đặt hàng", "time": "20/07 · 09:12", "completed": true },
    { "status": "da-xac-nhan", "label": "Đã xác nhận", "time": "20/07 · 10:05", "completed": true },
    { "status": "dang-giao-hang", "label": "Đang giao hàng", "time": "20/07 · 14:40", "completed": true },
    { "status": "da-giao", "label": "Đã giao", "time": "Dự kiến 22/07", "completed": false }
  ],
  "items": [{ "productId": "NV-NX2-BLK", "name": "Tai nghe chống ồn Nova X2", "price": 2490000, "quantity": 1 }],
  "shippingAddress": { "fullName": "Trần Bảo Anh", "phone": "0912 345 678", "address": "123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh" },
  "subtotal": 5780000,
  "shippingFee": 30000,
  "discount": 200000,
  "total": 5610000,
  "paymentMethod": "chuyen-khoan-qr",
  "paidAt": "20/07/2026 · 14:22"
}
```

**Ghi chú:** mã đơn hàng `"DH-10241"` trùng ngẫu nhiên với 1 đơn khác trong
mock của khu vực admin (`GET /admin/orders`, khách "Trần Thị Mai") — 2 bộ dữ
liệu mock độc lập nhau, backend thật cần đảm bảo mã đơn hàng duy nhất toàn hệ
thống. Nút "Liên hệ hỗ trợ" ở trang theo dõi đơn hàng **chưa được ghép API**
vì ảnh thiết kế không có trang/form liên hệ hỗ trợ riêng.

**Response lỗi cần xử lý:**
- 404 — không tìm thấy đơn hàng: hiển thị "Không tìm thấy đơn hàng."
- 500.

---

## Customer — Cài đặt tài khoản

### GET /me/profile

**Mục đích:** Lấy thông tin cá nhân của khách hàng đang đăng nhập.
**Dùng ở màn hình:** Cài đặt tài khoản — tab "Thông tin cá nhân"
(`customer-cai-dat-tai-khoan.png` — `src/pages/customer/AccountSettingsPage.tsx`).

**Response thành công (200)**
```json
{
  "fullName": "Trần Bảo Anh",
  "phone": "0912 345 678",
  "email": "baoanh.tran@gmail.com",
  "dateOfBirth": "14/03/1996",
  "gender": "nam"
}
```

**Response lỗi cần xử lý:** 401 — chưa đăng nhập; 500.

---

### PUT /me/profile

**Mục đích:** Cập nhật thông tin cá nhân.
**Dùng ở màn hình:** Cài đặt tài khoản — tab "Thông tin cá nhân", nút "Lưu
thay đổi".

**Request**
- Body (JSON):
```json
{ "fullName": "Trần Bảo Anh", "phone": "0912 345 678", "email": "baoanh.tran@gmail.com", "dateOfBirth": "14/03/1996", "gender": "nam" }
```

**Response thành công (200)**: trả về `CustomerProfile` sau khi cập nhật
(cấu trúc giống `GET /me/profile`).

**Ghi chú quan trọng:** ảnh `customer-cai-dat-tai-khoan.png` chỉ thể hiện đầy
đủ nội dung cho tab "Thông tin cá nhân". 4 tab còn lại trong sidebar ("Địa chỉ
giao hàng", "Phương thức thanh toán", "Đổi mật khẩu", "Thông báo") nay đã được
tự thiết kế bổ sung (xem các mục ngay bên dưới) vì không có ảnh thiết kế riêng
— trước đó chỉ hiển thị placeholder "Chưa có thiết kế cho mục này.". Nút "Đổi
ảnh đại diện" vẫn **chưa có API** (chỉ là UI tĩnh, `ImageDropzone` chưa xử lý
upload thật). Nút "Đăng xuất" trong sidebar không có popup xác nhận (khác với
khu vực admin) vì ảnh thiết kế không thể hiện popup này — bấm là đăng xuất
ngay; dropdown tài khoản ở header (`CustomerHeader.tsx`) cũng áp dụng hành vi
tương tự.

**Response lỗi cần xử lý:**
- 400 — thiếu `fullName`/`phone`/`email`: "Vui lòng nhập đầy đủ họ tên, số
  điện thoại và email."
- 401 / 500.

---

### GET /me/addresses

**Mục đích:** Lấy danh sách địa chỉ giao hàng đã lưu của khách hàng.
**Dùng ở màn hình:** Cài đặt tài khoản — tab "Địa chỉ giao hàng"
(`src/components/customer/account/AddressesTab.tsx`). Tab này vốn chỉ là
placeholder tĩnh, chưa có ảnh thiết kế riêng — được tự thiết kế bổ sung theo
đúng phong cách các card thông tin đã dùng trong app.

**Response thành công (200)**
```json
[
  {
    "id": "dc_01",
    "recipientName": "Trần Bảo Anh",
    "phone": "0912 345 678",
    "address": "123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    "isDefault": true
  }
]
```

**Response lỗi cần xử lý:** 401 / 500.

---

### POST /me/addresses

**Mục đích:** Thêm địa chỉ giao hàng mới.
**Dùng ở màn hình:** Tab "Địa chỉ giao hàng" — modal "Thêm địa chỉ mới"
(`AddressFormModal.tsx`).

**Request**
- Body (JSON):
```json
{
  "recipientName": "Trần Bảo Anh",
  "phone": "0912 345 678",
  "address": "45 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh"
}
```

**Response thành công (200)**: trả về `CustomerAddress` vừa tạo (cấu trúc
giống 1 phần tử trong response của `GET /me/addresses`). Mock tự đặt
`isDefault: true` nếu đây là địa chỉ đầu tiên của khách hàng.

**Response lỗi cần xử lý:**
- 400 — thiếu `recipientName`/`phone`/`address`: "Vui lòng nhập đầy đủ tên
  người nhận, số điện thoại và địa chỉ."
- 401 / 500.

---

### PUT /me/addresses/:id

**Mục đích:** Cập nhật 1 địa chỉ giao hàng.
**Dùng ở màn hình:** Tab "Địa chỉ giao hàng" — link "Sửa" trên mỗi địa chỉ,
dùng lại modal `AddressFormModal.tsx`.

**Request body:** giống `POST /me/addresses`.

**Response thành công (200)**: trả về `CustomerAddress` sau khi cập nhật.

**Response lỗi cần xử lý:** 404 — không tìm thấy địa chỉ; 401 / 500.

---

### DELETE /me/addresses/:id

**Mục đích:** Xoá 1 địa chỉ giao hàng.
**Dùng ở màn hình:** Tab "Địa chỉ giao hàng" — link "Xoá".

**Response thành công (200)**
```json
{ "message": "Đã xoá địa chỉ." }
```

**Response lỗi cần xử lý:** 404 / 401 / 500.

---

### PUT /me/addresses/:id/set-default

**Mục đích:** Đặt 1 địa chỉ làm địa chỉ mặc định (các địa chỉ khác tự động bỏ
mặc định).
**Dùng ở màn hình:** Tab "Địa chỉ giao hàng" — link "Đặt làm mặc định" (chỉ
hiện với địa chỉ chưa phải mặc định).

**Response thành công (200)**: trả về mảng `CustomerAddress` đầy đủ sau khi
cập nhật (giống response của `GET /me/addresses`).

**Response lỗi cần xử lý:** 404 / 401 / 500.

---

### GET /me/payment-methods

**Mục đích:** Lấy danh sách phương thức thanh toán đã lưu (thẻ ngân hàng/ví
điện tử, số đã che bớt).
**Dùng ở màn hình:** Cài đặt tài khoản — tab "Phương thức thanh toán"
(`src/components/customer/account/PaymentMethodsTab.tsx`). Tab này vốn chỉ là
placeholder tĩnh, chưa có ảnh thiết kế riêng — được tự thiết kế bổ sung.

**Response thành công (200)**
```json
[
  {
    "id": "pm_01",
    "type": "the-ngan-hang",
    "label": "Vietcombank",
    "maskedNumber": "**** **** **** 4242",
    "holderName": "TRAN BAO ANH",
    "isDefault": true
  }
]
```

**Response lỗi cần xử lý:** 401 / 500.

---

### POST /me/payment-methods

**Mục đích:** Thêm phương thức thanh toán mới.
**Dùng ở màn hình:** Tab "Phương thức thanh toán" — modal "Thêm phương thức
thanh toán" (`PaymentMethodFormModal.tsx`).

**Request**
- Body (JSON):
```json
{
  "type": "the-ngan-hang",
  "label": "Techcombank",
  "number": "4242424242424242",
  "holderName": "TRAN BAO ANH"
}
```
`type` nhận 1 trong 2 giá trị: `the-ngan-hang` | `vi-dien-tu`. `holderName` chỉ
áp dụng cho `the-ngan-hang`.

**Ghi chú bảo mật quan trọng:** field `number` ở request là số thẻ/số ví thô
do người dùng nhập ở form — **frontend hiện KHÔNG lưu số này**, chỉ dùng để
tự tính `maskedNumber` (che bớt số) ngay trên client rồi gửi lên (mock).
**Backend thật tuyệt đối không được lưu số thẻ/số ví đầy đủ** — cần tích hợp
cổng thanh toán/tokenization thật (Stripe, VNPay...) để xử lý và lưu token an
toàn thay vì số thẻ thô. Đây là giả định đơn giản hoá chỉ phục vụ demo UI.

**Response thành công (200)**: trả về `PaymentMethod` vừa tạo, với
`maskedNumber` đã được che bớt (VD: `"**** **** **** 4242"` cho thẻ ngân hàng,
`"090*****678"` cho ví điện tử).

**Response lỗi cần xử lý:**
- 400 — thiếu `label`/`number`: "Vui lòng nhập đầy đủ tên ngân hàng/ví và số
  thẻ/số ví."
- 401 / 500.

---

### DELETE /me/payment-methods/:id

**Mục đích:** Xoá 1 phương thức thanh toán.
**Dùng ở màn hình:** Tab "Phương thức thanh toán" — link "Xoá".

**Response thành công (200)**
```json
{ "message": "Đã xoá phương thức thanh toán." }
```

**Response lỗi cần xử lý:** 404 / 401 / 500.

---

### PUT /me/payment-methods/:id/set-default

**Mục đích:** Đặt 1 phương thức thanh toán làm mặc định.
**Dùng ở màn hình:** Tab "Phương thức thanh toán" — link "Đặt làm mặc định".

**Response thành công (200)**: trả về mảng `PaymentMethod` đầy đủ sau khi cập
nhật (giống response của `GET /me/payment-methods`).

**Response lỗi cần xử lý:** 404 / 401 / 500.

---

### PUT /me/password

**Mục đích:** Đổi mật khẩu đăng nhập của khách hàng.
**Dùng ở màn hình:** Cài đặt tài khoản — tab "Đổi mật khẩu"
(`src/components/customer/account/ChangePasswordTab.tsx`). Tab này vốn chỉ là
placeholder tĩnh, chưa có ảnh thiết kế riêng — form được tự thiết kế bổ sung
(3 field: mật khẩu hiện tại, mật khẩu mới, xác nhận mật khẩu mới), dùng lại
component `InputField` (đã có sẵn tính năng ẩn/hiện mật khẩu).

**Request**
- Body (JSON):
```json
{ "currentPassword": "matkhaucu123", "newPassword": "matkhaumoi456", "confirmPassword": "matkhaumoi456" }
```

**Response thành công (200)**
```json
{ "message": "Đổi mật khẩu thành công." }
```

**Ghi chú:** frontend đã validate `newPassword === confirmPassword` ngay phía
client trước khi gọi API (hiển thị lỗi "Mật khẩu xác nhận không khớp với mật
khẩu mới." mà không cần gọi API) — nhưng backend thật **vẫn cần validate lại**
ở phía server, không chỉ tin tưởng frontend. Mock cũng chưa kiểm tra
`currentPassword` có đúng với mật khẩu hiện tại hay không (vì không có hệ
thống xác thực thật) — backend thật bắt buộc phải kiểm tra.

**Response lỗi cần xử lý:**
- 400 — thiếu field hoặc `newPassword` ngắn hơn 8 ký tự: "Vui lòng nhập đầy đủ
  mật khẩu hiện tại và mật khẩu mới." / "Mật khẩu mới phải có ít nhất 8 ký
  tự."
- 401 — `currentPassword` không đúng: cần backend trả lỗi rõ ràng, FE hiển thị
  nội dung lỗi trả về.
- 500.

---

### GET /me/notification-preferences

**Mục đích:** Lấy danh sách tuỳ chọn thông báo (bật/tắt) của khách hàng.
**Dùng ở màn hình:** Cài đặt tài khoản — tab "Thông báo"
(`src/components/customer/account/NotificationsTab.tsx`). Tab này vốn chỉ là
placeholder tĩnh, chưa có ảnh thiết kế riêng — 3 tuỳ chọn thông báo (khuyến
mãi qua email, cập nhật đơn hàng qua SMS, bản tin công nghệ hàng tuần) là giả
định hợp lý dựa trên các tính năng hiện có của app (khuyến mãi, đơn hàng, tin
công nghệ), cần xác nhận lại với người dùng nếu muốn danh sách khác.

**Response thành công (200)**
```json
[
  {
    "id": "nt_01",
    "label": "Khuyến mãi qua email",
    "description": "Nhận thông tin ưu đãi, mã giảm giá mới nhất qua email.",
    "enabled": true
  }
]
```

**Response lỗi cần xử lý:** 401 / 500.

---

### PUT /me/notification-preferences/:id

**Mục đích:** Bật/tắt 1 tuỳ chọn thông báo.
**Dùng ở màn hình:** Tab "Thông báo" — mỗi công tắc `ToggleSwitch`
(`src/components/ui/ToggleSwitch.tsx`, component mới, có thể tái sử dụng cho
admin sau này).

**Request**
- Body (JSON):
```json
{ "enabled": false }
```

**Response thành công (200)**: trả về mảng `NotificationPreference` đầy đủ
sau khi cập nhật (giống response của `GET /me/notification-preferences`).

**Response lỗi cần xử lý:** 404 — không tìm thấy tuỳ chọn; 401 / 500.

---

## Admin — Hồ sơ cá nhân

> Bổ sung mới: trước đây, admin **không có cách nào xem/sửa thông tin cá nhân
> của chính mình** — `AdminSidebar.tsx`/`AdminTopbar.tsx` chỉ hiển thị tĩnh
> `userName`/`userRole` (hardcode "Nguyễn Văn A" / "Quản lý cửa hàng" truyền
> từ `AdminLayout.tsx`), không bấm vào được; tab "Người dùng & phân quyền"
> trong Cài đặt chỉ quản lý NHÂN VIÊN KHÁC; tab "Hồ sơ cửa hàng" là hồ sơ CỬA
> HÀNG, khác với hồ sơ cá nhân tài khoản. Trang mới `/admin/profile`
> (`src/pages/admin/AdminProfilePage.tsx`) giải quyết khoảng trống này, dựng
> theo đúng phong cách tab "Thông tin cá nhân" bên customer. Avatar/tên ở
> `AdminSidebar.tsx` và `AdminTopbar.tsx` nay là link tới trang này.

### GET /admin/me/profile

**Mục đích:** Lấy thông tin cá nhân của admin đang đăng nhập (họ tên, email,
số điện thoại, vai trò).
**Dùng ở màn hình:** Hồ sơ cá nhân (`src/pages/admin/AdminProfilePage.tsx`).

**Response thành công (200)**
```json
{
  "fullName": "Nguyễn Văn A",
  "email": "a.nguyen@gearnova.vn",
  "phone": "0901 234 567",
  "role": "Quản lý cửa hàng"
}
```

**Ghi chú:** mock dùng lại đúng tên/vai trò đã hardcode ở `AdminLayout.tsx`
("Nguyễn Văn A" / "Quản lý cửa hàng", trùng nhân viên `nv_01` trong
`GET /admin/staff`) để nhất quán xuyên suốt khu vực admin. Field `role` là
label hiển thị (readonly trên form, không có ô chỉnh sửa) — backend thật nên
suy ra label này từ `StaffRole` (`quan-ly` | `nv-ban-hang` | `nv-kho`) của tài
khoản đang đăng nhập.

**Response lỗi cần xử lý:** 401 / 500.

---

### PUT /admin/me/profile

**Mục đích:** Cập nhật thông tin cá nhân của admin đang đăng nhập.
**Dùng ở màn hình:** Hồ sơ cá nhân — nút "Lưu thay đổi".

**Request**
- Body (JSON):
```json
{ "fullName": "Nguyễn Văn A", "email": "a.nguyen@gearnova.vn", "phone": "0901 234 567" }
```
Không nhận `role` — vai trò chỉ có thể thay đổi bởi người khác có quyền quản
lý người dùng (xem `PUT /admin/staff/:id/toggle-status` và các API staff khác
chưa có sẵn cho việc đổi vai trò), không tự sửa vai trò của chính mình qua màn
này.

**Response thành công (200)**: trả về `AdminProfile` sau khi cập nhật (cấu
trúc giống response của `GET /admin/me/profile`).

**Response lỗi cần xử lý:**
- 400 — thiếu `fullName`/`email`/`phone`: "Vui lòng nhập đầy đủ họ tên, email
  và số điện thoại."
- 401 / 500.

---

## Tổng hợp endpoint

| Method | Path | Mô tả |
| --- | --- | --- |
| POST | /auth/login | Đăng nhập bằng email + mật khẩu |
| POST | /auth/register | Tạo tài khoản mới |
| POST | /auth/forgot-password | Gửi email liên kết đặt lại mật khẩu |
| GET | /admin/dashboard | Lấy số liệu tổng quan cho Dashboard |
| GET | /admin/revenue | Lấy số liệu trang Doanh thu |
| POST | /admin/revenue/export | Xuất báo cáo doanh thu (mock, chưa có file thật) |
| GET | /admin/orders | Lấy danh sách đơn hàng (lọc trạng thái + tìm kiếm) |
| GET | /admin/customers | Lấy tổng quan + danh sách khách hàng |
| GET | /admin/products | Lấy danh sách sản phẩm (tìm kiếm, lọc, phân trang) |
| GET | /admin/products/:id | Lấy chi tiết 1 sản phẩm |
| POST | /admin/products | Tạo sản phẩm mới |
| PUT | /admin/products/:id | Cập nhật sản phẩm |
| DELETE | /admin/products/:id | Xoá sản phẩm |
| GET | /admin/posts | Lấy danh sách bài viết (lọc trạng thái) |
| GET | /admin/posts/:id | Lấy chi tiết 1 bài viết |
| POST | /admin/posts | Tạo bài viết mới |
| PUT | /admin/posts/:id | Cập nhật bài viết |
| DELETE | /admin/posts/:id | Xoá bài viết |
| GET | /admin/staff | Lấy danh sách nhân viên |
| GET | /admin/staff/permission-matrix | Lấy ma trận phân quyền theo vai trò |
| POST | /admin/staff/invite | Mời nhân viên mới qua email |
| PUT | /admin/staff/:id/toggle-status | Khoá/Mở khoá tài khoản nhân viên |
| GET | /products | Lấy danh sách sản phẩm công khai (tìm kiếm, lọc, sắp xếp) |
| GET | /products/featured | Lấy sản phẩm nổi bật cho trang chủ |
| GET | /products/:id | Lấy chi tiết 1 sản phẩm cho storefront |
| GET | /products/:id/related | Lấy sản phẩm liên quan |
| POST | /products/:id/reviews | Gửi đánh giá mới cho sản phẩm |
| GET | /promotions | Lấy danh sách ưu đãi/mã giảm giá |
| GET | /posts | Lấy danh sách bài viết đã đăng (storefront) |
| GET | /posts/featured | Lấy N bài viết mới nhất đã đăng |
| GET | /posts/:id | Lấy chi tiết 1 bài viết (dùng chung với admin) |
| POST | /orders | Tạo đơn hàng mới từ giỏ hàng |
| POST | /orders/:id/confirm-qr-payment | Xác nhận đã chuyển khoản QR |
| GET | /orders/:id | Lấy chi tiết đơn hàng để theo dõi |
| GET | /me/profile | Lấy thông tin cá nhân khách hàng đang đăng nhập |
| PUT | /me/profile | Cập nhật thông tin cá nhân |
| GET | /me/addresses | Lấy danh sách địa chỉ giao hàng |
| POST | /me/addresses | Thêm địa chỉ giao hàng mới |
| PUT | /me/addresses/:id | Cập nhật 1 địa chỉ giao hàng |
| DELETE | /me/addresses/:id | Xoá 1 địa chỉ giao hàng |
| PUT | /me/addresses/:id/set-default | Đặt 1 địa chỉ làm mặc định |
| GET | /me/payment-methods | Lấy danh sách phương thức thanh toán đã lưu |
| POST | /me/payment-methods | Thêm phương thức thanh toán mới |
| DELETE | /me/payment-methods/:id | Xoá 1 phương thức thanh toán |
| PUT | /me/payment-methods/:id/set-default | Đặt 1 phương thức thanh toán làm mặc định |
| PUT | /me/password | Đổi mật khẩu đăng nhập |
| GET | /me/notification-preferences | Lấy danh sách tuỳ chọn thông báo |
| PUT | /me/notification-preferences/:id | Bật/tắt 1 tuỳ chọn thông báo |
| GET | /admin/me/profile | Lấy thông tin cá nhân của admin đang đăng nhập |
| PUT | /admin/me/profile | Cập nhật thông tin cá nhân của admin đang đăng nhập |
