'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UserPlus, Mail, Shield, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface StaffMember {
  id: string
  user_email: string
  role: string
  is_active: boolean
  invite_expires_at: string | null
  created_at: string
  // null means invite not yet accepted (no auth user linked)
  user_id: string | null
}

interface StaffSectionProps {
  clinicConfigId: string
}

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  doctor: 'Doctor',
  staff: 'Staff',
}

const ROLE_COLORS: Record<string, string> = {
  owner: 'text-teal-400 bg-teal-400/10',
  admin: 'text-blue-400 bg-blue-400/10',
  doctor: 'text-purple-400 bg-purple-400/10',
  staff: 'text-slate-400 bg-slate-400/10',
}

export function StaffSection({ clinicConfigId }: StaffSectionProps) {
  const supabase = createClient()

  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteOpen, setInviteOpen] = useState(false)

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<string>('staff')
  const [inviting, setInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState(false)

  useEffect(() => {
    fetchStaff()
  }, [clinicConfigId])

  const fetchStaff = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('clinic_users')
      .select('id, user_email, role, is_active, invite_expires_at, created_at, user_id')
      .eq('clinic_config_id', clinicConfigId)
      .order('created_at', { ascending: true })

    if (!error && data) {
      setStaff(data.filter((m): m is StaffMember => m.user_email !== null))
    }
    setLoading(false)
  }

  const handleInvite = async () => {
    setInviteError(null)
    if (!inviteEmail.trim()) {
      setInviteError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.trim())) {
      setInviteError('Enter a valid email address')
      return
    }

    setInviting(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      setInviteError('Session expired. Please refresh and try again.')
      setInviting(false)
      return
    }

    try {
      const res = await fetch('/api/clinic/staff/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          invitee_email: inviteEmail.trim(),
          role: inviteRole,
          clinic_config_id: clinicConfigId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setInviteError(data.error || 'Failed to send invite')
        setInviting(false)
        return
      }

      setInviteSuccess(true)
      setInviteEmail('')
      setInviteRole('staff')
      await fetchStaff()

      // Auto-close after brief success moment
      setTimeout(() => {
        setInviteOpen(false)
        setInviteSuccess(false)
      }, 1800)
    } catch (err) {
      setInviteError('Network error. Please try again.')
    } finally {
      setInviting(false)
    }
  }

  const getInviteStatus = (member: StaffMember) => {
    // Has a linked user_id = accepted
    if (member.user_id) return 'active'
    // No user_id but exists = pending invite
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

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wide">TEAM & STAFF</h3>
          <p className="text-slate-400 text-xs mt-0.5">Manage who has access to this clinic.</p>
        </div>

        <Dialog open={inviteOpen} onOpenChange={(open) => {
          setInviteOpen(open)
          if (!open) {
            setInviteEmail('')
            setInviteRole('staff')
            setInviteError(null)
            setInviteSuccess(false)
          }
        }}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-teal-600 hover:bg-teal-500 text-white flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Invite Staff
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-sm">
            <DialogHeader>
              <DialogTitle>Invite a team member</DialogTitle>
              <DialogDescription className="text-slate-400">
                They'll receive an email with a link to join via Google.
              </DialogDescription>
            </DialogHeader>

            {inviteSuccess ? (
              <div className="flex flex-col items-center gap-2 py-6 text-emerald-400">
                <CheckCircle className="w-10 h-10" />
                <p className="text-sm font-medium">Invite sent!</p>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="email"
                      placeholder="staff@clinic.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                      className="pl-9 bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Role</label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {inviteError && (
                  <p className="text-xs text-red-400 bg-red-400/10 border border-red-700 rounded-lg px-3 py-2">
                    {inviteError}
                  </p>
                )}

                <Button
                  onClick={handleInvite}
                  disabled={inviting}
                  className="w-full bg-teal-600 hover:bg-teal-500"
                >
                  {inviting ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Sending...</>
                  ) : (
                    'Send Invite'
                  )}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
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
            return (
              <div
                key={member.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar placeholder */}
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

                <div className="shrink-0 ml-3">
                  {statusBadge(status)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}