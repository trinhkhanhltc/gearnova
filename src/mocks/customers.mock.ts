import type { CustomerOverview, CustomerProfile } from '../types/customer.types'

// TODO: thay bằng gọi API thật khi backend sẵn sàng
export const mockCustomerOverview: CustomerOverview = {
  totalCustomers: 2418,
  newThisMonth: 186,
  loyalCustomers: 312,
  customers: [
    {
      id: 'kh_01',
      name: 'Trần Bảo Anh',
      email: 'baoanh.tran@gmail.com',
      phone: '0912 345 678',
      ordersCount: 8,
      totalSpent: 24680000,
      joinedAt: '12/02/2025',
    },
    {
      id: 'kh_02',
      name: 'Lê Thị Hoa',
      email: 'hoa.le@gmail.com',
      phone: '0987 654 321',
      ordersCount: 15,
      totalSpent: 41200000,
      joinedAt: '03/11/2024',
    },
    {
      id: 'kh_03',
      name: 'Phạm Quốc Huy',
      email: 'huy.pham@gmail.com',
      phone: '0901 222 333',
      ordersCount: 3,
      totalSpent: 8970000,
      joinedAt: '20/05/2025',
    },
    {
      id: 'kh_04',
      name: 'Nguyễn Đức Anh',
      email: 'anh.nguyen@gmail.com',
      phone: '0933 444 555',
      ordersCount: 21,
      totalSpent: 68450000,
      joinedAt: '15/08/2023',
    },
    {
      id: 'kh_05',
      name: 'Đỗ Thị Lan',
      email: 'lan.do@gmail.com',
      phone: '0977 111 222',
      ordersCount: 1,
      totalSpent: 490000,
      joinedAt: '01/07/2026',
    },
  ],
}

// Hồ sơ khách hàng đang đăng nhập ở storefront (trang Cài đặt tài khoản).
// Dùng lại đúng thông tin của khách hàng `kh_01` ở trên (Trần Bảo Anh) vì
// ảnh thiết kế storefront hiển thị cùng tên/điện thoại/email/avatar "TB" —
// đây là giả định cho tài khoản khách hàng demo đang đăng nhập.
export const mockCustomerProfile: CustomerProfile = {
  fullName: 'Trần Bảo Anh',
  phone: '0912 345 678',
  email: 'baoanh.tran@gmail.com',
  dateOfBirth: '14/03/1996',
  gender: 'nam',
}
