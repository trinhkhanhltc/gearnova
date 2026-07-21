import { mockPromotions } from '../mocks/promotions.mock'
import type { Promotion } from '../types/promotion.types'

const MOCK_DELAY_MS = 400

function delay<T>(value: T, ms = MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

export async function getPromotions(): Promise<Promotion[]> {
  // TODO: thay bằng gọi API thật khi backend sẵn sàng
  // return apiClient.get<Promotion[]>('/promotions')

  return delay(mockPromotions)
}
