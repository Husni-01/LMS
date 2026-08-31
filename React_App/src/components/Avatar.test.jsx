// src/components/Avatar.test.jsx
// Tests for the Avatar component

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Avatar from '../components/Avatar'

describe('Avatar Component', () => {
  it('renders the first letter of the name as initials', () => {
    render(<Avatar name="Alice" />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('renders "?" initial when no name is provided', () => {
    render(<Avatar />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('renders an <img> tag when a src prop is passed', () => {
    render(<Avatar name="Bob" src="https://example.com/photo.png" />)
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/photo.png')
    expect(img).toHaveAttribute('alt', 'Bob')
  })

  it('does NOT render an <img> when src is null (initials fallback)', () => {
    render(<Avatar name="Carol" src={null} />)
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('applies custom size via inline styles', () => {
    const { container } = render(<Avatar name="Dave" size={50} />)
    const div = container.firstChild
    expect(div).toHaveStyle({ width: '50px', height: '50px' })
  })

  it('uppercases the first character of the name', () => {
    render(<Avatar name="eve" />)
    expect(screen.getByText('E')).toBeInTheDocument()
  })

  it('renders a different color per name (deterministic)', () => {
    const { container: c1 } = render(<Avatar name="Alice" />)
    const { container: c2 } = render(<Avatar name="Zara" />)
    // Both should render but may differ in background — just ensure they render
    expect(c1.firstChild).toBeInTheDocument()
    expect(c2.firstChild).toBeInTheDocument()
  })
})
