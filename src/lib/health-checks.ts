import { sql } from 'drizzle-orm'

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy'

export interface HealthCheckResult {
  status: HealthStatus
  responseTime?: number
  error?: string
}

export interface HealthResponse {
  status: HealthStatus
  timestamp: string
  version: string
  deploymentId: string
  environment: string
  checks: {
    database: HealthCheckResult
  }
}

export async function checkDatabaseHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now()

  try {
    if (!process.env.DATABASE_URL) {
      return {
        status: 'degraded',
        responseTime: Date.now() - startTime,
        error: 'DATABASE_URL not configured',
      }
    }

    const { db } = await import('@/db/client')
    await db.execute(sql`SELECT 1`)

    const responseTime = Date.now() - startTime

    return {
      status: 'healthy',
      responseTime,
    }
  } catch (error) {
    const responseTime = Date.now() - startTime

    return {
      status: 'unhealthy',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown database error',
    }
  }
}

export async function getHealthStatus(): Promise<HealthResponse> {
  const databaseCheck = await checkDatabaseHealth()

  const overallStatus: HealthStatus = databaseCheck.status === 'unhealthy' ? 'unhealthy' : 'healthy'

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID || 'local',
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    checks: {
      database: databaseCheck,
    },
  }
}
