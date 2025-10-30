import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from './page'

describe('Home Page', () => {
  it('renders the Next.js logo', () => {
    render(<Home />)
    const logo = screen.getByAltText('Next.js logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders the main heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('To get started, edit the page.tsx file.')
  })

  it('renders templates link', () => {
    render(<Home />)
    const templatesLink = screen.getByRole('link', { name: /templates/i })
    expect(templatesLink).toBeInTheDocument()
    expect(templatesLink).toHaveAttribute('href', expect.stringContaining('vercel.com/templates'))
  })

  it('renders learning center link', () => {
    render(<Home />)
    const learningLink = screen.getByRole('link', { name: /learning/i })
    expect(learningLink).toBeInTheDocument()
    expect(learningLink).toHaveAttribute('href', expect.stringContaining('nextjs.org/learn'))
  })

  it('renders deploy button', () => {
    render(<Home />)
    const deployButton = screen.getByRole('link', { name: /deploy now/i })
    expect(deployButton).toBeInTheDocument()
    expect(deployButton).toHaveAttribute('target', '_blank')
  })

  it('renders documentation link', () => {
    render(<Home />)
    const docsLink = screen.getByRole('link', { name: /documentation/i })
    expect(docsLink).toBeInTheDocument()
    expect(docsLink).toHaveAttribute('href', expect.stringContaining('nextjs.org/docs'))
  })
})
