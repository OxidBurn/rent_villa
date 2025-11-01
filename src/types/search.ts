export interface SearchFormData {
  checkIn: Date | null
  checkOut: Date | null
  adults: number
  children: number
}

export interface SearchFormProps {
  onSearch: (data: SearchFormData) => void
}
