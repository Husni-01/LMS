import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import Sidebar from './Sidebar'
import { getUserRole, setUserRole } from '../utils/auth'
import { LogoMark, UserIcon, SocialIcon } from './Icons'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif] flex flex-col justify-between">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export function EducatorLayout() {
  const navigate = useNavigate()
  const [currentRole, setCurrentRole] = useState(getUserRole())

  useEffect(() => {
    const handleRoleChange = () => setCurrentRole(getUserRole())
    window.addEventListener('roleChange', handleRoleChange)
    return () => window.removeEventListener('roleChange', handleRoleChange)
  }, [])

  const handleRoleToggle = (e) => {
    const newRole = e.target.value
    setCurrentRole(newRole)
    setUserRole(newRole)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-['Outfit',sans-serif]">
      {/* Dashboard top bar */}
      <header className="h-[74px] border-b border-[rgba(37,37,37,0.2)] flex items-center justify-between px-8 shrink-0 bg-white sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <LogoMark />
          <span className="text-2xl font-semibold text-[#0e0e0e]">Edemy</span>
        </Link>
        <div className="flex items-center gap-4">
          {/* Interactive Role Switcher for testing */}
          <div className="flex items-center gap-2 bg-slate-50 border border-gray-200 px-3 py-1.5 rounded-full text-xs">
            <span className="text-gray-500 font-medium">Role:</span>
            <select
              value={currentRole}
              onChange={handleRoleToggle}
              className="bg-white border border-gray-300 font-semibold rounded px-2 py-0.5 text-xs text-[#0260FF] outline-none cursor-pointer"
            >
              <option value="admin">Admin (Full Access)</option>
              <option value="user">User / Student (Restricted)</option>
            </select>
          </div>

          <span className="text-[15px] text-[#4a4a4a]">Hi! <span className="font-medium">{currentRole === 'admin' ? 'Admin Richard' : 'User Richard'}</span></span>
          <div className="w-[45px] h-[45px] rounded-full bg-[#EBF7FF] flex items-center justify-center shadow-sm">
            <UserIcon />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-[#fafafa]">
          <Outlet />
        </main>
      </div>

      {/* Dashboard footer */}
      <footer className="border-t border-[rgba(37,37,37,0.15)] py-4 px-8 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 bg-white">
        <Link to="/" className="flex items-center gap-3">
          <LogoMark />
          <span className="text-xl font-semibold text-black">Edemy</span>
        </Link>
        <p className="text-[16px] text-[#797484]">All right reserved. Copyright @Edemy</p>
        <div className="flex gap-3">
          <SocialIcon type="facebook" />
          <SocialIcon type="twitter" />
          <SocialIcon type="instagram" />
        </div>
      </footer>
    </div>
  )
}
