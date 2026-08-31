// src/services/api.test.js
// Tests for the API service configuration

import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'

// We mock axios to avoid real HTTP calls
vi.mock('axios', () => {
  const mockInstance = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  }
  return {
    default: {
      create: vi.fn(() => mockInstance),
    },
  }
})

describe('API Service Module', () => {
  it('creates an axios instance with correct baseURL', async () => {
    const { default: axiosLib } = await import('axios')
    // Import api to trigger axios.create call
    await import('../services/api')
    expect(axiosLib.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'http://localhost:5000/api',
      })
    )
  })

  it('sets Content-Type header to application/json', async () => {
    const { default: axiosLib } = await import('axios')
    await import('../services/api')
    expect(axiosLib.create).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    )
  })

  it('registers a request interceptor', async () => {
    const { default: axiosLib } = await import('axios')
    const instance = axiosLib.create()
    await import('../services/api')
    expect(instance.interceptors.request.use).toHaveBeenCalled()
  })
})
