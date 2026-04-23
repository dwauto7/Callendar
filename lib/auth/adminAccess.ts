export function getConfiguredAdminEmails(): string[] {
  const candidates = [
    process.env.ADMIN_EMAILS,
    process.env.NEXT_PUBLIC_ADMIN_EMAILS,
    process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  ]

  const raw = candidates.find((value) => typeof value === 'string' && value.trim().length > 0) ?? ''

  return raw
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
}

export function isAllowedAdminEmail(email?: string | null): boolean {
  const configured = getConfiguredAdminEmails()
  if (configured.length === 0) return false
  if (!email) return false
  return configured.includes(email.toLowerCase())
}
