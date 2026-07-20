# GearNova

Frontend: React + TypeScript + Vite + Tailwind CSS v4.

## Quy trình: build UI từ ảnh thiết kế

Repo này có sẵn 1 custom agent tên **`design-to-code`** (định nghĩa tại
`.claude/agents/design-to-code.md`) chuyên xử lý toàn bộ quy trình:

1. Đọc và xem toàn bộ ảnh thiết kế bạn gửi.
2. Thống kê các tính năng/thành phần UI có trong từng ảnh.
3. Build giao diện React giống thiết kế trong ảnh.
4. Ghép sẵn lớp API (mock, có cấu trúc chuẩn REST) vào UI.
5. Tóm tắt toàn bộ API đã ghép vào [`API.md`](./API.md) để bạn code backend khớp
   ngay với những gì frontend đang gọi.

### Cách dùng

1. Bỏ ảnh thiết kế vào thư mục `designs/` (hoặc gửi trực tiếp ảnh trong chat).
2. Trong Claude Code, yêu cầu ví dụ: *"dùng agent design-to-code build UI từ ảnh
   trong thư mục designs/"* — agent sẽ tự đọc, phân tích, build và cập nhật
   `API.md`.
3. Sau khi agent xong, xem lại `API.md` và bắt đầu code backend theo đúng
   contract đã mô tả (method, path, request/response mẫu).

## Chạy dự án

```bash
npm install
npm run dev
```

## Cấu trúc thư mục chính

```
designs/            # nơi để ảnh thiết kế
src/
  components/        # component UI theo từng màn hình
  pages/              # (tạo khi cần) trang tương ứng route
  services/           # lớp gọi API (mock trước, đổi VITE_API_BASE_URL khi có backend thật)
  types/              # TypeScript types dùng chung
API.md               # tóm tắt API cần code backend (agent tự cập nhật)
```
