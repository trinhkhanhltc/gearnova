# API cần code backend

File này được agent `design-to-code` tự động cập nhật mỗi khi ghép thêm 1 API
(mock) vào frontend. Dùng file này làm spec để code backend thật — khớp đúng
method, path, request/response mà frontend đang gọi.

Hiện chưa có API nào được ghép. Sau khi build UI từ ảnh thiết kế đầu tiên, các
mục sẽ được thêm vào đây theo format:

```
### METHOD /path

**Mục đích:** ...
**Dùng ở màn hình:** ...

**Request**
- Params/Query: ...
- Body (JSON): ...

**Response thành công (200)**
...

**Response lỗi cần xử lý:** ...
```

## Tổng hợp endpoint

| Method | Path | Mô tả |
| --- | --- | --- |
| _(chưa có)_ | | |
