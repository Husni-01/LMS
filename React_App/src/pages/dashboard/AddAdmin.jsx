import { useState } from 'react'
import { authService } from '../../services/api'
import { isAdmin } from '../../utils/auth'

export default function AddAdmin() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'educator',
  })
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  
  // Extra safety check on the frontend, even though backend secures this route
  const admin = isAdmin()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)

    try {
      const res = await authService.addAdmin(formData)
      setFeedback({ type: 'success', text: res.data.message })
      setFormData({ name: '', email: '', password: '', role: 'educator' })
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to create user' })
    } finally {
      setLoading(false)
    }
  }

  if (!admin) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Access Denied. Only administrators can view this page.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 font-['Outfit',sans-serif] max-w-2xl">
      <div className="mb-6">
        <h2 className="text-[20px] font-semibold text-[#1f2937]">Add Admin / Educator</h2>
        <p className="text-[13px] text-gray-500 mt-1">
          Securely create new accounts with elevated privileges.
        </p>
      </div>

      {feedback && (
        <div className={`p-4 mb-6 rounded-md text-sm ${feedback.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {feedback.text}
        </div>
      )}

      <div className="bg-white border border-[rgba(37,37,37,0.2)] rounded-md p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Admin Name"
              className="w-full border border-[rgba(37,37,37,0.2)] rounded-md px-4 py-2 outline-none focus:border-[#0260FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="w-full border border-[rgba(37,37,37,0.2)] rounded-md px-4 py-2 outline-none focus:border-[#0260FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Temporary Password</label>
            <input
              type="password"
              name="password"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-[rgba(37,37,37,0.2)] rounded-md px-4 py-2 outline-none focus:border-[#0260FF]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role Assignment</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-[14px] text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="educator"
                  checked={formData.role === 'educator'}
                  onChange={handleChange}
                  className="accent-[#0260FF]"
                />
                Educator (Can manage their own courses)
              </label>
              <label className="flex items-center gap-2 text-[14px] text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                  className="accent-[#0260FF]"
                />
                Admin (Full system access)
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[rgba(37,37,37,0.1)]">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#0260FF] text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
