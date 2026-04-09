'use client'

import { Appointment } from '@/components/dashboard/profiles/DoctorProfileClient'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

function statusBadge(status: Appointment['status'], confirmed: boolean | null) {
  if (status === 'Cancelled' || status === 'No Show') {
    return 'bg-red-500/10 border-red-500/20 text-red-400'
  }
  if (status === 'Booked' && confirmed) {
    return 'bg-[#2DD4BF]/10 border-[#2DD4BF]/20 text-[#2DD4BF]'
  }
  if (status === 'Booked' && !confirmed) {
    return 'bg-amber-500/10 border-amber-500/20 text-amber-400'
  }
  if (status === 'Completed') {
    return 'bg-[#2DD4BF]/10 border-[#2DD4BF]/20 text-[#2DD4BF]'
  }
  return 'bg-black/20 border-[#212129] text-white/40'
}

export function AppointmentDrawer({
  appointment,
  isOpen,
  onClose,
  formatTime,
  formatDateLong,
}: {
  appointment: Appointment | null
  isOpen: boolean
  onClose: () => void
  formatTime: (time: string | null) => string
  formatDateLong: (dateStr: string | null) => string
}) {
  if (!appointment) return null

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-[#212129] bg-[#121216] flex flex-col transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="px-6 py-5 border-b border-[#212129] bg-black/20 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
              {appointment.patient_name || '-'}
            </h3>
            <div className={cn('mt-2 inline-flex items-center px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border', statusBadge(appointment.status, appointment.appointment_confirmed))}>
              {appointment.status || 'Booked'}
            </div>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <div className="rounded-xl border border-[#212129] bg-black/20 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">
              Patient Information
            </p>
            {[
              { label: 'Full Name', value: appointment.patient_name },
              { label: 'Phone', value: appointment.phone },
              { label: 'Email', value: appointment.email },
            ].map((row, idx, arr) => (
              <div key={row.label} className={cn('flex justify-between py-2', idx < arr.length - 1 && 'border-b border-[#212129]')}>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{row.label}</span>
                <span className="text-sm font-semibold text-white">{row.value || '-'}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#212129] bg-black/20 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">
              Appointment Details
            </p>
            {[
              { label: 'Date', value: formatDateLong(appointment.appointment_date) },
              { label: 'Time', value: formatTime(appointment.appointment_time) },
              { label: 'Type', value: appointment.appointment_type },
              { label: 'Category', value: appointment.service_category },
              { label: 'Status', value: appointment.status },
              { label: 'Confirmed', value: appointment.appointment_confirmed ? 'Yes' : 'Pending' },
            ].map((row, idx, arr) => (
              <div key={row.label} className={cn('flex justify-between py-2', idx < arr.length - 1 && 'border-b border-[#212129]')}>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{row.label}</span>
                <span className="text-sm font-semibold text-white tabular-nums">{row.value || '-'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 border-t border-[#212129] bg-black/20 flex gap-3">
          <button
            onClick={() => console.log('confirm appointment', appointment.id)}
            className="flex-1 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] hover:bg-[#2DD4BF]/20 transition-colors"
          >
            Confirm
          </button>
          <button
            onClick={() => console.log('reschedule appointment', appointment.id)}
            className="flex-1 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            Reschedule
          </button>
          <button
            onClick={() => console.log('cancel appointment', appointment.id)}
            className="flex-1 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
