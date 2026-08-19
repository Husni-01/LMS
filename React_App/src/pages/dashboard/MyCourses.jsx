import { useState, useEffect } from 'react'
import Toggle from '../../components/Toggle'
import { courseService } from '../../services/api'
import { isAdmin } from '../../utils/auth'

const mockCourses = [
  { id: 1, title: 'Build Text to image SaaS App in React JS', earnings: 150, students: 25, isLive: true, category: 'Web Development' },
  { id: 2, title: 'Build AI BG Removal SaaS App in React JS', earnings: 100, students: 28, isLive: false, category: 'AI Apps' },
  { id: 3, title: 'React Router Complete Course in One Video', earnings: 50, students: 22, isLive: true, category: 'Frontend' },
  { id: 4, title: 'Build Full Stack E-Commerce App in React JS', earnings: 200, students: 8, isLive: true, category: 'Full Stack' },
  { id: 5, title: 'Advanced Node.js & Express Architecture', earnings: 250, students: 15, isLive: true, category: 'Backend' },
]

export default function MyCourses() {
  const [courses, setCourses] = useState(mockCourses)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(isAdmin())
  const [editingCourse, setEditingCourse] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', earnings: '', category: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    const handleRoleChange = () => setAdmin(isAdmin())
    window.addEventListener('roleChange', handleRoleChange)
    return () => window.removeEventListener('roleChange', handleRoleChange)
  }, [])

  const fetchCourses = () => {
    setLoading(true)
    courseService.getEducatorCourses()
      .then((res) => {
        const fetched = res.data?.data?.courses
        if (fetched && fetched.length > 0) {
          setCourses(fetched.map((c) => ({
            id: c._id || c.id,
            title: c.title,
            earnings: c.earnings || (c.price ? c.price * 10 : 150),
            students: c.studentCount || c.enrolledStudentsCount || c.students || 20,
            isLive: c.isLive !== undefined ? c.isLive : true,
            category: c.category || 'Development',
            description: c.description || c.subtitle || '',
          })))
        }
      })
      .catch((err) => {
        console.warn('Backend Educator courses fetch note:', err.message)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleToggle = async (id, isLive) => {
    if (!admin) return
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, isLive } : c)))
    try {
      await courseService.updateCourse(id, { isLive })
    } catch (err) {
      console.warn('Could not persist toggle status:', err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!admin) return
    if (!window.confirm('Are you sure you want to delete this course?')) return

    try {
      await courseService.deleteCourse(id)
      setCourses((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete course.')
    }
  }

  const openEditModal = (course) => {
    if (!admin) return
    setEditingCourse(course)
    setEditForm({
      title: course.title,
      earnings: course.earnings,
      category: course.category,
      description: course.description,
    })
    setFeedback(null)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingCourse) return
    setSaving(true)
    setFeedback(null)

    try {
      await courseService.updateCourse(editingCourse.id, {
        title: editForm.title,
        earnings: Number(editForm.earnings),
        category: editForm.category,
        description: editForm.description,
      })

      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingCourse.id
            ? {
                ...c,
                title: editForm.title,
                earnings: Number(editForm.earnings),
                category: editForm.category,
                description: editForm.description,
              }
            : c
        )
      )
      setFeedback({ type: 'success', text: 'Course updated successfully!' })
      setTimeout(() => {
        setEditingCourse(null)
      }, 1000)
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Updated locally' })
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingCourse.id
            ? {
                ...c,
                title: editForm.title,
                earnings: Number(editForm.earnings),
                category: editForm.category,
                description: editForm.description,
              }
            : c
        )
      )
      setTimeout(() => {
        setEditingCourse(null)
      }, 1200)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 font-['Outfit',sans-serif]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-[20px] font-semibold text-[#1f2937]">My Courses</h2>
          <p className="text-[13px] text-gray-500">
            {admin ? 'Admin Mode: You have full permissions to edit course info and toggle status.' : 'User Mode: View-only access.'}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 py-6">Loading educator courses...</p>
      ) : (
        <div className="border border-[rgba(37,37,37,0.2)] rounded-md overflow-hidden bg-white shadow-sm">
          {/* Header */}
          <div className={`grid ${admin ? 'grid-cols-[2fr_100px_90px_130px_100px]' : 'grid-cols-[2fr_120px_100px_160px]'} items-center bg-[#f8fafc] border-b border-[rgba(37,37,37,0.15)] px-4 py-3`}>
            <span className="text-[14px] font-semibold text-[#252525]">All Courses</span>
            <span className="text-[14px] font-semibold text-[#252525]">Earnings</span>
            <span className="text-[14px] font-semibold text-[#252525]">Students</span>
            <span className="text-[14px] font-semibold text-[#252525]">Course Status</span>
            {admin && <span className="text-[14px] font-semibold text-[#252525] text-right">Actions</span>}
          </div>

          {courses.map((course, i) => (
            <div
              key={course.id}
              className={`grid ${admin ? 'grid-cols-[2fr_100px_90px_130px_100px]' : 'grid-cols-[2fr_120px_100px_160px]'} items-center px-4 py-3.5 border-b border-[rgba(37,37,37,0.1)] last:border-0 hover:bg-slate-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}
            >
              {/* Course name + thumbnail */}
              <div className="flex items-center gap-3 pr-4">
                <CourseThumbnail title={course.title} />
                <div>
                  <span className="text-[14px] text-[#1e293b] font-medium line-clamp-1">{course.title}</span>
                  {course.category && (
                    <span className="inline-block text-[11px] text-[#0260FF] bg-[#ebf7ff] px-2 py-0.5 rounded mt-0.5">
                      {course.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Earnings */}
              <span className="text-[14px] text-[rgba(37,37,37,0.7)] font-medium">${course.earnings}</span>

              {/* Students */}
              <span className="text-[14px] text-[rgba(37,37,37,0.7)]">{course.students}</span>

              {/* Status toggle */}
              <div className="flex items-center">
                <Toggle
                  initialValue={course.isLive}
                  onChange={(v) => handleToggle(course.id, v)}
                  disabled={!admin}
                />
              </div>

              {/* Admin Actions */}
              {admin && (
                <div className="text-right flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditModal(course)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#0260FF] bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Course Modal for Admin */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => setEditingCourse(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0260FF] flex items-center justify-center font-bold">
                ✎
              </div>
              <h3 className="text-lg font-bold text-gray-900">Edit Course Information</h3>
            </div>

            {feedback && (
              <div className={`p-3 mb-4 rounded text-sm ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#0260FF]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Earnings ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.earnings}
                    onChange={(e) => setEditForm((f) => ({ ...f, earnings: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#0260FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#0260FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description / Subtitle</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#0260FF] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#0260FF] text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function CourseThumbnail({ title }) {
  return (
    <div className="w-16 h-9 rounded bg-gradient-to-br from-slate-700 to-purple-600 flex items-end p-1 shrink-0 shadow overflow-hidden">
      <span className="text-white text-[7px] font-bold leading-tight line-clamp-1">{title || 'Course'}</span>
    </div>
  )
}
