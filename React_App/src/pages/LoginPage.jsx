import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import { setUserRole } from '../utils/auth'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const res = await authService.login({
          email: formData.email,
          password: formData.password,
        })
        const token = res.data.token
        const user = res.data.data.user
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setUserRole(user.role)
        
        navigate('/')
      } else {
        const res = await authService.register(formData)
        const token = res.data.token
        const user = res.data.data.user
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setUserRole(user.role)
        
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center font-['Outfit',sans-serif] px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-[rgba(37,37,37,0.1)] max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <LogoMark />
          </Link>
          <h1 className="text-2xl font-bold text-[#0e0e0e]">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-[#4a4a4a] text-[15px] mt-2">
            {isLogin ? 'Please enter your details to sign in.' : 'Join us and start learning today.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 text-[14px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-[14px] font-medium text-[#252525] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border border-[rgba(37,37,37,0.2)] rounded-md px-4 py-2.5 text-[15px] outline-none focus:border-[#0260FF] transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[14px] font-medium text-[#252525] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border border-[rgba(37,37,37,0.2)] rounded-md px-4 py-2.5 text-[15px] outline-none focus:border-[#0260FF] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium text-[#252525] mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-[rgba(37,37,37,0.2)] rounded-md px-4 py-2.5 text-[15px] outline-none focus:border-[#0260FF] transition-colors"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-[14px] font-medium text-[#252525] mb-1.5">
                I want to:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-[15px] text-[#4a4a4a] cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={handleChange}
                    className="accent-[#0260FF]"
                  />
                  Learn (Student)
                </label>
                <label className="flex items-center gap-2 text-[15px] text-[#4a4a4a] cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={handleChange}
                    className="accent-[#0260FF]"
                  />
                  Teach (Educator)
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0260FF] text-white font-medium py-3 rounded-md mt-2 hover:bg-blue-700 transition-colors disabled:opacity-70"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center text-[15px] text-[#4a4a4a]">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
            className="text-[#0260FF] font-medium hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  )
}

function LogoMark() {
  return (
    <svg width="40" height="40" viewBox="0 0 34 34" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 0C7.611 0 0 7.611 0 17s7.611 17 17 17 17-7.611 17-17S26.389 0 17 0zm-3 9l10 8-10 8V9z"
        fill="#0260FF"
      />
    </svg>
  )
}
