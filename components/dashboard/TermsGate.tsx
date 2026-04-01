'use client'

import { useState } from 'react'
import { TermsAcceptanceModal, CURRENT_TERMS_VERSION } from './TermsAcceptanceModal'

interface Props {
  clinicConfigId: string
  acceptedVersion: string | null
  children: React.ReactNode
}

export function TermsGate({ clinicConfigId, acceptedVersion, children }: Props) {
  const needsAcceptance = acceptedVersion !== CURRENT_TERMS_VERSION
  const [accepted, setAccepted] = useState(!needsAcceptance)

  return (
    <>
      {!accepted && (
        <TermsAcceptanceModal
          clinicConfigId={clinicConfigId}
          onAccepted={() => setAccepted(true)}
        />
      )}
      {children}
    </>
  )
}