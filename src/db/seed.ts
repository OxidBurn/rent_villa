import { db } from './client'
import { properties, users } from './schema'

async function seed() {
  console.warn('Seeding database...')

  const [owner] = await db
    .insert(users)
    .values({
      email: 'owner@example.com',
      name: 'John Doe',
    })
    .returning()

  console.warn('Created owner:', owner)

  const [property] = await db
    .insert(properties)
    .values({
      ownerId: owner.id,
      name: 'Sunset Villa',
      address: '123 Beach Road, Miami, FL 33139',
      bedrooms: 3,
      bathrooms: 2,
      monthlyRent: 3500,
    })
    .returning()

  console.warn('Created property:', property)

  console.warn('Seeding completed successfully')
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
