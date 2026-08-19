// Utility functions for Role and Auth management

export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) return JSON.parse(userStr)
  } catch (e) {}

  const token = localStorage.getItem('token')
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload
    } catch (e) {}
  }

  const role = localStorage.getItem('role')
  if (role) {
    return { role, name: role === 'admin' ? 'Admin' : 'User' }
  }

  return null
}

export function getUserRole() {
  return getCurrentUser()?.role || localStorage.getItem('role') || 'student'
}

export function isAdmin() {
  return getUserRole() === 'admin' || getUserRole() === 'educator'
}

export function setUserRole(role) {
  localStorage.setItem('role', role)
  window.dispatchEvent(new Event('roleChange'))
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('role')
  window.dispatchEvent(new Event('roleChange'))
}
