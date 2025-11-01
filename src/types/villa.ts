export type VillaCategory = 'unique' | 'beachfront' | 'premium' | 'chalet'

export interface Villa {
  id: string
  title: string
  location: string
  description: string
  image: string
  category: VillaCategory
  maxGuests: number
  bedrooms: number
  bathrooms: number
  pricePerNight?: number
  aspectRatio?: string
}

export interface VillaCardProps {
  villa: Villa
  onClick?: () => void
}
