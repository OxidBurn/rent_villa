export interface Destination {
  id: string
  name: string
  description: string
  image: string
  villaCount: number
}

export interface DestinationCardProps {
  destination: Destination
  onClick?: () => void
}
