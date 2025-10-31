import { NextResponse } from 'next/server'

import { getHealthStatus } from '@/lib/health-checks'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const health = await getHealthStatus()

    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 503 }
    )
  }
}
