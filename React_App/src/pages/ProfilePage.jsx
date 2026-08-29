import { useState, useEffect } from 'react'
import { getCurrentUser } from '../utils/auth'
import { authService } from '../services/api'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const [user, setUser] = useState(getCurrentUser())
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    setEditForm({ name: user.name || '', email: user.email || '' })
  }, [user, navigate])

  const handleEditProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)
    try {
      const res = await authService.updateProfile({ name: editForm.name, email: editForm.email })
      const updatedUser = res.data.data.user
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      setFeedback({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setIsEditing(false), 1500)
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' })
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-['Outfit',sans-serif]">
      <h1 className="text-3xl font-bold text-[#0e0e0e] mb-8">My Profile</h1>

      <div className="bg-white border border-[rgba(37,37,37,0.15)] rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          <div className="shrink-0 flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-blue-50 text-[#0260FF] text-4xl font-bold flex items-center justify-center border-4 border-white shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {user.role}
            </span>
          </div>

          <div className="flex-1 w-full">
            {!isEditing ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                  <p className="text-xl font-semibold text-[#0e0e0e]">{user.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                  <p className="text-lg text-gray-700">{user.email}</p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white border border-[#0260FF] text-[#0260FF] font-medium px-6 py-2.5 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEditProfile} className="space-y-5">
                {feedback && (
                  <div className={`p-3 rounded text-sm ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {feedback.text}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-[#0260FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 outline-none focus:border-[#0260FF]"
                    required
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#0260FF] text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      setFeedback(null)
                    }}
                    disabled={saving}
                    className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-md font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
