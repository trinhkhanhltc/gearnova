import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddressesTab } from '../../components/customer/account/AddressesTab'
import { ChangePasswordTab } from '../../components/customer/account/ChangePasswordTab'
import { NotificationsTab } from '../../components/customer/account/NotificationsTab'
import { PaymentMethodsTab } from '../../components/customer/account/PaymentMethodsTab'
import { FormMessage } from '../../components/ui/FormMessage'
import { ImageDropzone } from '../../components/ui/ImageDropzone'
import { getMyProfile, updateMyProfile } from '../../services/customer.service'
import { clearAuthToken } from '../../utils/authStorage'
import type { CustomerGender, CustomerProfile } from '../../types/customer.types'

type SettingsTab = 'thong-tin-ca-nhan' | 'dia-chi-giao-hang' | 'phuong-thuc-thanh-toan' | 'doi-mat-khau' | 'thong-bao'

const tabs: Array<{ value: SettingsTab; label: string }> = [
  { value: 'thong-tin-ca-nhan', label: 'Thông tin cá nhân' },
  { value: 'dia-chi-giao-hang', label: 'Địa chỉ giao hàng' },
  { value: 'phuong-thuc-thanh-toan', label: 'Phương thức thanh toán' },
  { value: 'doi-mat-khau', label: 'Đổi mật khẩu' },
  { value: 'thong-bao', label: 'Thông báo' },
]

export function AccountSettingsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<SettingsTab>('thong-tin-ca-nhan')
  const [form, setForm] = useState<CustomerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    getMyProfile()
      .then(setForm)
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải thông tin tài khoản.'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form) return
    setError(null)
    setSuccessMessage(null)
    setIsSaving(true)
    try {
      const updated = await updateMyProfile(form)
      setForm(updated)
      setSuccessMessage('Đã lưu thay đổi thông tin cá nhân.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thay đổi thất bại. Vui lòng thử lại.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    clearAuthToken()
    navigate('/login')
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Cài đặt tài khoản</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
        <nav className="flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                activeTab === tab.value ? 'bg-blue-50 text-blue-700' : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Đăng xuất
          </button>
        </nav>

        <div>
          {activeTab === 'dia-chi-giao-hang' && <AddressesTab />}
          {activeTab === 'phuong-thuc-thanh-toan' && <PaymentMethodsTab />}
          {activeTab === 'doi-mat-khau' && <ChangePasswordTab />}
          {activeTab === 'thong-bao' && <NotificationsTab />}

          {activeTab === 'thong-tin-ca-nhan' && (
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Thông tin cá nhân</h2>
              <p className="mt-1 text-sm text-neutral-500">Cập nhật thông tin tài khoản của bạn</p>

              {isLoading && <p className="mt-6 text-sm text-neutral-500">Đang tải dữ liệu...</p>}

              {!isLoading && form && (
                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  {error && <FormMessage variant="error">{error}</FormMessage>}
                  {successMessage && <FormMessage variant="success">{successMessage}</FormMessage>}

                  <div className="flex items-center gap-4">
                    <ImageDropzone label="Ảnh đại diện" variant="circle" className="h-24 w-24 shrink-0" />
                    <div>
                      <p className="cursor-pointer text-sm font-medium text-blue-600 hover:underline">Đổi ảnh đại diện</p>
                      <p className="text-xs text-neutral-500">JPG hoặc PNG, tối đa 5MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="profile-fullname" className="text-sm font-medium text-neutral-900">
                        Họ và tên
                      </label>
                      <input
                        id="profile-fullname"
                        required
                        value={form.fullName}
                        onChange={(event) => setForm((prev) => (prev ? { ...prev, fullName: event.target.value } : prev))}
                        className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="profile-phone" className="text-sm font-medium text-neutral-900">
                        Số điện thoại
                      </label>
                      <input
                        id="profile-phone"
                        required
                        value={form.phone}
                        onChange={(event) => setForm((prev) => (prev ? { ...prev, phone: event.target.value } : prev))}
                        className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="profile-email" className="text-sm font-medium text-neutral-900">
                        Email
                      </label>
                      <input
                        id="profile-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(event) => setForm((prev) => (prev ? { ...prev, email: event.target.value } : prev))}
                        className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label htmlFor="profile-dob" className="text-sm font-medium text-neutral-900">
                        Ngày sinh
                      </label>
                      <input
                        id="profile-dob"
                        value={form.dateOfBirth}
                        onChange={(event) => setForm((prev) => (prev ? { ...prev, dateOfBirth: event.target.value } : prev))}
                        placeholder="DD/MM/YYYY"
                        className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm text-neutral-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-neutral-900">Giới tính</p>
                    <div className="flex items-center gap-6 text-sm text-neutral-700">
                      {(
                        [
                          { value: 'nam', label: 'Nam' },
                          { value: 'nu', label: 'Nữ' },
                          { value: 'khac', label: 'Khác' },
                        ] as Array<{ value: CustomerGender; label: string }>
                      ).map((option) => (
                        <label key={option.value} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="gender"
                            checked={form.gender === option.value}
                            onChange={() => setForm((prev) => (prev ? { ...prev, gender: option.value } : prev))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setError(null)
                        setSuccessMessage(null)
                        getMyProfile().then(setForm)
                      }}
                      className="rounded-xl border border-neutral-300 px-6 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                    >
                      Huỷ
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
