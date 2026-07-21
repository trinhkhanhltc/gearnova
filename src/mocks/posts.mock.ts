import type { Post } from '../types/post.types'

// TODO: thay bằng gọi API thật khi backend sẵn sàng
//
// Ghi chú (storefront khách hàng): ảnh `customer-tin-cong-nghe.png` thể hiện
// thêm 3 bài viết đã đăng ("So sánh tai nghe chống ồn tầm trung 2026",
// "GearNova mở rộng showroom tại TP.HCM", "Cách chọn laptop phù hợp cho công
// việc") không có trong dữ liệu mock ban đầu của khu vực admin. Trong đó tiêu
// đề "So sánh tai nghe chống ồn tầm trung 2026" trùng với bài `bv_04` (đang ở
// trạng thái Bản nháp bên admin) — để không phá vỡ demo bên admin (ảnh
// `admin-bai-viet.png` cho thấy đúng 1 bài bản nháp), bài viết này được thêm
// là bản ghi MỚI (`bv_05`, trạng thái Đã đăng) thay vì đổi trạng thái `bv_04`.
// Khi có backend thật, cần làm rõ với người dùng đây có phải cùng 1 bài viết
// hay 2 bài trùng tên khác nhau.
export const mockPosts: Post[] = [
  {
    id: 'bv_01',
    title: 'Nova Phone 13 lộ diện với chip thế hệ mới',
    status: 'da-dang',
    publishedAt: '18/07/2026',
    views: 4200,
    excerpt: 'Rò rỉ mới nhất hé lộ cấu hình chip và thiết kế của Nova Phone 13.',
    content:
      'Nova Phone 13 dự kiến ra mắt vào cuối năm nay với thiết kế mới, camera cải tiến và chip xử lý thế hệ tiếp theo mang lại hiệu năng vượt trội so với thế hệ trước.\n\nBên cạnh nâng cấp phần cứng, GearNova cho biết sản phẩm sẽ đi kèm thời gian sử dụng pin dài hơn và hỗ trợ sạc nhanh, đáp ứng nhu cầu sử dụng cả ngày của người dùng.\n\nThông tin về giá bán và ngày mở đặt hàng sẽ được GearNova công bố trong các bản tin tiếp theo — hãy theo dõi để không bỏ lỡ.',
    tag: 'Sản phẩm',
    author: 'Đội ngũ biên tập GearNova',
  },
  {
    id: 'bv_02',
    title: 'GearNova ra mắt dòng laptop Nova Book Pro',
    status: 'da-dang',
    publishedAt: '15/07/2026',
    views: 2800,
    excerpt: 'Nova Book Pro chính thức trình làng với hiệu năng vượt trội cho dân văn phòng.',
    content: 'GearNova vừa công bố dòng laptop Nova Book Pro hướng đến nhóm khách hàng doanh nghiệp...',
    tag: 'Sự kiện',
    author: 'Đội ngũ biên tập GearNova',
  },
  {
    id: 'bv_03',
    title: '5 cách kéo dài tuổi thọ pin thiết bị thông minh',
    status: 'da-dang',
    publishedAt: '10/07/2026',
    views: 5600,
    excerpt: 'Những mẹo đơn giản giúp pin thiết bị của bạn bền hơn theo thời gian.',
    content: 'Sạc pin đúng cách, tránh nhiệt độ cao và cập nhật phần mềm thường xuyên là những yếu tố...',
    tag: 'Mẹo hay',
    author: 'Đội ngũ biên tập GearNova',
  },
  {
    id: 'bv_04',
    title: 'So sánh tai nghe chống ồn tầm trung 2026',
    status: 'ban-nhap',
    publishedAt: null,
    views: null,
    excerpt: 'Tổng hợp và so sánh các mẫu tai nghe chống ồn đáng chú ý trong tầm giá phổ thông.',
    content: '',
  },
  {
    id: 'bv_05',
    title: 'So sánh tai nghe chống ồn tầm trung 2026',
    status: 'da-dang',
    publishedAt: '05/07/2026',
    views: 3100,
    excerpt: 'Tổng hợp và so sánh các mẫu tai nghe chống ồn đáng chú ý trong tầm giá phổ thông.',
    content:
      'GearNova tổng hợp và so sánh các mẫu tai nghe chống ồn đáng chú ý trong tầm giá phổ thông, giúp bạn dễ dàng chọn được sản phẩm phù hợp với nhu cầu sử dụng hằng ngày.',
    tag: 'Sản phẩm',
    author: 'Đội ngũ biên tập GearNova',
  },
  {
    id: 'bv_06',
    title: 'GearNova mở rộng showroom tại TP.HCM',
    status: 'da-dang',
    publishedAt: '28/06/2026',
    views: 1900,
    excerpt: 'GearNova chính thức khai trương thêm showroom mới nhằm phục vụ khách hàng tốt hơn.',
    content:
      'GearNova chính thức khai trương thêm showroom mới tại TP. Hồ Chí Minh, mở rộng mạng lưới trải nghiệm sản phẩm trực tiếp cho khách hàng khu vực phía Nam.',
    tag: 'Sự kiện',
    author: 'Đội ngũ biên tập GearNova',
  },
  {
    id: 'bv_07',
    title: 'Cách chọn laptop phù hợp cho công việc',
    status: 'da-dang',
    publishedAt: '20/06/2026',
    views: 2400,
    excerpt: 'Hướng dẫn chọn laptop phù hợp theo nhu cầu công việc văn phòng, kỹ thuật hay sáng tạo nội dung.',
    content:
      'Việc chọn laptop phù hợp phụ thuộc vào nhu cầu công việc: cấu hình cơ bản cho văn phòng, cấu hình mạnh hơn cho lập trình/kỹ thuật, hoặc màn hình màu chuẩn cho công việc sáng tạo nội dung.',
    tag: 'Mẹo hay',
    author: 'Đội ngũ biên tập GearNova',
  },
]
