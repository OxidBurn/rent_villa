import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  throw new Error('Sentry Example API Error - This is a test error')
}
