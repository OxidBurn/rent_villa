import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const runMigrations = async () => {
  const connectionString = process.env.DATABASE_URL_MIGRATION || process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined')
  }

  const migrationClient = postgres(connectionString, { max: 1 })
  const db = drizzle(migrationClient)

  console.log('Running migrations...')

  await migrate(db, { migrationsFolder: './src/db/migrations' })

  console.log('Migrations completed successfully')

  await migrationClient.end()
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
