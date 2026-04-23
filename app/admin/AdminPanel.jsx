'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Trash2,
  Users,
  Building2,
  CalendarClock,
  Settings,
  LogOut,
  Lock,
  AlertTriangle,
  Plus,
  Edit2,
  CheckCircle2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const ALLOWED_ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

const normalizeRole = (role) => (role === 'owner' ? 'admin' : role ?? 'receptionist')

function getPermissions(role) {
  const normalized = normalizeRole(role)
  return {
    canView: ['admin', 'doctor', 'receptionist'].includes(normalized),
    canEdit: normalized === 'admin',
    canDelete: normalized === 'admin',
  }
}

export default function AdminPanel() {
  const supabase = useMemo(() => createClient(), [])

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [adminEmail, setAdminEmail] = useState('')
  const [authError, setAuthError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [isSendingLink, setIsSendingLink] = useState(false)

  const [activeTab, setActiveTab] = useState('users')
  const [clinicConfigId, setClinicConfigId] = useState(null)
  const [currentRole, setCurrentRole] = useState(null)
  const [loading, setLoading] = useState(false)

  const [clinics, setClinics] = useState([])
  const [users, setUsers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const permissions = useMemo(() => getPermissions(currentRole), [currentRole])

  const logAdminAction = useCallback(async (action, resourceId, details = {}) => {
    if (!clinicConfigId) return
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.id) return

    await supabase.from('admin_audit_logs').insert({
      admin_id: user.id,
      clinic_config_id: clinicConfigId,
      action,
      resource_id: resourceId,
      details,
    })
  }, [clinicConfigId, supabase])

  const loadData = useCallback(async () => {
    if (!clinicConfigId) return

    setLoading(true)
    try {
      const [clinicsRes, usersRes, appointmentsRes] = await Promise.all([
        supabase
          .from('clinic_configs')
          .select('id, clinic_name, owner_email, plan_type, is_active, created_at')
          .eq('id', clinicConfigId),
        supabase
          .from('clinic_users')
          .select('id, user_email, role, is_active, created_at, clinic_config_id')
          .eq('clinic_config_id', clinicConfigId)
          .order('created_at', { ascending: false }),
        supabase
          .from('appointments')
          .select('id, patient_name, appointment_date, appointment_time, status, service_category, clinic_id')
          .eq('clinic_id', clinicConfigId)
          .order('appointment_date', { ascending: false }),
      ])

      if (clinicsRes.error) throw clinicsRes.error
      if (usersRes.error) throw usersRes.error
      if (appointmentsRes.error) throw appointmentsRes.error

      setClinics(clinicsRes.data ?? [])
      setUsers(usersRes.data ?? [])
      setAppointments(appointmentsRes.data ?? [])
    } catch (error) {
      console.error('Error loading admin panel data:', error)
      setAuthError(error?.message ?? 'Failed to load admin panel data.')
    } finally {
      setLoading(false)
    }
  }, [clinicConfigId, supabase])

  const resolveAdminSession = useCallback(async () => {
    setIsCheckingSession(true)
    setAuthError('')

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setIsAuthenticated(false)
      setCurrentRole(null)
      setClinicConfigId(null)
      setIsCheckingSession(false)
      return
    }

    const { data: membership, error: membershipError } = await supabase
      .from('clinic_users')
      .select('clinic_config_id, role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (membershipError || !membership?.clinic_config_id) {
      setAuthError('No clinic membership found for this account.')
      setIsAuthenticated(false)
      setCurrentRole(null)
      setClinicConfigId(null)
      setIsCheckingSession(false)
      return
    }

    const role = normalizeRole(membership.role)
    const emailAllowed = ALLOWED_ADMIN_EMAILS.length === 0 || ALLOWED_ADMIN_EMAILS.includes((user.email ?? '').toLowerCase())
    if (!emailAllowed || role !== 'admin') {
      setAuthError('This account is not authorized for admin access.')
      setIsAuthenticated(false)
      setCurrentRole(null)
      setClinicConfigId(null)
      setIsCheckingSession(false)
      return
    }

    setCurrentRole(role)
    setClinicConfigId(membership.clinic_config_id)
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
    if (isAuthenticated && clinicConfigId) void loadData()
  }, [isAuthenticated, clinicConfigId, loadData])

  const handleSendMagicLink = async (event) => {
    event.preventDefault()
    setAuthError('')
    setAuthNotice('')

    const normalizedEmail = adminEmail.trim().toLowerCase()
    if (!normalizedEmail) return setAuthError('Please enter an admin email.')
    if (ALLOWED_ADMIN_EMAILS.length > 0 && !ALLOWED_ADMIN_EMAILS.includes(normalizedEmail)) {
      return setAuthError('This email is not in the admin allow-list.')
    }

    setIsSendingLink(true)
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: { emailRedirectTo: `${origin}/admin` },
      })
      if (error) throw error
      setAuthNotice('Magic link sent. Check your inbox and spam folder.')
    } catch (error) {
      setAuthError(error?.message ?? 'Failed to send magic link.')
    } finally {
      setIsSendingLink(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setClinicConfigId(null)
    setCurrentRole(null)
    setAdminEmail('')
    setAuthNotice('')
  }

  const handleDelete = async () => {
    if (!deleteConfirm || !clinicConfigId || !permissions.canDelete) return
    try {
      if (deleteConfirm.type === 'user') {
        const row = users.find((user) => user.id === deleteConfirm.id)
        const { error } = await supabase.from('clinic_users').delete().eq('id', deleteConfirm.id).eq('clinic_config_id', clinicConfigId)
        if (error) throw error
        await logAdminAction('delete_user', deleteConfirm.id, { user_email: row?.user_email, role: row?.role })
        setUsers((prev) => prev.filter((user) => user.id !== deleteConfirm.id))
      } else if (deleteConfirm.type === 'clinic') {
        const row = clinics.find((clinic) => clinic.id === deleteConfirm.id)
        const { error } = await supabase.from('clinic_configs').delete().eq('id', deleteConfirm.id)
        if (error) throw error
        await logAdminAction('delete_clinic', deleteConfirm.id, { clinic_name: row?.clinic_name })
        setClinics((prev) => prev.filter((clinic) => clinic.id !== deleteConfirm.id))
      } else if (deleteConfirm.type === 'appointment') {
        const row = appointments.find((appointment) => appointment.id === deleteConfirm.id)
        const { error } = await supabase.from('appointments').delete().eq('id', deleteConfirm.id).eq('clinic_id', clinicConfigId)
        if (error) throw error
        await logAdminAction('delete_appointment', deleteConfirm.id, { patient_name: row?.patient_name })
        setAppointments((prev) => prev.filter((appointment) => appointment.id !== deleteConfirm.id))
      }
      setDeleteConfirm(null)
    } catch (error) {
      alert(`Delete failed: ${error?.message ?? 'Unknown error'}`)
    }
  }

  if (isCheckingSession) return <div className="min-h-screen bg-[#0A0A0B] text-white grid place-items-center text-sm text-white/60">Checking admin session...</div>

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0B] via-slate-900 to-[#0A0A0B] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121216] border border-[#212129] rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-8"><Lock className="w-8 h-8 text-[#40E0FF] mr-3" /><h1 className="text-3xl font-bold text-white">Admin Panel</h1></div>
          <form onSubmit={handleSendMagicLink} className="space-y-4">
            <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="your-email@clinic.com" required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white placeholder-slate-400 focus:outline-none focus:border-[#40E0FF] focus:ring-1 focus:ring-[#40E0FF]" />
            {authError && <div className="bg-red-900/20 border border-red-600 text-red-300 px-4 py-3 rounded flex items-start gap-3"><AlertTriangle size={18} className="mt-0.5 shrink-0" /><span className="text-sm">{authError}</span></div>}
            {authNotice && <div className="bg-emerald-900/20 border border-emerald-600 text-emerald-300 px-4 py-3 rounded flex items-start gap-3"><CheckCircle2 size={18} className="mt-0.5 shrink-0" /><span className="text-sm">{authNotice}</span></div>}
            <button type="submit" disabled={!adminEmail || isSendingLink} className="w-full bg-[#40E0FF]/20 hover:bg-[#40E0FF]/30 disabled:bg-slate-700 disabled:text-slate-500 text-[#40E0FF] font-semibold py-2 rounded transition">{isSendingLink ? 'Sending...' : 'Send Magic Link'}</button>
          </form>
        </div>
      </div>
    )
  }

  if (!permissions.canView) return <div className="min-h-screen bg-[#0A0A0B] text-white grid place-items-center">Access restricted.</div>

  const tabs = [{ id: 'users', label: 'Users', icon: Users }, { id: 'clinics', label: 'Clinics', icon: Building2 }, { id: 'appointments', label: 'Appointments', icon: CalendarClock }]

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <header className="bg-[#121216] border-b border-[#212129] sticky top-0 z-40"><div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"><div className="flex items-center gap-3"><Settings className="w-6 h-6 text-[#40E0FF]" /><h1 className="text-2xl font-bold">Beacon Horizons Admin</h1></div><button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded transition"><LogOut size={18} />Logout</button></div></header>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8 border-b border-[#212129] pb-4">{tabs.map((tab) => { const Icon = tab.icon; return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 font-medium rounded transition ${activeTab === tab.id ? 'bg-[#40E0FF]/20 text-[#40E0FF] border border-[#40E0FF]/30' : 'text-slate-400 hover:text-slate-200'}`}><Icon size={18} />{tab.label}</button> })}</div>
        {loading ? <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#40E0FF]" /></div> : null}

        {!loading && activeTab === 'users' && <div><div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold">User Management</h2>{permissions.canEdit && <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded transition"><Plus size={18} />Add User</button>}</div><div className="overflow-x-auto bg-[#121216] rounded-lg border border-[#212129]"><table className="w-full"><thead><tr className="border-b border-[#212129]"><th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Email</th><th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Role</th><th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Status</th><th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b border-[#212129] hover:bg-slate-800/40 transition"><td className="px-6 py-4 text-sm">{user.user_email}</td><td className="px-6 py-4 text-sm">{user.role ?? 'receptionist'}</td><td className="px-6 py-4 text-sm"><span className={user.is_active ? 'text-emerald-400' : 'text-red-400'}>{user.is_active ? 'Active' : 'Inactive'}</span></td><td className="px-6 py-4 text-right"><div className="flex gap-2 justify-end">{permissions.canEdit && <button className="p-2 hover:bg-slate-700 rounded transition"><Edit2 size={16} className="text-[#40E0FF]" /></button>}{permissions.canDelete && <button onClick={() => setDeleteConfirm({ type: 'user', id: user.id, name: user.user_email })} className="p-2 hover:bg-slate-700 rounded transition"><Trash2 size={16} className="text-red-400" /></button>}</div></td></tr>)}</tbody></table></div></div>}

        {!loading && activeTab === 'clinics' && <div><div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold">Clinic Management</h2>{permissions.canEdit && <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded transition"><Plus size={18} />Add Clinic</button>}</div><div className="grid gap-4">{clinics.map((clinic) => <div key={clinic.id} className="bg-[#121216] border border-[#212129] rounded-lg p-6 hover:border-[#40E0FF]/30 transition"><div className="flex items-start justify-between"><div><h3 className="text-xl font-semibold mb-2">{clinic.clinic_name}</h3><div className="space-y-1 text-sm text-slate-400"><p>Owner: {clinic.owner_email ?? 'N/A'}</p><p>Plan: {clinic.plan_type ?? 'N/A'}</p><p>Status: <span className={clinic.is_active ? 'text-emerald-400' : 'text-red-400'}>{clinic.is_active ? 'Active' : 'Inactive'}</span></p></div></div><div className="flex gap-2">{permissions.canEdit && <button className="p-3 hover:bg-slate-700 rounded transition"><Edit2 size={18} className="text-[#40E0FF]" /></button>}{permissions.canDelete && <button onClick={() => setDeleteConfirm({ type: 'clinic', id: clinic.id, name: clinic.clinic_name })} className="p-3 hover:bg-slate-700 rounded transition"><Trash2 size={18} className="text-red-400" /></button>}</div></div></div>)}</div></div>}

        {!loading && activeTab === 'appointments' && <div><h2 className="text-2xl font-bold mb-6">Appointment Management</h2><div className="overflow-x-auto bg-[#121216] rounded-lg border border-[#212129]"><table className="w-full"><thead><tr className="border-b border-[#212129]"><th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Patient</th><th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Date</th><th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Status</th><th className="px-6 py-3 text-right text-sm font-semibold text-slate-300">Actions</th></tr></thead><tbody>{appointments.map((appointment) => <tr key={appointment.id} className="border-b border-[#212129] hover:bg-slate-700/30 transition"><td className="px-6 py-4 text-sm">{appointment.patient_name ?? 'Unknown'}</td><td className="px-6 py-4 text-sm">{appointment.appointment_date ? new Date(`${appointment.appointment_date}T${appointment.appointment_time ?? '00:00:00'}`).toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }) : 'N/A'}</td><td className="px-6 py-4 text-sm">{appointment.status ?? 'pending'}</td><td className="px-6 py-4 text-right"><div className="flex gap-2 justify-end">{permissions.canEdit && <button className="p-2 hover:bg-slate-600 rounded transition"><Edit2 size={16} className="text-[#40E0FF]" /></button>}{permissions.canDelete && <button onClick={() => setDeleteConfirm({ type: 'appointment', id: appointment.id, name: appointment.patient_name })} className="p-2 hover:bg-slate-600 rounded transition"><Trash2 size={16} className="text-red-400" /></button>}</div></td></tr>)}</tbody></table></div></div>}
      </div>

      {deleteConfirm && permissions.canDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#121216] border border-red-500/30 rounded-lg p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4"><AlertTriangle className="w-6 h-6 text-red-500" /><h3 className="text-xl font-bold text-red-400">Delete Confirmation</h3></div>
            <p className="text-slate-300 mb-6">Are you sure you want to delete <span className="font-semibold text-white">{deleteConfirm.name}</span>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition">Cancel</button>
              <button onClick={() => void handleDelete()} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition font-semibold">Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
