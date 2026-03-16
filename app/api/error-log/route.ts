import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

type ErrorPayload = {
  message?: string
  payload?: unknown
  source?: string
}

export async function POST(request: Request) {
  let body: ErrorPayload = {}
  try {
    body = await request.json()
  } catch {
    body = { message: 'Invalid JSON payload', source: 'unknown' }
  }

  const timestamp = new Date().toISOString()
  const entry = [
    `\n## ${timestamp}`,
    `Source: ${body.source ?? 'unknown'}`,
    `Message: ${body.message ?? 'No message provided'}`,
    `Payload: ${JSON.stringify(body.payload ?? null)}`,
    '',
  ].join('\n')

  const logPath = path.join(process.cwd(), 'ERROR_LOG.md')
  await fs.appendFile(logPath, entry, 'utf8')

  return NextResponse.json({ ok: true })
}
