'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Clock, CheckCircle, XCircle, Loader2, Send, Trash2, UserX, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface StaffMember {
  id: string
  user_email: string
  role: string
  is_active: boolean
  invite_expires_at: string | null
  invite_token: string | null
  created_at: string
  user_id: string | null
}

interface StaffSectionProps {
  clinicConfigId: string
  isOwner: boolean
  currentUserId: string
}

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  doctor: 'Doctor',
  receptionist: 'Staff',
}

const ROLE_COLORS: Record<string, string> = {
  owner: 'text-teal-400 bg-teal-400/10',
  admin: 'text-blue-400 bg-blue-400/10',
  doctor: 'text-purple-400 bg-purple-400/10',
  receptionist: 'text-slate-400 bg-slate-400/10',
}

export function StaffSection({
  clinicConfigId,
  isOwner,
  currentUserId,
}: StaffSectionProps) {
  const supabase = createClient()

  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'doctor' | 'receptionist'>('receptionist')
  const [inviting, setInviting] = useState(false)
  const [revokeConfirm, setRevokeConfirm] = useState<string | null>(null)
  const [deactivateConfirm, setDeactivateConfirm] = useState<string | null>(null)
  const [actingId, setActingId] = useState<string | null>(null)

  const fetchStaff = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('clinic_users')
      .select('id, user_email, role, is_active, invite_expires_at, created_at, user_id, invite_token')
      .eq('clinic_config_id', clinicConfigId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setStaff(data.filter((m): m is StaffMember => m.user_email !== null))
    }
    setLoading(false)
  }, [clinicConfigId, supabase])

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchStaff()
    }, 0)
    return () => clearTimeout(timer)
  }, [fetchStaff])

  const getInviteStatus = (member: StaffMember) => {
    if (member.user_id && member.is_active) return 'active'
    if (member.user_id && !member.is_active) return 'inactive'
    if (member.invite_token) return 'pending'
    if (!member.invite_expires_at) return 'pending'
    const expired = new Date(member.invite_expires_at) < new Date()
    return expired ? 'expired' : 'pending'
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3" /> Active
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Inactive
          </span>
        )
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Invite Sent
          </span>
        )
      case 'expired':
        return (
          <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" /> Expired
          </span>
        )
      default:
        return null
    }
  }

  async function handleInvite() {
    const email = inviteEmail.trim().toLowerCase()
    if (!email) {
      toast.error('Email is required')
      return
    }

    setInviting(true)
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) {
        toast.error('You must be logged in to invite staff')
        return
      }

      const response = await fetch('/api/clinic/staff/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invitee_email: email,
          role: inviteRole,
          clinic_config_id: clinicConfigId,
        }),
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        toast.error(payload?.error ?? 'Failed to send invite')
        return
      }

      toast.success('Invite sent')
      setInviteEmail('')
      await fetchStaff()
    } catch (err) {
      console.error('Invite error:', err)
      toast.error('Failed to send invite')
    } finally {
      setInviting(false)
    }
  }

  const postStaffAction = async (endpoint: string, memberId: string) => {
    setActingId(memberId)
    setRevokeConfirm(null)
    setDeactivateConfirm(null)
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) {
        console.error('Staff action failed: missing token')
        return
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ clinic_user_id: memberId }),
      })
      if (res.ok) {
        await fetchStaff()
      } else {
        console.error('Staff action failed:', await res.text())
      }
    } catch (err) {
      console.error('Staff action error:', err)
    } finally {
      setActingId(null)
    }
  }

  return (
    <div id="team-staff" className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wide">TEAM & STAFF</h3>
          <p className="text-slate-400 text-xs mt-0.5">Manage who has access to this clinic.</p>
        </div>
      </div>

      <div className="rounded-lg border border-[#212129] bg-black/20 p-3">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35 mb-2">Invite</p>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="doctor@clinic.com"
            className="h-9 flex-1 rounded-md border border-[#212129] bg-[#0D0D11] px-3 text-sm text-white placeholder:text-white/30 focus:border-[#2DD4BF] focus:outline-none"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as 'doctor' | 'receptionist')}
            className="h-9 rounded-md border border-[#212129] bg-[#0D0D11] px-3 text-sm text-white focus:border-[#2DD4BF] focus:outline-none"
          >
            <option value="receptionist">Staff</option>
            <option value="doctor">Doctor</option>
          </select>
          <button
            onClick={handleInvite}
            disabled={inviting}
            className="h-9 inline-flex items-center justify-center rounded-md bg-[#2DD4BF] px-4 text-xs font-semibold text-white hover:bg-[#2DD4BF]/90 disabled:opacity-60"
          >
            {inviting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Send className="w-3.5 h-3.5 mr-1.5" />}
            {inviting ? 'Inviting...' : 'Invite'}
          </button>
        </div>
      </div>

      {/* Staff list */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
        </div>
      ) : staff.length === 0 ? (
        <p className="text-center text-slate-500 text-sm py-6">No staff added yet.</p>
      ) : (
        <div className="divide-y divide-slate-700/50">
          {staff.map((member) => {
            const status = getInviteStatus(member)
            const isSelf = member.user_id === currentUserId

            return (
              <div
                key={member.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                {/* Left: avatar + email + role badge — UNCHANGED */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 font-medium shrink-0">
                    {member.user_email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{member.user_email}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${ROLE_COLORS[member.role] ?? 'text-slate-400 bg-slate-400/10'}`}>
                        {ROLE_LABELS[member.role] ?? member.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: status badge + action button */}
                <div className="shrink-0 ml-3 flex items-center gap-2">
                  {statusBadge(status)}

                  {/* Action buttons — hidden for own row */}
                  {!isSelf && (
                    <>
                      {/* REVOKE — pending invite (user_id is null) */}
                      {member.user_id === null && (
                        <AlertDialog
                          open={revokeConfirm === member.id}
                          onOpenChange={(open) => { if (!open) setRevokeConfirm(null) }}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRevokeConfirm(member.id)}
                              disabled={actingId !== null || !isOwner}
                              className="text-destructive hover:text-destructive h-7 w-7 p-0"
                            >
                              {actingId === member.id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <Trash2 className="w-3.5 h-3.5" />}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke invite?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This invite link will stop working immediately.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel disabled={actingId !== null}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => postStaffAction('/api/clinic/staff/revoke', member.id)}
                                disabled={actingId !== null}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Revoke
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      {/* DEACTIVATE — active linked account */}
                      {member.user_id !== null && member.is_active && (
                        <AlertDialog
                          open={deactivateConfirm === member.id}
                          onOpenChange={(open) => { if (!open) setDeactivateConfirm(null) }}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeactivateConfirm(member.id)}
                              disabled={actingId !== null || !isOwner}
                              className="text-amber-500 hover:text-amber-400 h-7 w-7 p-0"
                            >
                              {actingId === member.id
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <UserX className="w-3.5 h-3.5" />}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Deactivate {member.user_email}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                They will lose dashboard access immediately. You can reactivate them at any time.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-3 justify-end">
                              <AlertDialogCancel disabled={actingId !== null}>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => postStaffAction('/api/clinic/staff/deactivate', member.id)}
                                disabled={actingId !== null}
                                className="bg-amber-600 text-white hover:bg-amber-700"
                              >
                                Deactivate
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      {/* REACTIVATE — inactive linked account */}
                      {member.user_id !== null && !member.is_active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => postStaffAction('/api/clinic/staff/reactivate', member.id)}
                          disabled={actingId !== null || !isOwner}
                          className="text-emerald-500 hover:text-emerald-400 h-7 w-7 p-0"
                        >
                          {actingId === member.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <UserCheck className="w-3.5 h-3.5" />}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
