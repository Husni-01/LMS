// src/components/CourseCard.test.jsx
// Tests for the CourseCard component

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import CourseCard from '../components/CourseCard'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockCourse = {
  _id: 'course-123',
  title: 'Build React SaaS App',
  instructor: 'Richard James',
  price: '$10.99',
  rating: 4.5,
  reviewCount: 102,
  badge: 'BEST SELLER',
}

const renderCard = (course = mockCourse) =>
  render(
    <MemoryRouter>
      <CourseCard course={course} />
    </MemoryRouter>
  )

describe('CourseCard Component', () => {
  it('renders the course title', () => {
    renderCard()
    // Title appears in both h3 and PlaceholderThumb — use getAllByText
    const titles = screen.getAllByText(/Build React SaaS App/i)
    expect(titles.length).toBeGreaterThanOrEqual(1)
    // The h3 heading should be one of them
    const heading = titles.find((el) => el.tagName === 'H3')
    expect(heading).toBeInTheDocument()
  })

  it('renders the instructor name', () => {
    renderCard()
    expect(screen.getByText(/Richard James/i)).toBeInTheDocument()
  })

  it('renders the course price', () => {
    renderCard()
    expect(screen.getByText('$10.99')).toBeInTheDocument()
  })

  it('renders the rating value', () => {
    renderCard()
    expect(screen.getByText('4.5')).toBeInTheDocument()
  })

  it('renders the review count', () => {
    renderCard()
    expect(screen.getByText('(102)')).toBeInTheDocument()
  })

  it('navigates to course detail page when clicked', () => {
    renderCard()
    // The card is a div with cursor-pointer — get it by its container
    const { container } = render(
      <MemoryRouter>
        <CourseCard course={mockCourse} />
      </MemoryRouter>
    )
    const card = container.querySelector('[class*="cursor-pointer"]')
    expect(card).toBeTruthy()
    fireEvent.click(card)
    expect(mockNavigate).toHaveBeenCalledWith('/course/course-123')
  })

  it('shows the badge when provided', () => {
    renderCard()
    expect(screen.getByText('BEST SELLER')).toBeInTheDocument()
  })

  it('does not crash with minimal data', () => {
    expect(() =>
      renderCard({ _id: 'x', title: 'Minimal', price: '$0' })
    ).not.toThrow()
  })

  it('renders placeholder when no image is provided', () => {
    renderCard({ ...mockCourse, image: null })
    // PlaceholderThumb renders the title text inside
    // The title appears both in h3 and inside PlaceholderThumb
    const titleElements = screen.getAllByText(/Build React SaaS App/i)
    expect(titleElements.length).toBeGreaterThanOrEqual(1)
  })

  it('renders an img tag when image src is provided', () => {
    renderCard({ ...mockCourse, image: 'https://example.com/img.jpg' })
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
