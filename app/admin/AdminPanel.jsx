'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Building2,
  CalendarClock,
  CheckCircle2,
  Download,
  Lock,
  LogOut,
  Search,
  Settings,
  Trash2,
  UserCog,
  Users,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const COLORS = {
  primary: '#0066cc',
  success: '#00cc00',
  danger: '#cc0000',
  warning: '#ff9900',
  gray: '#666666',
}

const PUBLIC_ALLOWED_ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

function safeMessage(error, fallback) {
  if (error && typeof error === 'object' && 'message' in error) return error.message
  return fallback
}

function toEnMYDateTime(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })
}

function toEnMYDate(value) {
  if (!value) return 'N/A'
  return new Date(value).toLocaleDateString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })
}

function displayRole(role) {
  if (role === 'receptionist') return 'Staff'
  if (!role) return 'Staff'
  return role.charAt(0).toUpperCase() + role.slice(1)
}

function roleBadgeClass(role) {
  if (role === 'owner') return 'bg-blue-500/15 text-blue-300 border-blue-500/30'
  if (role === 'doctor') return 'bg-green-500/15 text-green-300 border-green-500/30'
  if (role === 'admin') return 'bg-red-500/15 text-red-300 border-red-500/30'
  return 'bg-orange-500/15 text-orange-300 border-orange-500/30'
}

function statusBadgeClass(isActive) {
  return isActive
    ? 'bg-green-500/15 text-green-300 border-green-500/30'
    : 'bg-gray-500/15 text-gray-300 border-gray-500/30'
}

function userDisplayName(email) {
  if (!email) return 'Unknown'
  const [name] = email.split('@')
  return name
    .replace(/[._-]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export default function AdminPanel() {
  const supabase = useMemo(() => createClient(), [])

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [adminEmail, setAdminEmail] = useState('')
  const [authError, setAuthError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [isSendingLink, setIsSendingLink] = useState(false)

  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const [clinics, setClinics] = useState([])
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [auditLogs, setAuditLogs] = useState([])

  const [clinicViewMode, setClinicViewMode] = useState('table')
  const [expandedClinicId, setExpandedClinicId] = useState(null)
  const [clinicSearch, setClinicSearch] = useState('')
  const [clinicStatusFilter, setClinicStatusFilter] = useState('all')

  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [userClinicFilter, setUserClinicFilter] = useState('all')
  const [userStatusFilter, setUserStatusFilter] = useState('all')
  const [updatingUserId, setUpdatingUserId] = useState(null)

  const [auditSearch, setAuditSearch] = useState('')
  const [auditActionFilter, setAuditActionFilter] = useState('all')
  const [auditAdminFilter, setAuditAdminFilter] = useState('all')
  const [auditStartDate, setAuditStartDate] = useState('')
  const [auditEndDate, setAuditEndDate] = useState('')

  const [authDebug, setAuthDebug] = useState({
    envAllowListConfigured: PUBLIC_ALLOWED_ADMIN_EMAILS.length > 0,
    emailInPublicAllowList: null,
    hasSupabaseUser: null,
    serverAdminAuthorized: null,
    serverAdminEmailsConfigured: null,
  })

  const logSecurityEvent = useCallback(async (message, payload = {}) => {
    try {
      await fetch('/api/error-log', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ source: 'AdminPanel', message, payload }),
        keepalive: true,
      })
    } catch {
      // best effort
    }
  }, [])

  const getAccessToken = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session?.access_token) return null
    return data.session.access_token
  }, [supabase])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const token = await getAccessToken()
      if (!token) {
        setAuthDebug((prev) => ({ ...prev, serverAdminAuthorized: false }))
        setAuthError('Missing access token. Please sign in again.')
        return
      }

      const response = await fetch('/api/admin/system-data', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const payload = await response.json()
      if (!response.ok) {
        setAuthDebug((prev) => ({ ...prev, serverAdminAuthorized: false }))
        setAuthError(payload.error ?? 'Failed to fetch admin data.')
        return
      }

      setAuthDebug((prev) => ({
        ...prev,
        serverAdminAuthorized: true,
        serverAdminEmailsConfigured: payload.meta?.admin_emails_configured ?? null,
      }))
      setClinics(payload.clinics ?? [])
      setUsers(payload.users ?? [])
      setAppointments(payload.appointments ?? [])
      setAuditLogs(payload.auditLogs ?? [])
    } catch (error) {
      setAuthError(safeMessage(error, 'Failed to fetch admin data.'))
    } finally {
      setLoading(false)
    }
  }, [getAccessToken])

  const resolveAdminSession = useCallback(async () => {
    setIsCheckingSession(true)
    setAuthError('')

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setAuthDebug((prev) => ({ ...prev, hasSupabaseUser: false }))
      setIsAuthenticated(false)
      setIsCheckingSession(false)
      return
    }

    const normalizedEmail = (user.email ?? '').toLowerCase()
    const publicAllowed =
      PUBLIC_ALLOWED_ADMIN_EMAILS.length === 0 || PUBLIC_ALLOWED_ADMIN_EMAILS.includes(normalizedEmail)

    setAuthDebug((prev) => ({
      ...prev,
      hasSupabaseUser: true,
      emailInPublicAllowList: publicAllowed,
    }))

    setIsAuthenticated(true)
    setIsCheckingSession(false)
  }, [supabase])

  useEffect(() => {
    void resolveAdminSession()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      void resolveAdminSession()
    })
    return () => subscription.unsubscribe()
  }, [resolveAdminSession, supabase])

  useEffect(() => {
    if (isAuthenticated) void loadData()
  }, [isAuthenticated, loadData])

  const handleSendMagicLink = async (event) => {
    event.preventDefault()
    setAuthError('')
    setAuthNotice('')

    const normalizedEmail = adminEmail.trim().toLowerCase()
    if (!normalizedEmail) return setAuthError('Please enter an admin email.')

    if (
      PUBLIC_ALLOWED_ADMIN_EMAILS.length > 0 &&
      !PUBLIC_ALLOWED_ADMIN_EMAILS.includes(normalizedEmail)
    ) {
      setAuthDebug((prev) => ({ ...prev, emailInPublicAllowList: false }))
      await logSecurityEvent('admin_magic_link_denied_email_not_allowlisted', { email: normalizedEmail })
      return setAuthError('This email is not in the public admin allow-list.')
    }

    setAuthDebug((prev) => ({ ...prev, emailInPublicAllowList: true }))
    setIsSendingLink(true)

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: { emailRedirectTo: `${origin}/admin` },
      })
      if (error) throw error

      await logSecurityEvent('admin_magic_link_sent', { email: normalizedEmail })
      setAuthNotice('Magic link sent. Check your inbox and spam folder.')
    } catch (error) {
      await logSecurityEvent('admin_magic_link_failed', {
        email: normalizedEmail,
        error: safeMessage(error, 'unknown'),
      })
      setAuthError(safeMessage(error, 'Failed to send magic link.'))
    } finally {
      setIsSendingLink(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setAdminEmail('')
    setAuthNotice('')
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    try {
      const token = await getAccessToken()
      if (!token) {
        setAuthError('Missing access token. Please sign in again.')
        return
      }

      const response = await fetch('/api/admin/system-data', {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          target: deleteConfirm.type,
          id: deleteConfirm.id,
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? 'Delete failed')

      if (deleteConfirm.type === 'clinic') {
        setClinics((prev) => prev.filter((clinic) => clinic.id !== deleteConfirm.id))
      } else if (deleteConfirm.type === 'user') {
        setUsers((prev) => prev.filter((user) => user.id !== deleteConfirm.id))
      } else {
        setAppointments((prev) => prev.filter((appointment) => appointment.id !== deleteConfirm.id))
      }

      await loadData()
      setDeleteConfirm(null)
    } catch (error) {
      alert(`Delete failed: ${safeMessage(error, 'Unknown error')}`)
    }
  }

  const updateUser = async (id, updates) => {
    setUpdatingUserId(id)
    try {
      const token = await getAccessToken()
      if (!token) {
        setAuthError('Missing access token. Please sign in again.')
        return
      }

      const response = await fetch('/api/admin/system-data', {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          target: 'user',
          id,
          updates,
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error ?? 'Update failed')

      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, ...updates } : user))
      )
      await loadData()
    } catch (error) {
      alert(`Update failed: ${safeMessage(error, 'Unknown error')}`)
    } finally {
      setUpdatingUserId(null)
    }
  }

  const usersByClinic = useMemo(() => {
    const map = new Map()
    for (const user of users) {
      const clinicId = user.clinic_config_id ?? 'unknown'
      map.set(clinicId, (map.get(clinicId) ?? 0) + 1)
    }
    return map
  }, [users])

  const appointmentsByClinic = useMemo(() => {
    const map = new Map()
    for (const appointment of appointments) {
      const clinicId = appointment.clinic_id ?? 'unknown'
      map.set(clinicId, (map.get(clinicId) ?? 0) + 1)
    }
    return map
  }, [appointments])

  const clinicOptions = useMemo(() => {
    return clinics.map((clinic) => ({
      id: clinic.id,
      name: clinic.clinic_name ?? 'Unknown Clinic',
    }))
  }, [clinics])

  const filteredClinics = useMemo(() => {
    return clinics.filter((clinic) => {
      const statusMatch =
        clinicStatusFilter === 'all' ||
        (clinicStatusFilter === 'active' && clinic.is_active) ||
        (clinicStatusFilter === 'inactive' && !clinic.is_active)
      const searchMatch = (clinic.clinic_name ?? '').toLowerCase().includes(clinicSearch.toLowerCase())
      return statusMatch && searchMatch
    })
  }, [clinics, clinicSearch, clinicStatusFilter])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchBase = `${user.user_email ?? ''} ${userDisplayName(user.user_email)} ${user.clinic_config?.clinic_name ?? ''}`.toLowerCase()
      const searchMatch = searchBase.includes(userSearch.toLowerCase())
      const roleMatch = userRoleFilter === 'all' || user.role === userRoleFilter
      const clinicMatch = userClinicFilter === 'all' || user.clinic_config_id === userClinicFilter
      const statusMatch =
        userStatusFilter === 'all' ||
        (userStatusFilter === 'active' && user.is_active) ||
        (userStatusFilter === 'inactive' && !user.is_active)
      return searchMatch && roleMatch && clinicMatch && statusMatch
    })
  }, [users, userSearch, userRoleFilter, userClinicFilter, userStatusFilter])

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const created = log.created_at ? new Date(log.created_at) : null
      const startOk = !auditStartDate || (created && created >= new Date(`${auditStartDate}T00:00:00`))
      const endOk = !auditEndDate || (created && created <= new Date(`${auditEndDate}T23:59:59`))

      const actionMatch = auditActionFilter === 'all' || log.action === auditActionFilter
      const adminEmail = String(log.details?.admin_email ?? log.admin_id ?? '').toLowerCase()
      const adminMatch = auditAdminFilter === 'all' || adminEmail === auditAdminFilter.toLowerCase()

      const searchable = `${log.action ?? ''} ${log.resource_id ?? ''} ${JSON.stringify(log.details ?? {})}`.toLowerCase()
      const searchMatch = searchable.includes(auditSearch.toLowerCase())

      return startOk && endOk && actionMatch && adminMatch && searchMatch
    })
  }, [auditLogs, auditActionFilter, auditAdminFilter, auditEndDate, auditSearch, auditStartDate])

  const recentActivity = useMemo(() => filteredAuditLogs.slice(0, 10), [filteredAuditLogs])

  const auditActions = useMemo(
    () => Array.from(new Set(auditLogs.map((log) => log.action).filter(Boolean))),
    [auditLogs]
  )

  const auditAdmins = useMemo(
    () =>
      Array.from(
        new Set(
          auditLogs
            .map((log) => String(log.details?.admin_email ?? log.admin_id ?? '').trim())
            .filter(Boolean)
        )
      ),
    [auditLogs]
  )

  const exportAuditCsv = () => {
    const headers = ['Timestamp', 'Admin', 'Action', 'Resource', 'Status', 'Details']
    const rows = filteredAuditLogs.map((log) => [
      toEnMYDateTime(log.created_at),
      String(log.details?.admin_email ?? log.admin_id ?? ''),
      String(log.action ?? ''),
      String(log.resource_id ?? ''),
      'Success',
      JSON.stringify(log.details ?? {}),
    ])

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `admin_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const stats = [
    {
      title: 'Total Clinics',
      value: clinics.length,
      icon: Building2,
      color: COLORS.primary,
    },
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: COLORS.warning,
    },
    {
      title: 'Total Appointments',
      value: appointments.length,
      icon: CalendarClock,
      color: COLORS.success,
    },
    {
      title: 'System Status',
      value: authDebug.serverAdminAuthorized ? 'ONLINE' : 'CHECK',
      icon: Activity,
      color: authDebug.serverAdminAuthorized ? COLORS.success : COLORS.gray,
    },
  ]

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white grid place-items-center text-sm text-white/60">
        Checking admin session...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0B] via-slate-900 to-[#0A0A0B] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121216] border border-[#212129] rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <Lock className="w-8 h-8 mr-3" style={{ color: COLORS.primary }} />
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          </div>
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <input
              type="email"
              value={adminEmail}
              onChange={(event) => setAdminEmail(event.target.value)}
              placeholder="owner@yourwebsite.com"
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400 focus:outline-none"
            />
            {authError && (
              <div className="px-4 py-3 rounded flex items-start gap-3 bg-red-900/20 border border-red-600 text-red-300">
                <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                <span className="text-sm">{authError}</span>
              </div>
            )}
            {authNotice && (
              <div className="px-4 py-3 rounded flex items-start gap-3 bg-green-900/20 border border-green-600 text-green-300">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <span className="text-sm">{authNotice}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={!adminEmail || isSendingLink}
              className="w-full text-white font-semibold py-2 rounded transition disabled:bg-slate-700"
              style={{ backgroundColor: COLORS.primary }}
            >
              {isSendingLink ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (authDebug.serverAdminAuthorized === false) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white grid place-items-center px-4">
        <div className="max-w-xl w-full rounded-2xl border border-red-500/30 bg-[#121216] p-6">
          <h2 className="text-xl font-semibold text-red-300">Access denied by server</h2>
          <p className="text-sm text-white/60 mt-2">
            This account is not recognized as a website-level admin.
          </p>
          <p className="text-xs text-white/40 mt-3">
            Server configured admin emails: {authDebug.serverAdminEmailsConfigured ?? 0}
          </p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'clinics', label: 'Clinics', icon: Building2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'audit', label: 'Audit Logs', icon: UserCog },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <header className="bg-[#121216] border-b border-[#212129] sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6" style={{ color: COLORS.primary }} />
            <h1 className="text-2xl font-bold">System Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                  isActive
                    ? 'text-white border-blue-500/50 bg-blue-500/20'
                    : 'text-slate-300 border-slate-700 bg-slate-900/40 hover:bg-slate-800'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: COLORS.primary }} />
          </div>
        )}

        {!loading && activeTab === 'dashboard' && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.title}
                    className="rounded-2xl border border-slate-800 bg-[#121216] p-5 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-widest text-white/50">{stat.title}</p>
                      <div className="rounded-xl p-2" style={{ backgroundColor: `${stat.color}22` }}>
                        <Icon size={18} style={{ color: stat.color }} />
                      </div>
                    </div>
                    <p className="mt-4 text-4xl font-bold tracking-tight" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#121216] p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity (Last 10)</h3>
              <div className="space-y-3">
                {recentActivity.length === 0 && (
                  <p className="text-sm text-white/50">No admin actions logged yet.</p>
                )}
                {recentActivity.map((log) => {
                  const action = String(log.action ?? '')
                  const color =
                    action.includes('delete')
                      ? COLORS.danger
                      : action.includes('update')
                        ? COLORS.warning
                        : COLORS.primary

                  return (
                    <div key={log.id} className="rounded-xl border border-slate-700 bg-black/20 p-3 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold" style={{ color }}>
                          {action.replaceAll('_', ' ')}
                        </p>
                        <p className="text-xs text-white/50">
                          {String(log.details?.admin_email ?? log.admin_id ?? 'Unknown admin')}
                        </p>
                        <p className="text-xs text-white/40">{JSON.stringify(log.details ?? {})}</p>
                      </div>
                      <span className="text-xs text-white/40 shrink-0">{toEnMYDateTime(log.created_at)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {!loading && activeTab === 'clinics' && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  value={clinicSearch}
                  onChange={(event) => setClinicSearch(event.target.value)}
                  placeholder="Search clinic name..."
                  className="w-full bg-[#121216] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                {['all', 'active', 'inactive'].map((value) => (
                  <button
                    key={value}
                    onClick={() => setClinicStatusFilter(value)}
                    className={`px-3 py-2 rounded-lg text-xs uppercase tracking-widest border ${
                      clinicStatusFilter === value
                        ? 'border-blue-500/50 bg-blue-500/20 text-white'
                        : 'border-slate-700 text-white/60'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {['table', 'card'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setClinicViewMode(mode)}
                    className={`px-3 py-2 rounded-lg text-xs uppercase tracking-widest border ${
                      clinicViewMode === mode
                        ? 'border-blue-500/50 bg-blue-500/20 text-white'
                        : 'border-slate-700 text-white/60'
                    }`}
                  >
                    {mode} view
                  </button>
                ))}
              </div>
            </div>

            {clinicViewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredClinics.map((clinic) => (
                  <div key={clinic.id} className="rounded-2xl border border-slate-800 bg-[#121216] p-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold">{clinic.clinic_name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs border ${statusBadgeClass(clinic.is_active)}`}>
                        {clinic.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-white/60 mt-2">Owner: {clinic.owner_email ?? 'N/A'}</p>
                    <p className="text-sm text-white/60">Plan: {clinic.plan_type ?? 'N/A'}</p>
                    <p className="text-sm text-white/60">Users: {usersByClinic.get(clinic.id) ?? 0}</p>
                    <p className="text-sm text-white/60">Appointments: {appointmentsByClinic.get(clinic.id) ?? 0}</p>
                    <p className="text-xs text-white/40 mt-2">Created: {toEnMYDate(clinic.created_at)}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setUserClinicFilter(clinic.id)
                          setActiveTab('users')
                        }}
                        className="px-3 py-2 rounded-lg text-xs bg-blue-500/20 border border-blue-500/30"
                      >
                        View Users
                      </button>
                      <button
                        onClick={() => {
                          setAuditSearch(clinic.clinic_name ?? '')
                          setActiveTab('audit')
                        }}
                        className="px-3 py-2 rounded-lg text-xs bg-orange-500/20 border border-orange-500/30"
                      >
                        View Appointments
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'clinic', id: clinic.id, name: clinic.clinic_name })}
                        className="px-3 py-2 rounded-lg text-xs bg-red-500/20 border border-red-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#121216]">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-widest text-white/50 border-b border-slate-700">
                      <th className="px-4 py-3">Clinic Name</th>
                      <th className="px-4 py-3">Owner</th>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Users</th>
                      <th className="px-4 py-3">Appointments</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClinics.map((clinic, index) => {
                      const expanded = expandedClinicId === clinic.id
                      return (
                        <>
                          <tr
                            key={clinic.id}
                            className={`border-b border-slate-800 hover:bg-white/5 ${index % 2 === 0 ? 'bg-black/10' : ''}`}
                          >
                            <td className="px-4 py-3">{clinic.clinic_name}</td>
                            <td className="px-4 py-3 text-white/70">{clinic.owner_email ?? 'N/A'}</td>
                            <td className="px-4 py-3 text-white/70">{clinic.plan_type ?? 'N/A'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs border ${statusBadgeClass(clinic.is_active)}`}>
                                {clinic.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3">{usersByClinic.get(clinic.id) ?? 0}</td>
                            <td className="px-4 py-3">{appointmentsByClinic.get(clinic.id) ?? 0}</td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setExpandedClinicId(expanded ? null : clinic.id)}
                                  className="px-3 py-1.5 rounded-lg text-xs border border-slate-600 hover:bg-slate-800"
                                >
                                  {expanded ? 'Hide' : 'Details'}
                                </button>
                                <button
                                  onClick={() => {
                                    setUserClinicFilter(clinic.id)
                                    setActiveTab('users')
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-xs border border-blue-500/40 bg-blue-500/20"
                                >
                                  View Users
                                </button>
                                <button
                                  onClick={() => {
                                    setAuditSearch(clinic.clinic_name ?? '')
                                    setActiveTab('audit')
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-xs border border-orange-500/40 bg-orange-500/20"
                                >
                                  View Appointments
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm({ type: 'clinic', id: clinic.id, name: clinic.clinic_name })}
                                  className="px-3 py-1.5 rounded-lg text-xs border border-red-500/40 bg-red-500/20"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                          {expanded && (
                            <tr className="border-b border-slate-800 bg-black/20">
                              <td colSpan={7} className="px-4 py-3 text-sm text-white/60">
                                Phone: {clinic.clinic_phone ?? 'N/A'} | Address: {clinic.clinic_address ?? 'N/A'} | Created:{' '}
                                {toEnMYDateTime(clinic.created_at)}
                              </td>
                            </tr>
                          )}
                        </>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {!loading && activeTab === 'users' && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative md:col-span-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                  placeholder="Search email, name, clinic..."
                  className="w-full bg-[#121216] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm"
                />
              </div>
              <select
                value={userRoleFilter}
                onChange={(event) => setUserRoleFilter(event.target.value)}
                className="bg-[#121216] border border-slate-700 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Roles</option>
                <option value="owner">Owner</option>
                <option value="receptionist">Staff</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={userStatusFilter}
                onChange={(event) => setUserStatusFilter(event.target.value)}
                className="bg-[#121216] border border-slate-700 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <select
              value={userClinicFilter}
              onChange={(event) => setUserClinicFilter(event.target.value)}
              className="bg-[#121216] border border-slate-700 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Clinics</option>
              {clinicOptions.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </option>
              ))}
            </select>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#121216]">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-widest text-white/50 border-b border-slate-700">
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Clinic</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Last Login</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-slate-800 hover:bg-white/5 ${index % 2 === 0 ? 'bg-black/10' : ''}`}
                    >
                      <td className="px-4 py-3">{user.user_email}</td>
                      <td className="px-4 py-3 text-white/70">{userDisplayName(user.user_email)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs border ${roleBadgeClass(user.role)}`}>
                          {displayRole(user.role)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/70">{user.clinic_config?.clinic_name ?? 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs border ${statusBadgeClass(user.is_active)}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/50">{toEnMYDateTime(user.last_login_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <select
                            value={user.role ?? 'receptionist'}
                            onChange={(event) => void updateUser(user.id, { role: event.target.value })}
                            disabled={updatingUserId === user.id}
                            className="bg-[#0E0F12] border border-slate-700 rounded-md px-2 py-1 text-xs"
                          >
                            <option value="owner">Owner</option>
                            <option value="receptionist">Staff</option>
                            <option value="doctor">Doctor</option>
                          </select>
                          <button
                            onClick={() => void updateUser(user.id, { is_active: !user.is_active })}
                            disabled={updatingUserId === user.id}
                            className={`px-3 py-1.5 rounded-lg text-xs border ${
                              user.is_active
                                ? 'border-gray-500/50 bg-gray-500/15'
                                : 'border-green-500/50 bg-green-500/15'
                            }`}
                          >
                            {user.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'user', id: user.id, name: user.user_email })}
                            className="px-3 py-1.5 rounded-lg text-xs border border-red-500/40 bg-red-500/20"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {!loading && activeTab === 'audit' && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="relative md:col-span-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  value={auditSearch}
                  onChange={(event) => setAuditSearch(event.target.value)}
                  placeholder="Search clinic, email, resource..."
                  className="w-full bg-[#121216] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm"
                />
              </div>
              <select
                value={auditActionFilter}
                onChange={(event) => setAuditActionFilter(event.target.value)}
                className="bg-[#121216] border border-slate-700 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Actions</option>
                {auditActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
              <select
                value={auditAdminFilter}
                onChange={(event) => setAuditAdminFilter(event.target.value)}
                className="bg-[#121216] border border-slate-700 rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">All Admins</option>
                {auditAdmins.map((admin) => (
                  <option key={admin} value={admin}>
                    {admin}
                  </option>
                ))}
              </select>
              <button
                onClick={exportAuditCsv}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-blue-500/40 bg-blue-500/20 text-sm"
              >
                <Download size={14} />
                Export CSV
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="date"
                value={auditStartDate}
                onChange={(event) => setAuditStartDate(event.target.value)}
                className="bg-[#121216] border border-slate-700 rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={auditEndDate}
                onChange={(event) => setAuditEndDate(event.target.value)}
                className="bg-[#121216] border border-slate-700 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#121216]">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-widest text-white/50 border-b border-slate-700">
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Admin</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Resource</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAuditLogs.map((log, index) => {
                    const action = String(log.action ?? '')
                    const actionColor =
                      action.includes('delete')
                        ? 'text-red-300 border-red-500/40 bg-red-500/15'
                        : action.includes('update')
                          ? 'text-orange-300 border-orange-500/40 bg-orange-500/15'
                          : action.includes('create') || action.includes('add')
                            ? 'text-blue-300 border-blue-500/40 bg-blue-500/15'
                            : 'text-green-300 border-green-500/40 bg-green-500/15'
                    return (
                      <tr
                        key={log.id}
                        className={`border-b border-slate-800 hover:bg-white/5 ${index % 2 === 0 ? 'bg-black/10' : ''}`}
                      >
                        <td className="px-4 py-3 text-sm text-white/70">{toEnMYDateTime(log.created_at)}</td>
                        <td className="px-4 py-3 text-sm">{String(log.details?.admin_email ?? log.admin_id ?? 'Unknown')}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs border ${actionColor}`}>
                            {action.replaceAll('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-white/70">{String(log.resource_id ?? 'N/A')}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs border text-green-300 border-green-500/40 bg-green-500/15">
                            Success
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121216] border border-red-500/30 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5" style={{ color: COLORS.danger }} />
              <h3 className="text-lg font-semibold text-red-300">Delete Confirmation</h3>
            </div>
            <p className="text-sm text-white/70 mb-5">
              Are you sure you want to delete <span className="text-white font-semibold">{deleteConfirm.name}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleDelete()}
                className="flex-1 px-4 py-2 rounded-lg text-white transition"
                style={{ backgroundColor: COLORS.danger }}
              >
                <span className="inline-flex items-center gap-2 justify-center">
                  <Trash2 size={14} />
                  Delete
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
