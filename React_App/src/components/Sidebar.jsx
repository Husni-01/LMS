import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { isAdmin, logout } from '../utils/auth'

const allNavItems = [
  { label: 'Dashboard', path: '/', Icon: HomeIcon, adminOnly: false },
  { label: 'Add Course', path: '/educator/add-course', Icon: AddIcon, adminOnly: true },
  { label: 'My Courses', path: '/educator/my-courses', Icon: CoursesIcon, adminOnly: false },
  { label: 'Student Enrolled', path: '/educator/students', Icon: StudentsIcon, adminOnly: false },
  { label: 'Add Admin', path: '/educator/add-admin', Icon: AdminIcon, adminOnly: true },
]

export default function Sidebar() {
  const [admin, setAdmin] = useState(isAdmin())
  const navigate = useNavigate()

  useEffect(() => {
    const handleRoleChange = () => setAdmin(isAdmin())
    window.addEventListener('roleChange', handleRoleChange)
    return () => window.removeEventListener('roleChange', handleRoleChange)
  }, [])

  const navItems = allNavItems.filter((item) => !item.adminOnly || admin)

  return (
    <aside className="w-[248px] shrink-0 border-r border-[rgba(37,37,37,0.3)] min-h-[calc(100vh-74px)] font-['Outfit',sans-serif] bg-white flex flex-col">
      <div className="flex-1">
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
      </div>
      
      <div className="p-4 mb-4">
        <button 
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="w-full flex items-center justify-center gap-2 h-[47px] text-[16px] text-red-600 font-medium rounded-md hover:bg-red-50 transition-colors border border-red-200"
        >
          <PowerIcon />
          Logout
        </button>
      </div>
    </aside>
  )
}

function PowerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
      <line x1="12" y1="2" x2="12" y2="12"></line>
    </svg>
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

function AdminIcon({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L2 6l8 4 8-4-8-4z" stroke={active ? '#5f6fff' : '#1C274C'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 8v5c0 3 3 5 6 5s6-2 6-5V8M10 10v6" stroke={active ? '#5f6fff' : '#1C274C'} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}
