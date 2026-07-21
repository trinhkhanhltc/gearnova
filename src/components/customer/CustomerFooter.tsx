/**
 * Footer dùng chung cho toàn bộ storefront khách hàng. Ảnh thiết kế chỉ thể
 * hiện footer này ở trang chủ, nhưng áp dụng đồng nhất cho mọi trang customer
 * (giống cách header được dùng chung — xem ghi chú ở `CustomerHeader`).
 */
export function CustomerFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-neutral-500 sm:flex-row">
        <p>© 2026 GearNova. Đã đăng ký bản quyền.</p>
        <div className="flex items-center gap-6">
          <span className="cursor-pointer hover:text-neutral-700" title="Chưa có thiết kế cho trang này">
            Điều khoản
          </span>
          <span className="cursor-pointer hover:text-neutral-700" title="Chưa có thiết kế cho trang này">
            Bảo mật
          </span>
          <span className="cursor-pointer hover:text-neutral-700" title="Chưa có thiết kế cho trang này">
            Liên hệ
          </span>
        </div>
      </div>
    </footer>
  )
}
