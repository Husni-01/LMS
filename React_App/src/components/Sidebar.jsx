import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { isAdmin } from '../utils/auth'

const allNavItems = [
  { label: 'Dashboard', path: '/educator', Icon: HomeIcon, adminOnly: false },
  { label: 'Add Course', path: '/educator/add-course', Icon: AddIcon, adminOnly: true },
  { label: 'My Courses', path: '/educator/my-courses', Icon: CoursesIcon, adminOnly: false },
  { label: 'Student Enrolled', path: '/educator/students', Icon: StudentsIcon, adminOnly: false },
]

export default function Sidebar() {
  const [admin, setAdmin] = useState(isAdmin())

  useEffect(() => {
    const handleRoleChange = () => setAdmin(isAdmin())
    window.addEventListener('roleChange', handleRoleChange)
    return () => window.removeEventListener('roleChange', handleRoleChange)
  }, [])

  const navItems = allNavItems.filter((item) => !item.adminOnly || admin)

  return (
    <aside className="w-[248px] shrink-0 border-r border-[rgba(37,37,37,0.3)] min-h-full font-['Outfit',sans-serif] bg-white">
      {navItems.map(({ label, path, Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/educator'}
          className={({ isActive }) =>
            `w-full flex items-center gap-3 h-[47px] px-[40px] text-[16px] text-[#252525] relative transition-colors ${
              isActive ? 'bg-[#f2f3ff] font-medium' : 'hover:bg-gray-50'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon active={isActive} />
              <span>{label}</span>
              {isActive && (
                <span className="absolute right-0 top-0 w-[6px] h-full bg-[#5f6fff] rounded-l-sm" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </aside>
  )
}

function HomeIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 9.5L10 3l7 6.5V18a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1V9.5z"
        stroke={active ? '#5f6fff' : '#1C274C'} strokeWidth="2" strokeLinecap="round" />
      <path d="M8 19v-6h4v6" stroke={active ? '#5f6fff' : '#1C274C'} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function AddIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="13" rx="2"
        stroke={active ? '#5f6fff' : '#1C274C'} strokeWidth="2" />
      <path d="M7 10h6M10 7v6" stroke={active ? '#5f6fff' : '#1C274C'} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CoursesIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 5h12M4 10h12M4 15h8"
        stroke={active ? '#5f6fff' : '#1C274C'} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function StudentsIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="4" stroke={active ? '#5f6fff' : '#1C274C'} strokeWidth="2" />
      <path d="M3 19c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={active ? '#5f6fff' : '#1C274C'} strokeWidth="2" strokeLinecap="round" />
      <path d="M16 10l2 2-4 4" stroke={active ? '#5f6fff' : '#1C274C'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
