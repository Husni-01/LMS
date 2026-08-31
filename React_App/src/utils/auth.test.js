// src/utils/auth.test.js
// Tests for the auth utility functions

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getCurrentUser,
  getUserRole,
  isAdmin,
  setUserRole,
  logout,
} from '../utils/auth'

// ─── Helpers ────────────────────────────────────────────────────────────────
const makeJwt = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body   = btoa(JSON.stringify(payload))
  return `${header}.${body}.fake_signature`
}

// ─── Setup ──────────────────────────────────────────────────────────────────
beforeEach(() => {
  localStorage.clear()
  vi.spyOn(window, 'dispatchEvent').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

// ─── getCurrentUser ──────────────────────────────────────────────────────────
describe('getCurrentUser()', () => {
  it('returns null when localStorage is empty', () => {
    expect(getCurrentUser()).toBeNull()
  })

  it('returns parsed user object stored under "user" key', () => {
    const user = { name: 'Alice', role: 'student' }
    localStorage.setItem('user', JSON.stringify(user))
    expect(getCurrentUser()).toEqual(user)
  })

  it('decodes payload from a JWT token when no "user" key exists', () => {
    const payload = { id: '123', role: 'admin', name: 'Bob' }
    localStorage.setItem('token', makeJwt(payload))
    const result = getCurrentUser()
    expect(result.role).toBe('admin')
    expect(result.name).toBe('Bob')
  })

  it('falls back to role-based object when only "role" is stored', () => {
    localStorage.setItem('role', 'admin')
    const result = getCurrentUser()
    expect(result).not.toBeNull()
    expect(result.role).toBe('admin')
    expect(result.name).toBe('Admin')
  })

  it('returns null if stored "user" key is invalid JSON', () => {
    localStorage.setItem('user', 'not-json{{')
    // should not throw — should fall through to token/role checks
    expect(() => getCurrentUser()).not.toThrow()
  })
})

// ─── getUserRole ─────────────────────────────────────────────────────────────
describe('getUserRole()', () => {
  it('defaults to "student" when nothing is stored', () => {
    expect(getUserRole()).toBe('student')
  })

  it('returns role from stored user object', () => {
    localStorage.setItem('user', JSON.stringify({ role: 'educator' }))
    expect(getUserRole()).toBe('educator')
  })

  it('returns role from localStorage "role" key as fallback', () => {
    localStorage.setItem('role', 'admin')
    expect(getUserRole()).toBe('admin')
  })
})

// ─── isAdmin ─────────────────────────────────────────────────────────────────
describe('isAdmin()', () => {
  it('returns false for a student', () => {
    localStorage.setItem('user', JSON.stringify({ role: 'student' }))
    expect(isAdmin()).toBe(false)
  })

  it('returns true for an admin user', () => {
    localStorage.setItem('user', JSON.stringify({ role: 'admin' }))
    expect(isAdmin()).toBe(true)
  })

  it('returns true for an educator user', () => {
    localStorage.setItem('user', JSON.stringify({ role: 'educator' }))
    expect(isAdmin()).toBe(true)
  })
})

// ─── setUserRole ─────────────────────────────────────────────────────────────
describe('setUserRole()', () => {
  it('stores the role in localStorage', () => {
    setUserRole('admin')
    expect(localStorage.getItem('role')).toBe('admin')
  })

  it('dispatches a "roleChange" event on the window', () => {
    setUserRole('educator')
    expect(window.dispatchEvent).toHaveBeenCalledOnce()
  })
})

// ─── logout ──────────────────────────────────────────────────────────────────
describe('logout()', () => {
  it('clears token, user and role from localStorage', () => {
    localStorage.setItem('token', 'some_token')
    localStorage.setItem('user', JSON.stringify({ name: 'Alice' }))
    localStorage.setItem('role', 'admin')

    logout()

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
    expect(localStorage.getItem('role')).toBeNull()
  })

  it('dispatches a "roleChange" event after logout', () => {
    logout()
    expect(window.dispatchEvent).toHaveBeenCalledOnce()
  })
})
