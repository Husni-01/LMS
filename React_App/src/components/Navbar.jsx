import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAdmin, getCurrentUser, logout } from '../utils/auth'

const defaultProps = {
  brandName: 'Edemy',
  links: [{ label: 'Add Course', path: '/educator/add-course', adminOnly: true }],
}

export default function Navbar({ props = defaultProps }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [admin, setAdmin] = useState(isAdmin())
  const [user, setUser] = useState(getCurrentUser())
  const navigate = useNavigate()
  const { brandName, links } = props

  useEffect(() => {
    const handleRoleChange = () => {
      setAdmin(isAdmin())
      setUser(getCurrentUser())
    }
    window.addEventListener('roleChange', handleRoleChange)
    return () => window.removeEventListener('roleChange', handleRoleChange)
  }, [])

  const visibleLinks = links.filter((link) => !link.adminOnly || admin)

  return (
    <header className="h-[74px] border-b border-[rgba(37,37,37,0.2)] flex items-center justify-between px-6 md:px-12 bg-white sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-3">
        <LogoMark />
        <span className="text-2xl font-semibold text-[#0e0e0e] font-['Outfit',sans-serif]">{brandName}</span>
      </Link>

      <nav className="hidden md:flex items-center gap-6">
        <Link
          to="/courses"
          className="text-[15px] text-[#252525] hover:text-[#0260FF] transition-colors font-['Outfit',sans-serif]"
        >
          All Courses
        </Link>

        {visibleLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="text-[15px] text-[#252525] hover:text-[#0260FF] transition-colors font-['Outfit',sans-serif]"
          >
            {link.label}
          </Link>
        ))}
        <div className="w-px h-5 bg-[rgba(37,37,37,0.3)]" />
        
        {user ? (
          <>
            <button
              onClick={() => navigate('/educator')}
              className="text-[15px] text-[#252525] hover:text-[#0260FF] transition-colors font-['Outfit',sans-serif]"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="bg-gray-100 text-[#252525] text-[15px] font-medium px-5 py-2 rounded-md hover:bg-gray-200 transition-colors font-['Outfit',sans-serif]"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-[15px] text-[#252525] hover:text-[#0260FF] transition-colors font-['Outfit',sans-serif] font-medium"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="bg-[#0260FF] text-white text-[15px] font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition-colors font-['Outfit',sans-serif]"
            >
              Create Account
            </Link>
          </>
        )}
      </nav>

      {/* Mobile hamburger */}
      <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
        <span className="block w-6 h-0.5 bg-[#252525] mb-1.5" />
        <span className="block w-6 h-0.5 bg-[#252525] mb-1.5" />
        <span className="block w-6 h-0.5 bg-[#252525]" />
      </button>

      {menuOpen && (
        <div className="absolute top-[74px] left-0 right-0 bg-white border-b border-[rgba(37,37,37,0.2)] p-4 flex flex-col gap-3 md:hidden z-50">
          <Link to="/courses" onClick={() => setMenuOpen(false)} className="text-[15px] text-left text-[#252525] font-['Outfit',sans-serif]">
            All Courses
          </Link>
          {visibleLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)} className="text-[15px] text-left text-[#252525] font-['Outfit',sans-serif]">
              {link.label}
            </Link>
          ))}
          {user ? (
            <>
              <button onClick={() => { navigate('/educator'); setMenuOpen(false) }} className="text-[15px] text-left text-[#252525] font-['Outfit',sans-serif]">
                Dashboard
              </button>
              <button onClick={() => { logout(); navigate('/'); setMenuOpen(false) }} className="text-[15px] text-left text-[#252525] font-['Outfit',sans-serif] text-red-500">
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-[15px] text-left text-[#0260FF] font-medium font-['Outfit',sans-serif]">
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

function LogoMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M17 0C7.611 0 0 7.611 0 17s7.611 17 17 17 17-7.611 17-17S26.389 0 17 0zm-3 9l10 8-10 8V9z"
        fill="#0260FF" />
    </svg>
  )
}
