// src/pages/PaymentSuccess.test.jsx
// Tests for the PaymentSuccess page

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

// Mock paymentService
vi.mock('../services/api', () => ({
  paymentService: {
    enrollAfterPayment: vi.fn(),
  },
}))

import { paymentService } from '../services/api'
import PaymentSuccess from '../pages/PaymentSuccess'

const renderWithParams = (search = '') =>
  render(
    <MemoryRouter initialEntries={[`/payment-success${search}`]}>
      <Routes>
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </MemoryRouter>
  )

describe('PaymentSuccess Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows processing spinner initially', () => {
    paymentService.enrollAfterPayment.mockReturnValue(new Promise(() => {})) // never resolves
    renderWithParams('?session_id=sess_123&course_id=c1')
    expect(screen.getByText(/Processing Payment/i)).toBeInTheDocument()
  })

  it('shows error when session_id or course_id is missing', async () => {
    renderWithParams('') // no params
    await waitFor(() => {
      expect(screen.getByText(/Missing required payment information/i)).toBeInTheDocument()
    })
  })

  it('shows success state after successful enrollment', async () => {
    paymentService.enrollAfterPayment.mockResolvedValue({ data: { status: 'success' } })
    renderWithParams('?session_id=sess_123&course_id=c1')
    await waitFor(() => {
      expect(screen.getByText(/Payment Successful/i)).toBeInTheDocument()
    })
  })

  it('shows error state when enrollment fails', async () => {
    paymentService.enrollAfterPayment.mockRejectedValue({
      response: { data: { message: 'Enrollment failed on server.' } },
    })
    renderWithParams('?session_id=sess_123&course_id=c1')
    await waitFor(() => {
      expect(screen.getByText(/Enrollment Issue/i)).toBeInTheDocument()
      expect(screen.getByText(/Enrollment failed on server./i)).toBeInTheDocument()
    })
  })

  it('calls enrollAfterPayment with correct courseId and sessionId', async () => {
    paymentService.enrollAfterPayment.mockResolvedValue({ data: {} })
    renderWithParams('?session_id=sess_abc&course_id=course_xyz')
    await waitFor(() => {
      expect(paymentService.enrollAfterPayment).toHaveBeenCalledWith({
        courseId: 'course_xyz',
        sessionId: 'sess_abc',
      })
    })
  })
})
