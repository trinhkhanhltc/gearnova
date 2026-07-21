import type { Promotion } from '../types/promotion.types'

// TODO: thay bằng gọi API thật khi backend sẵn sàng
export const mockPromotions: Promotion[] = [
  {
    id: 'promo_01',
    title: 'Giảm 15%',
    description: 'Giảm 15% cho đơn hàng đầu tiên',
    note: 'Áp dụng cho khách hàng mới, tối đa ₫300.000',
    code: 'NOVA15',
  },
  {
    id: 'promo_02',
    title: 'Giảm ₫200K',
    description: 'Giảm ₫200.000 cho đơn từ ₫5.000.000',
    note: 'Áp dụng toàn bộ danh mục sản phẩm',
    code: 'GEAR200',
  },
  {
    id: 'promo_03',
    title: 'Miễn phí vận chuyển',
    description: 'Miễn phí vận chuyển toàn quốc',
    note: 'Áp dụng cho đơn hàng từ ₫1.000.000',
    code: 'FREESHIP',
  },
  {
    id: 'promo_04',
    title: 'Giảm 10%',
    description: 'Giảm 10% cho thiết bị âm thanh',
    note: 'Áp dụng đến hết 31/07/2026',
    code: 'SOUND10',
  },
]
