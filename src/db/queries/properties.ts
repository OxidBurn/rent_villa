import { db } from '../client'
import { properties, users } from '../schema'
import { eq } from 'drizzle-orm'

export async function getAllProperties() {
  return db
    .select({
      id: properties.id,
      name: properties.name,
      address: properties.address,
      bedrooms: properties.bedrooms,
      bathrooms: properties.bathrooms,
      monthlyRent: properties.monthlyRent,
      owner: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(properties)
    .leftJoin(users, eq(properties.ownerId, users.id))
}

export async function getPropertyById(id: string) {
  const [property] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, id))
    .limit(1)

  return property
}
