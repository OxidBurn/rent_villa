import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Home from './page'

describe('Prime Villa Landing Page', () => {
  it('renders the page without crashing', () => {
    const { container } = render(<Home />)
    expect(container).toBeInTheDocument()
  })

  it('renders the search button', () => {
    render(<Home />)
    const searchButton = screen.getByText(/поиск/i)
    expect(searchButton).toBeInTheDocument()
  })

  it('renders Prime Villa brand name', () => {
    render(<Home />)
    const brandElements = screen.getAllByText(/prime villa/i)
    expect(brandElements.length).toBeGreaterThan(0)
  })
})
