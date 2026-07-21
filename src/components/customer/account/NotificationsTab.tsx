import { useEffect, useState } from 'react'
import { ToggleSwitch } from '../../ui/ToggleSwitch'
import { getMyNotificationPreferences, updateNotificationPreference } from '../../../services/customer.service'
import type { NotificationPreference } from '../../../types/customer.types'

export function NotificationsTab() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getMyNotificationPreferences()
      .then(setPreferences)
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải cài đặt thông báo.'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleToggle = async (id: string, enabled: boolean) => {
    setPreferences((prev) => prev.map((item) => (item.id === id ? { ...item, enabled } : item)))
    await updateNotificationPreference(id, enabled)
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-900">Thông báo</h2>
      <p className="mt-1 text-sm text-neutral-500">Chọn loại thông báo bạn muốn nhận</p>

      {isLoading && <p className="mt-6 text-sm text-neutral-500">Đang tải dữ liệu...</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {!isLoading && !error && (
        <div className="mt-6 divide-y divide-neutral-100 rounded-2xl border border-neutral-200 bg-white">
          {preferences.map((preference) => (
            <div key={preference.id} className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="font-medium text-neutral-900">{preference.label}</p>
                <p className="mt-1 text-sm text-neutral-500">{preference.description}</p>
              </div>
              <ToggleSwitch
                checked={preference.enabled}
                onChange={(checked) => handleToggle(preference.id, checked)}
                label={preference.label}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
