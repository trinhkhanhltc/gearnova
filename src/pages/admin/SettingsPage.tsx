import { useEffect, useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { InviteEmployeeModal } from '../../components/admin/InviteEmployeeModal'
import { getPermissionMatrix, getStaffList, toggleStaffStatus } from '../../services/staff.service'
import { staffRoleLabel, staffStatusMeta } from '../../utils/statusMeta'
import type { PermissionRow, Staff } from '../../types/staff.types'

type SettingsTab = 'ho-so' | 'nguoi-dung' | 'thong-bao' | 'bao-mat'

const tabs: Array<{ value: SettingsTab; label: string }> = [
  { value: 'ho-so', label: 'Hồ sơ cửa hàng' },
  { value: 'nguoi-dung', label: 'Người dùng & phân quyền' },
  { value: 'thong-bao', label: 'Thông báo' },
  { value: 'bao-mat', label: 'Bảo mật' },
]

function PlaceholderTab() {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center text-sm text-neutral-500">
      Chưa có thiết kế cho mục này.
    </div>
  )
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('nguoi-dung')
  const [staff, setStaff] = useState<Staff[]>([])
  const [permissionMatrix, setPermissionMatrix] = useState<PermissionRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  const loadStaff = () => {
    setIsLoading(true)
    Promise.all([getStaffList(), getPermissionMatrix()])
      .then(([staffList, matrix]) => {
        setStaff(staffList)
        setPermissionMatrix(matrix)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu người dùng.'))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    if (activeTab === 'nguoi-dung') loadStaff()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const handleToggleStatus = async (id: string) => {
    await toggleStaffStatus(id)
    loadStaff()
  }

  return (
    <div>
      <div className="mb-6 border-b border-neutral-200 pb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Cài đặt</h1>
      </div>

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
        </nav>

        <div>
          {activeTab !== 'nguoi-dung' && <PlaceholderTab />}

          {activeTab === 'nguoi-dung' && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">Người dùng & phân quyền</h2>
                  <p className="mt-1 text-sm text-neutral-500">Quản lý tài khoản nhân viên và vai trò truy cập</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(true)}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  + Mời nhân viên
                </button>
              </div>

              {isLoading && <p className="text-sm text-neutral-500">Đang tải dữ liệu...</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}

              {!isLoading && !error && (
                <>
                  <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-neutral-200 text-neutral-500">
                        <tr>
                          <th className="px-6 py-3 font-medium">Nhân viên</th>
                          <th className="px-6 py-3 font-medium">Vai trò</th>
                          <th className="px-6 py-3 font-medium">Trạng thái</th>
                          <th className="px-6 py-3 font-medium">Tham gia</th>
                          <th className="px-6 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {staff.map((member) => (
                          <tr key={member.id}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                                  {member.name
                                    .split(' ')
                                    .slice(-2)
                                    .map((part) => part[0])
                                    .join('')
                                    .toUpperCase()}
                                </span>
                                <div>
                                  <p className="font-medium text-neutral-900">{member.name}</p>
                                  <p className="text-xs text-neutral-500">{member.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge tone="blue">{staffRoleLabel[member.role]}</Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge tone={staffStatusMeta[member.status].tone}>
                                {staffStatusMeta[member.status].label}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-neutral-700">{member.joinedAt}</td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <button type="button" title="Chưa có thiết kế cho form sửa nhân viên" className="font-medium text-neutral-700 hover:underline">
                                Sửa
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(member.id)}
                                className="ml-4 font-medium text-red-600 hover:underline"
                              >
                                {member.status === 'hoat-dong' ? 'Khoá' : 'Mở khoá'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8">
                    <h3 className="mb-4 text-base font-semibold text-neutral-900">Ma trận phân quyền theo vai trò</h3>
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b border-neutral-200 text-neutral-500">
                          <tr>
                            <th className="px-6 py-3 font-medium">Quyền hạn</th>
                            <th className="px-6 py-3 font-medium">Quản lý</th>
                            <th className="px-6 py-3 font-medium">NV Bán hàng</th>
                            <th className="px-6 py-3 font-medium">NV Kho</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {permissionMatrix.map((row) => (
                            <tr key={row.permission}>
                              <td className="px-6 py-3 text-neutral-700">{row.permission}</td>
                              <td className="px-6 py-3">
                                {row.quanLy ? <span className="text-green-600">✓</span> : <span className="text-neutral-300">—</span>}
                              </td>
                              <td className="px-6 py-3">
                                {row.nvBanHang ? <span className="text-green-600">✓</span> : <span className="text-neutral-300">—</span>}
                              </td>
                              <td className="px-6 py-3">
                                {row.nvKho ? <span className="text-green-600">✓</span> : <span className="text-neutral-300">—</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <InviteEmployeeModal
        open={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvited={() => loadStaff()}
      />
    </div>
  )
}
