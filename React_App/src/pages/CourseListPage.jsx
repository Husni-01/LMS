import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CourseCard from '../components/CourseCard'
import { courseService } from '../services/api'
import { isAdmin } from '../utils/auth'

export default function CourseListPage({ pageSize = 8 }) {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('search') || ''

  const [search, setSearch] = useState(initialQuery)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(pageSize)

  // Edit modal state (admin only)
  const [editingCourse, setEditingCourse] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', price: '', category: '', headings: '', description: '' })
  const [editThumbnail, setEditThumbnail] = useState(null)
  const [editPreview, setEditPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const editFileRef = useRef(null)

  useEffect(() => {
    courseService.getAllCourses()
      .then((res) => {
        const fetched = res.data?.data?.courses || []
        setCourses(fetched)
      })
      .catch((err) => {
        console.warn('Backend API connection note:', err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = courses.filter((c) =>
    (c.title || '').toLowerCase().includes(search.toLowerCase())
  )
  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  // ── Edit handlers ─────────────────────────────────────────────────────────
  const openEdit = (course) => {
    setEditingCourse(course)
    setEditForm({
      title: course.title || '',
      price: course.price || course.earnings || '',
      category: course.category || '',
      headings: course.subtitle || course.headings || '',
      description: course.description || '',
    })
    setEditThumbnail(null)
    setEditPreview(course.thumbnail || course.image || null)
    setFeedback(null)
  }

  const handleEditFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setEditPreview(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onload = (ev) => setEditThumbnail(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingCourse) return
    setSaving(true)
    setFeedback(null)
    const id = editingCourse._id || editingCourse.id
    const payload = {
      title: editForm.title,
      price: parseFloat(editForm.price) || 0,
      category: editForm.category,
      subtitle: editForm.headings,
      description: editForm.description,
      ...(editThumbnail && { thumbnail: editThumbnail }),
    }
    try {
      await courseService.updateCourse(id, payload)
      setCourses(prev => prev.map(c =>
        (c._id || c.id) === id
          ? { ...c, ...payload, thumbnail: editThumbnail || c.thumbnail }
          : c
      ))
      setFeedback({ type: 'success', text: 'Course updated!' })
      setTimeout(() => setEditingCourse(null), 900)
    } catch (err) {
      setCourses(prev => prev.map(c =>
        (c._id || c.id) === id
          ? { ...c, ...payload, thumbnail: editThumbnail || c.thumbnail }
          : c
      ))
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Saved locally' })
      setTimeout(() => setEditingCourse(null), 1200)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.title}"?`)) return
    const id = course._id || course.id
    try {
      await courseService.deleteCourse(id)
    } catch (_) {}
    setCourses(prev => prev.filter(c => (c._id || c.id) !== id))
    setEditingCourse(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 font-['Outfit',sans-serif]">
      {/* Breadcrumb + title */}
      <p className="text-[13px] text-[#0260FF] mb-1">
        <Link to="/">Home</Link> / <span className="text-[rgba(37,37,37,0.5)]">Course List</span>
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-[#0e0e0e]">Course List</h1>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 border border-[rgba(37,37,37,0.25)] rounded-md px-3 py-2 bg-white">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="rgba(37,37,37,0.4)" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="rgba(37,37,37,0.4)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for courses"
              className="outline-none text-[14px] text-[#252525] bg-transparent w-44 placeholder:text-[rgba(37,37,37,0.4)]"
            />
          </div>
          <button className="bg-[#0260FF] text-white text-[14px] font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-16 text-gray-500">Loading courses...</p>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visible.map((course) => (
              <CourseCard
                key={course._id || course.id}
                course={course}
                onEdit={isAdmin() ? openEdit : undefined}
              />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((n) => n + pageSize)}
                className="border border-[rgba(37,37,37,0.3)] text-[15px] text-[#252525] px-8 py-2.5 rounded-md hover:bg-gray-50 transition-colors"
              >
                Load more
              </button>
            </div>
          )}

          {visible.length === 0 && (
            <p className="text-center py-16 text-gray-400">No courses found.</p>
          )}
        </>
      )}

      {/* ── Quick Edit Modal (Admin only) ───────────────────────────────────── */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingCourse(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
            >✕</button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0260FF] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Edit Course</h3>
            </div>

            {feedback && (
              <div className={`p-3 mb-4 rounded text-sm ${feedback.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input type="text" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#0260FF]" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input type="number" min="0" step="0.01" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#0260FF]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#0260FF]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headings / Subtitle</label>
                <input type="text" value={editForm.headings} onChange={e => setEditForm(f => ({ ...f, headings: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#0260FF]" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#0260FF] resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => editFileRef.current.click()}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-[#0260FF] text-white rounded hover:bg-blue-700 transition-colors">
                    <svg width="13" height="13" viewBox="0 0 16 14" fill="none">
                      <path d="M8 9V1M8 1L5 4M8 1l3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M1 10v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {editThumbnail ? 'Change Image' : 'Upload Image'}
                  </button>
                  <input ref={editFileRef} type="file" accept="image/*" onChange={handleEditFile} className="hidden" />
                  {editPreview
                    ? <img src={editPreview} alt="preview" className="h-14 w-24 object-cover rounded shadow border" />
                    : <div className="h-14 w-24 border border-dashed border-gray-300 rounded flex items-center justify-center text-[10px] text-gray-400">No image</div>
                  }
                  {editThumbnail && <span className="text-xs text-green-600 font-medium">✓ New image ready</span>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {/* Danger: Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(editingCourse)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Delete Course
                </button>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditingCourse(null)}
                    className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={saving}
                    className="px-5 py-2 bg-[#0260FF] text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
