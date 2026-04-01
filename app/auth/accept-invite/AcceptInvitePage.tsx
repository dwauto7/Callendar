import { Suspense } from 'react'
import AcceptInvitePage from './AcceptInvitePage'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
      <AcceptInvitePage />
    </Suspense>
  )
}