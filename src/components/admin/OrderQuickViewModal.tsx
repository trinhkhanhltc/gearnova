import { Badge } from '../ui/Badge'
import { Modal } from '../ui/Modal'
import { orderStatusMeta } from '../../utils/statusMeta'
import { formatCurrency } from '../../utils/format'
import type { Order } from '../../types/order.types'

export interface OrderQuickViewModalProps {
  order: Order | null
  onClose: () => void
}

/**
 * Modal xem nhanh đơn hàng: hiển thị đúng dữ liệu đã có sẵn trong bảng đơn
 * hàng (không gọi thêm API, không bịa thêm field như địa chỉ giao hàng...
 * vì ảnh thiết kế chưa có trang chi tiết đơn hàng riêng).
 */
export function OrderQuickViewModal({ order, onClose }: OrderQuickViewModalProps) {
  return (
    <Modal open={order !== null} onClose={onClose}>
      {order && (
        <div>
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Chi tiết đơn hàng</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            >
              ×
            </button>
          </div>

          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-neutral-500">Mã đơn</dt>
              <dd className="font-semibold text-neutral-900">{order.id}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-neutral-500">Khách hàng</dt>
              <dd className="font-semibold text-neutral-900">{order.customerName}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-neutral-500">Sản phẩm</dt>
              <dd className="font-semibold text-neutral-900">{order.productName}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-neutral-500">Trạng thái</dt>
              <dd>
                <Badge tone={orderStatusMeta[order.status].tone}>{orderStatusMeta[order.status].label}</Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
              <dt className="text-neutral-500">Tổng tiền</dt>
              <dd className="text-lg font-bold text-neutral-900">{formatCurrency(order.total)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl border border-neutral-300 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            Đóng
          </button>
        </div>
      )}
    </Modal>
  )
}
