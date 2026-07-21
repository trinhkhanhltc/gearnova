import type { Order } from '../types/order.types'

// TODO: thay bằng gọi API thật khi backend sẵn sàng
export const mockOrders: Order[] = [
  { id: 'DH-10241', customerName: 'Trần Thị Mai', productName: 'Nova Book Pro 14', status: 'cho-xac-nhan', total: 18990000 },
  { id: 'DH-10240', customerName: 'Phạm Quốc Huy', productName: 'Tai nghe Nova X2', status: 'dang-xu-ly', total: 2490000 },
  { id: 'DH-10239', customerName: 'Lê Thị Hoa', productName: 'Loa Nova Sound Mini', status: 'da-giao', total: 890000 },
  { id: 'DH-10238', customerName: 'Nguyễn Đức Anh', productName: 'Đồng hồ Nova Fit', status: 'da-giao', total: 3290000 },
  { id: 'DH-10237', customerName: 'Đỗ Thị Lan', productName: 'Sạc nhanh GaN 65W', status: 'da-huy', total: 490000 },
  { id: 'DH-10236', customerName: 'Vũ Minh Khang', productName: 'Nova Book Pro 14', status: 'da-giao', total: 18990000 },
]
