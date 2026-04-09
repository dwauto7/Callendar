'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, Save } from 'lucide-react'

type ClinicRole = 'admin' | 'doctor' | 'receptionist' | 'owner' | null

type Profile = {
  id: string
  display_name: string
  role: string | null
  google_calendar_id: string | null
  user_id: string | null
  user_email?: string | null
}

type Appointment = {
  id: string
  patient_name: string | null
  appointment_date: string | null
  appointment_time: string | null
  status: string | null
}

const inputCls =
  'w-full h-9 rounded-md border border-[#212129] bg-[#0D0D11] px-3 text-sm text-white placeholder:text-white/30/50 focus:border-[#2DD4BF] focus:outline-none transition-colors'

function formatDate(date: string | null) {
  if (!date) return '—'
  return new Date(date + 'T00:00:00').toLocaleDateString('en-MY', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
}

function formatTime(time: string | null) {
  if (!time) return ''
  return time.slice(0, 5)
}

export function DoctorProfileEditorClient({
  clinicConfigId,
  profile,
  currentRole,
  currentUserId,
}: {
  clinicConfigId: string
  profile: Profile
  currentRole: ClinicRole
  currentUserId: string
}) {
  const supabase = useMemo(() => createClient(), [])
  const [saving, setSaving] = useState(false)
  const [displayName, setDisplayName] = useState(profile.display_name)
  const [role, setRole] = useState(profile.role ?? 'doctor')
  const [calendarId, setCalendarId] = useState(profile.google_calendar_id ?? '')
  const [linkedUserId, setLinkedUserId] = useState(profile.user_id ?? '')
  const [inviteEmail, setInviteEmail] = useState(profile.user_email ?? '')
  const [inviting, setInviting] = useState(false)
  const [inviteStatus, setInviteStatus] = useState<'active' | 'pending' | 'expired' | 'none'>('none')
  const [staff, setStaff] = useState<{ id: string; user_id: string | null; user_email: string | null; role: string | null }[]>([])
  const [assigned, setAssigned] = useState<Appointment[]>([])
  const [unassigned, setUnassigned] = useState<Appointment[]>([])
  const [loadingAppointments, setLoadingAppointments] = useState(true)
  const [monthOffset, setMonthOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const isAdmin = currentRole === 'admin' || currentRole === 'owner'
  const isDoctorSelf = currentRole === 'doctor' && profile.user_id === currentUserId
  const canEdit = isAdmin || isDoctorSelf

  const loadStaff = useCallback(async () => {
    if (!isAdmin) return
    const { data } = await supabase
      .from('clinic_users')
      .select('id, user_id, user_email, role')
      .eq('clinic_config_id', clinicConfigId)
      .eq('is_active', true)
      .order('created_at', { ascending: true })
    setStaff(data ?? [])
  }, [clinicConfigId, isAdmin, supabase])

  const loadAppointments = useCallback(async () => {
    setLoadingAppointments(true)
    const { data: assignedData } = await supabase
      .from('appointments')
      .select('id, patient_name, appointment_date, appointment_time, status')
      .eq('clinic_id', clinicConfigId)
      .eq('doctor_profile_id', profile.id)
      .order('appointment_date', { ascending: true })

    const { data: unassignedData } = await supabase
      .from('appointments')
      .select('id, patient_name, appointment_date, appointment_time, status')
      .eq('clinic_id', clinicConfigId)
      .is('doctor_profile_id', null)
      .order('appointment_date', { ascending: true })

    setAssigned(assignedData ?? [])
    setUnassigned(unassignedData ?? [])
    setLoadingAppointments(false)
  }, [clinicConfigId, profile.id, supabase])

  useEffect(() => {
    loadStaff()
  }, [loadStaff])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  const currentMonth = useMemo(() => {
    const base = new Date()
    base.setDate(1)
    base.setMonth(base.getMonth() + monthOffset)
    return base
  }, [monthOffset])

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startOffset = (firstDay.getDay() + 6) % 7 // Monday start
    const totalDays = lastDay.getDate()
    const days: { date: string; day: number; inMonth: boolean }[] = []

    for (let i = 0; i < startOffset; i++) {
      const d = new Date(year, month, i - startOffset + 1)
      days.push({ date: d.toISOString().slice(0, 10), day: d.getDate(), inMonth: false })
    }
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(year, month, day)
      days.push({ date: d.toISOString().slice(0, 10), day, inMonth: true })
    }
    while (days.length % 7 !== 0) {
      const d = new Date(year, month + 1, days.length - (startOffset + totalDays) + 1)
      days.push({ date: d.toISOString().slice(0, 10), day: d.getDate(), inMonth: false })
    }
    return days
  }, [currentMonth])

  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>()
    for (const appt of assigned) {
      if (!appt.appointment_date) continue
      const list = map.get(appt.appointment_date) ?? []
      list.push(appt)
      map.set(appt.appointment_date, list)
    }
    return map
  }, [assigned])

  const selectedAppointments = useMemo(() => {
    if (!selectedDate) return []
    return appointmentsByDate.get(selectedDate) ?? []
  }, [appointmentsByDate, selectedDate])

  const loadInviteStatus = useCallback(async () => {
    const email = profile.user_email || inviteEmail
    if (!email && !profile.user_id) {
      setInviteStatus('none')
      return
    }
    const query = supabase
      .from('clinic_users')
      .select('invite_expires_at, last_login_at')
      .eq('clinic_config_id', clinicConfigId)
      .limit(1)

    const { data } = profile.user_id
      ? await query.eq('user_id', profile.user_id).maybeSingle()
      : await query.eq('user_email', email).maybeSingle()

    if (!data) {
      setInviteStatus('none')
      return
    }
    if (data.last_login_at) {
      setInviteStatus('active')
      return
    }
    if (data.invite_expires_at) {
      const expires = new Date(data.invite_expires_at)
      setInviteStatus(expires > new Date() ? 'pending' : 'expired')
      return
    }
    setInviteStatus('none')
  }, [clinicConfigId, inviteEmail, profile.user_email, profile.user_id, supabase])

  useEffect(() => {
    loadInviteStatus()
  }, [loadInviteStatus])

  async function handleSave() {
    if (!canEdit) {
      toast.error('Admin access required to update profile.')
      return
    }
    setSaving(true)
    const { error } = await supabase
      .from('clinic_profiles')
      .update({
        display_name: displayName,
        role,
        google_calendar_id: calendarId || null,
        user_id: isAdmin ? (linkedUserId || null) : profile.user_id,
        user_email: isAdmin ? (staff.find(s => s.user_id === linkedUserId)?.user_email ?? profile.user_email ?? null) : profile.user_email ?? null,
      })
      .eq('id', profile.id)
      .eq('clinic_config_id', clinicConfigId)

    setSaving(false)
    if (error) {
      toast.error('Failed to update profile')
    } else {
      toast.success('Profile updated')
      await loadAppointments()
      await loadInviteStatus()
    }
  }

  async function handleInvite() {
    if (!isAdmin) return
    if (!inviteEmail.trim()) {
      toast.error('Email is required')
      return
    }
    setInviting(true)
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) {
        toast.error('You must be logged in to invite')
        setInviting(false)
        return
      }
      const res = await fetch('/api/clinic/staff/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invitee_email: inviteEmail.trim(),
          role: 'doctor',
          clinic_config_id: clinicConfigId,
          profile_id: profile.id,
        }),
      })

      if (!res.ok) {
        toast.error('Failed to send invite')
      } else {
        toast.success('Invite sent')
        await loadInviteStatus()
      }
    } finally {
      setInviting(false)
    }
  }

  async function assignAppointment(id: string) {
    if (!isAdmin) return
    const { error } = await supabase
      .from('appointments')
      .update({ doctor_profile_id: profile.id })
      .eq('id', id)
      .eq('clinic_id', clinicConfigId)
    if (error) {
      toast.error('Failed to assign appointment')
    } else {
      toast.success('Appointment assigned')
      await loadAppointments()
      await loadInviteStatus()
    }
  }

  async function unassignAppointment(id: string) {
    if (!isAdmin) return
    const { error } = await supabase
      .from('appointments')
      .update({ doctor_profile_id: null })
      .eq('id', id)
      .eq('clinic_id', clinicConfigId)
    if (error) {
      toast.error('Failed to unassign appointment')
    } else {
      toast.success('Appointment unassigned')
      await loadAppointments()
      await loadInviteStatus()
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#212129] bg-[#121216] p-5 space-y-4">
        <div>
          <Label className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-1.5 block">
            Display Name
          </Label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className={inputCls}
            disabled={!canEdit}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-1.5 block">
              Role
            </Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputCls}
              disabled={!isAdmin}
            >
              <option value="doctor">Doctor</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>
          <div>
            <Label className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-1.5 block">
              Google Calendar ID
            </Label>
            <input
              type="text"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              className={inputCls}
              disabled={!canEdit}
            />
          </div>
        </div>

        {isAdmin && (
          <div>
            <Label className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-1.5 block">
              Linked Staff Account
            </Label>
            <select
              value={linkedUserId}
              onChange={(e) => setLinkedUserId(e.target.value)}
              className={inputCls}
            >
              <option value="">Unassigned</option>
              {staff.map((member) => (
                <option key={member.id} value={member.user_id ?? ''}>
                  {member.user_email ?? 'Unknown'} ({member.role ?? 'staff'})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <Label className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-1.5 block">
            Invite Status
          </Label>
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-white/70">
            {inviteStatus === 'active' ? 'Active' : inviteStatus === 'pending' ? 'Pending Invite' : inviteStatus === 'expired' ? 'Invite Expired' : 'Not Invited'}
          </span>
        </div>

        {isAdmin && (
          <div>
            <Label className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-1.5 block">
              Invite User
            </Label>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className={inputCls}
                placeholder="doctor@clinic.com"
              />
              <Button
                type="button"
                onClick={handleInvite}
                disabled={inviting}
                className="bg-[#2DD4BF] text-white font-semibold"
              >
                {inviting ? 'Sending…' : 'Invite User'}
              </Button>
            </div>
            <p className="text-xs text-white/40 mt-1">
              Sends an invite and links this profile to the user on acceptance.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs text-white/40">
            {isAdmin || isDoctorSelf ? 'Edit access granted' : 'Read-only access'}
          </p>
          <Button
            onClick={handleSave}
            disabled={!canEdit || saving}
            className="bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-white font-semibold px-6"
          >
            {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-[#212129] bg-[#121216] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#212129] text-xs font-semibold text-white/70 uppercase tracking-widest">
          Incoming Appointments
        </div>
        {loadingAppointments ? (
          <div className="py-8 text-center text-sm text-white/30">Loading appointments…</div>
        ) : assigned.length === 0 ? (
          <div className="py-8 text-center text-sm text-white/30">No assigned appointments yet.</div>
        ) : (
          <div className="divide-y divide-[#1E2128]">
            {assigned.map((appt) => (
              <div key={appt.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">
                    {appt.patient_name ?? 'Unnamed Patient'}
                  </p>
                  <p className="text-xs text-white/30 mt-1">
                    {formatDate(appt.appointment_date)} {formatTime(appt.appointment_time)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-white bg-[#2DD4BF] px-2.5 py-1 rounded-full">
                    {appt.status ?? 'Booked'}
                  </span>
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => unassignAppointment(appt.id)}
                      className="text-white/40 hover:text-white"
                    >
                      Unassign
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[#212129] bg-[#121216] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#212129] flex items-center justify-between">
          <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">Calendar View</p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setMonthOffset((v) => v - 1)}
              className="text-white/60 hover:text-white"
            >
              Prev
            </Button>
            <span className="text-sm text-white/80">
              {currentMonth.toLocaleDateString('en-MY', { month: 'long', year: 'numeric' })}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setMonthOffset((v) => v + 1)}
              className="text-white/60 hover:text-white"
            >
              Next
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-[10px] text-white/40 uppercase tracking-widest px-5 pt-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 px-5 pb-5">
          {calendarDays.map((day) => {
            const count = appointmentsByDate.get(day.date)?.length ?? 0
            const active = selectedDate === day.date
            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDate(day.date)}
                className={[
                  'h-16 rounded-xl border text-left px-2 pt-2 transition',
                  day.inMonth ? 'border-[#212129] text-white/80' : 'border-transparent text-white/20',
                  active ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/40' : 'hover:bg-black/20',
                ].join(' ')}
              >
                <div className="text-xs font-semibold">{day.day}</div>
                {count > 0 && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#2DD4BF]">
                    {count} appt
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="border-t border-[#212129] px-5 py-4">
          <p className="text-[11px] uppercase tracking-widest text-white/40 mb-2">
            {selectedDate ? `Appointments on ${formatDate(selectedDate)}` : 'Select a day'}
          </p>
          {selectedDate && selectedAppointments.length === 0 ? (
            <p className="text-sm text-white/30">No appointments on this day.</p>
          ) : selectedDate ? (
            <div className="space-y-2">
              {selectedAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between text-sm text-white/80">
                  <span>{appt.patient_name ?? 'Unnamed Patient'}</span>
                  <span className="text-white/40">{formatTime(appt.appointment_time)}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {isAdmin && (
        <div className="rounded-xl border border-[#212129] bg-[#121216] overflow-hidden">
          <div className="px-5 py-3 border-b border-[#212129] text-xs font-semibold text-white/70 uppercase tracking-widest">
            Unassigned Appointments
          </div>
          {loadingAppointments ? (
            <div className="py-8 text-center text-sm text-white/30">Loading appointments…</div>
          ) : unassigned.length === 0 ? (
            <div className="py-8 text-center text-sm text-white/30">No unassigned appointments.</div>
          ) : (
            <div className="divide-y divide-[#1E2128]">
              {unassigned.map((appt) => (
                <div key={appt.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {appt.patient_name ?? 'Unnamed Patient'}
                    </p>
                    <p className="text-xs text-white/30 mt-1">
                      {formatDate(appt.appointment_date)} {formatTime(appt.appointment_time)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => assignAppointment(appt.id)}
                    className="bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-white font-semibold"
                  >
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

