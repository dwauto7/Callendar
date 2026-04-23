export type ClinicRole = 'admin' | 'doctor' | 'receptionist' | 'owner' | null
export type NormalizedClinicRole = 'admin' | 'doctor' | 'receptionist'

export type RolePermissions = {
  canView: boolean
  canEdit: boolean
  canDelete: boolean
}

export function normalizeClinicRole(role: ClinicRole): NormalizedClinicRole {
  if (role === 'owner' || role === 'admin') return 'admin'
  if (role === 'doctor') return 'doctor'
  return 'receptionist'
}

export function getRolePermissions(role: ClinicRole): RolePermissions {
  const normalized = normalizeClinicRole(role)
  if (normalized === 'admin') return { canView: true, canEdit: true, canDelete: true }
  if (normalized === 'doctor') return { canView: true, canEdit: true, canDelete: false }
  return { canView: true, canEdit: false, canDelete: false }
}

export type DashboardPageKey =
  | 'overview'
  | 'operations'
  | 'appointments'
  | 'calls'
  | 'credits'
  | 'reports'
  | 'settings'
  | 'staff'
  | 'doctors'
  | 'doctor-new'
  | 'debug'

const VIEW_RULES: Record<DashboardPageKey, NormalizedClinicRole[]> = {
  overview: ['admin', 'doctor', 'receptionist'],
  operations: ['admin', 'doctor', 'receptionist'],
  appointments: ['admin', 'doctor', 'receptionist'],
  calls: ['admin', 'doctor', 'receptionist'],
  credits: ['admin', 'receptionist'],
  reports: ['admin', 'receptionist'],
  settings: ['admin', 'receptionist'],
  staff: ['admin'],
  doctors: ['admin', 'doctor', 'receptionist'],
  'doctor-new': ['admin'],
  debug: ['admin'],
}

export function canViewDashboardPage(role: ClinicRole, page: DashboardPageKey): boolean {
  const normalized = normalizeClinicRole(role)
  return VIEW_RULES[page].includes(normalized)
}
