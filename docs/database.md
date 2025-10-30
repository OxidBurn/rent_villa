# Database Guide

This document describes the database infrastructure and management for the Rent Villa project.

## Overview

Rent Villa uses **Vercel Postgres** with **Drizzle ORM** for type-safe database operations.

**Stack:**
- Database: Vercel Postgres (PostgreSQL)
- ORM: Drizzle ORM
- Migration Tool: Drizzle Kit
- Runtime: Node.js with `postgres` driver

## Local Development

### Setup Local Database

**Option 1: Use Vercel Postgres (Recommended)**

1. Pull environment variables from Vercel:
   ```bash
   vercel env pull .env.local
   ```

2. Run migrations:
   ```bash
   npm run db:migrate:run
   ```

3. Seed development data:
   ```bash
   npm run db:seed
   ```

**Option 2: Local PostgreSQL**

1. Install PostgreSQL locally

2. Create database:
   ```bash
   createdb rent_villa_dev
   ```

3. Create `.env.local`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/rent_villa_dev"
   ```

4. Run migrations and seed:
   ```bash
   npm run db:migrate:run
   npm run db:seed
   ```

### Common Commands

```bash
# Generate migration from schema changes
npm run db:generate

# Run pending migrations
npm run db:migrate:run

# Push schema changes directly (development only!)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio

# Seed development data
npm run db:seed
```

## Database Schema

### Users Table

Stores user information for property owners.

```typescript
{
  id: uuid (primary key)
  email: varchar(255) (unique, not null)
  name: varchar(255) (not null)
  createdAt: timestamp (default now)
  updatedAt: timestamp (default now)
}
```

### Properties Table

Stores rental property information.

```typescript
{
  id: uuid (primary key)
  ownerId: uuid (foreign key -> users.id)
  name: varchar(255) (not null)
  address: text (not null)
  bedrooms: integer (not null)
  bathrooms: integer (not null)
  monthlyRent: integer (not null, in cents)
  createdAt: timestamp (default now)
  updatedAt: timestamp (default now)
}
```

## Schema Management

### Creating a New Table

1. Create schema file in `src/db/schema/`:
   ```typescript
   // src/db/schema/tenants.ts
   import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'

   export const tenants = pgTable('tenants', {
     id: uuid('id').defaultRandom().primaryKey(),
     name: varchar('name', { length: 255 }).notNull(),
     email: varchar('email', { length: 255 }).notNull().unique(),
     createdAt: timestamp('created_at').defaultNow().notNull(),
     updatedAt: timestamp('updated_at').defaultNow().notNull(),
   })

   export type Tenant = typeof tenants.$inferSelect
   export type NewTenant = typeof tenants.$inferInsert
   ```

2. Export from `src/db/schema/index.ts`:
   ```typescript
   export * from './tenants'
   ```

3. Generate migration:
   ```bash
   npm run db:generate
   ```

4. Review migration file in `src/db/migrations/`

5. Run migration:
   ```bash
   npm run db:migrate:run
   ```

### Modifying Existing Tables

1. Update schema file (e.g., `src/db/schema/users.ts`)

2. Generate migration:
   ```bash
   npm run db:generate
   ```

3. Review and test migration locally

4. Commit migration file to git

## Querying Data

### Basic Queries

```typescript
import { db } from '@/db/client'
import { properties } from '@/db/schema'

// Select all
const allProperties = await db.select().from(properties)

// Select with condition
import { eq } from 'drizzle-orm'
const property = await db
  .select()
  .from(properties)
  .where(eq(properties.id, propertyId))
```

### Joins

```typescript
import { db } from '@/db/client'
import { properties, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

const propertiesWithOwners = await db
  .select({
    property: properties,
    owner: users,
  })
  .from(properties)
  .leftJoin(users, eq(properties.ownerId, users.id))
```

### Insert

```typescript
const [newProperty] = await db
  .insert(properties)
  .values({
    ownerId: userId,
    name: 'Sunset Villa',
    address: '123 Beach Road',
    bedrooms: 3,
    bathrooms: 2,
    monthlyRent: 350000, // in cents
  })
  .returning()
```

### Update

```typescript
await db
  .update(properties)
  .set({ monthlyRent: 375000 })
  .where(eq(properties.id, propertyId))
```

### Delete

```typescript
await db
  .delete(properties)
  .where(eq(properties.id, propertyId))
```

## Migrations

### Local Migrations

Migrations run automatically when you use `npm run db:migrate:run`.

### Production Migrations

Migrations run automatically on Vercel deployment via the build process.

The deployment flow:
1. Vercel starts build
2. Runs `npm run build` (or `vercel-build` if configured)
3. Build process includes migration execution
4. Application deploys with updated schema

### Manual Migration (Emergency)

If you need to run migrations manually in production:

1. Pull production environment variables:
   ```bash
   vercel env pull .env.production
   ```

2. Run migrations:
   ```bash
   DATABASE_URL=<production-url> npm run db:migrate:run
   ```

**⚠️ Use with extreme caution!**

### Rollback

Drizzle does not support automatic rollback. To rollback:

1. Restore database from Vercel backup
2. Redeploy previous application version
3. Verify data integrity

## Drizzle Studio

Drizzle Studio provides a GUI for exploring and managing your database.

```bash
npm run db:studio
```

Opens at http://localhost:4983

Features:
- Browse tables and data
- Run queries
- Edit data directly
- View relationships

## Environment Variables

### Required

- `DATABASE_URL` - Full connection string for application queries
- `DATABASE_URL_MIGRATION` - Non-pooled connection for migrations (optional, falls back to DATABASE_URL)

### Vercel Setup

Vercel Postgres automatically provides:
- `POSTGRES_URL` - Full connection string
- `POSTGRES_PRISMA_URL` - Optimized for ORM (use for DATABASE_URL)
- `POSTGRES_URL_NON_POOLING` - For migrations (use for DATABASE_URL_MIGRATION)

## Troubleshooting

### Connection Timeout

**Symptom:** Database operations hang or timeout

**Solutions:**
- Check `DATABASE_URL` is set correctly
- Verify Vercel Postgres is in the same region as deployment
- Check connection pool settings in `src/db/client.ts`

### Migration Fails

**Symptom:** `npm run db:migrate:run` fails

**Solutions:**
- Check migration file for syntax errors
- Verify `DATABASE_URL` or `DATABASE_URL_MIGRATION` is set
- Ensure database credentials are correct
- Check database is accessible from your network

### Type Errors

**Symptom:** TypeScript complains about database types

**Solutions:**
- Regenerate types: `npm run db:generate`
- Restart TypeScript server in your editor
- Verify schema files are exported in `src/db/schema/index.ts`

### Seed Script Fails

**Symptom:** `npm run db:seed` fails with unique constraint error

**Solutions:**
- Database already has seed data
- Drop and recreate database
- Or modify seed script to check for existing data first

## Best Practices

### Do

- ✅ Always generate migrations for schema changes
- ✅ Review migration files before running
- ✅ Test migrations in development first
- ✅ Use type-safe queries with Drizzle
- ✅ Use transactions for related operations
- ✅ Add indexes for frequently queried columns

### Don't

- ❌ Edit generated migration files manually
- ❌ Use `db:push` in production
- ❌ Commit `.env.local` to git
- ❌ Skip migration testing before deployment
- ❌ Run migrations outside of deployment (except emergencies)

## Performance Tips

1. **Use Indexes**
   ```typescript
   import { index } from 'drizzle-orm/pg-core'

   export const properties = pgTable('properties', {
     // ... columns
   }, (table) => ({
     ownerIdIdx: index('owner_id_idx').on(table.ownerId),
   }))
   ```

2. **Limit Results**
   ```typescript
   const properties = await db
     .select()
     .from(properties)
     .limit(10)
   ```

3. **Use Select Specific Columns**
   ```typescript
   const names = await db
     .select({ name: properties.name })
     .from(properties)
   ```

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Vercel Postgres Guide](https://vercel.com/docs/storage/vercel-postgres)
- [Drizzle Kit CLI](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
