import { redirect } from 'next/navigation'

export const metadata = { title: 'Patient Schedule — AI Blizzard' }

export default function AppointmentsPage() {
  redirect('/dashboard/operations')
}
