import { redirect } from 'next/navigation'

export const metadata = { title: 'Patient Schedule — Beacon Horizons' }

export default function AppointmentsPage() {
  redirect('/dashboard/operations')
}
