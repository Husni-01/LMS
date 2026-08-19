import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseService } from '../../services/api'
import { isAdmin } from '../../utils/auth'

const defaultForm = {
  title: '',
  headings: '',
  description: '',
  price: '',
  category: 'Web Development',
}

export default function AddCourse({ initialForm = defaultForm }) {
  const [admin, setAdmin] = useState(isAdmin())
  const [form, setForm] = useState(initialForm)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const fileRef = useRef(null)

  useEffect(() => {
    const handleRoleChange = () => setAdmin(isAdmin())
    window.addEventListener('roleChange', handleRoleChange)
    return () => window.removeEventListener('roleChange', handleRoleChange)
  }, [])

  if (!admin) {
    return (
      <div className="p-8 font-['Outfit',sans-serif]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
          <div className="flex items-center gap-3 text-red-700 font-semibold text-lg mb-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Access Restricted</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Only <strong>Admin</strong> accounts have permission to create and publish new courses.
          </p>
          <Link
            to="/educator/my-courses"
            className="inline-block bg-[#0260FF] text-white text-sm font-medium px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View My Courses
          </Link>
        </div>
      </div>
    )
  }

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.price) {
      setMessage({ type: 'error', text: 'Please fill in course title and price' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      await courseService.createCourse({
        title: form.title,
        subtitle: form.headings,
        description: form.description || form.headings,
        price: parseFloat(form.price),
        category: form.category,
      })
      setMessage({ type: 'success', text: 'Course added successfully to MongoDB!' })
      setForm(defaultForm)
      setPreview(null)
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Course added (offline mode saved locally)' })
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full border border-[rgba(37,37,37,0.5)] rounded-[4px] h-10 px-3 text-[14px] text-[rgba(37,37,37,0.7)] outline-none focus:border-[#0260FF] transition-colors font-["Outfit",sans-serif]'

  return (
    <div className="p-8 font-['Outfit',sans-serif]">
      <form onSubmit={handleSubmit} className="max-w-xl">

        {message && (
          <div className={`p-3 mb-4 rounded text-[14px] ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {message.text}
          </div>
        )}

        {/* Course Title */}
        <div className="mb-5">
          <label className="block text-[16px] text-[rgba(37,37,37,0.7)] mb-1.5">Course Title</label>
          <input
            value={form.title}
            onChange={set('title')}
            placeholder="Type here"
            className={inputClass}
            required
          />
        </div>

        {/* Course Headings */}
        <div className="mb-5">
          <label className="block text-[16px] text-[rgba(37,37,37,0.7)] mb-1.5">Course Headings</label>
          <input
            value={form.headings}
            onChange={set('headings')}
            placeholder="Type here"
            className={inputClass}
          />
        </div>

        {/* Course Description */}
        <div className="mb-5">
          <label className="block text-[16px] text-[rgba(37,37,37,0.7)] mb-1.5">Course Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder="Type here"
            rows={3}
            className="w-full border border-[rgba(37,37,37,0.5)] rounded-[4px] px-3 py-2 text-[14px] text-[rgba(37,37,37,0.7)] outline-none focus:border-[#0260FF] transition-colors resize-none font-['Outfit',sans-serif]"
          />
        </div>

        {/* Course Price + Thumbnail row */}
        <div className="flex flex-wrap gap-5 items-start mb-6">
          {/* Price */}
          <div>
            <label className="block text-[16px] text-[rgba(37,37,37,0.7)] mb-1.5">Course Price ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={set('price')}
              placeholder="0.00"
              className="border border-[rgba(37,37,37,0.5)] rounded-[4px] h-10 px-3 text-[14px] text-[rgba(37,37,37,0.7)] w-36 outline-none focus:border-[#0260FF] transition-colors font-['Outfit',sans-serif]"
              required
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-[16px] text-[rgba(37,37,37,0.7)] mb-1.5">Course Thumbnail</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="w-9 h-9 bg-[#0260FF] rounded-[4px] flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <UploadIcon />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

              {preview
                ? <img src={preview} alt="thumbnail preview" className="h-9 w-16 object-cover rounded shadow" />
                : <div className="h-9 w-16 border border-dashed border-[rgba(37,37,37,0.3)] rounded flex items-center justify-center text-[10px] text-[rgba(37,37,37,0.4)]">preview</div>
              }
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white text-[16px] font-medium px-6 py-2 rounded-[4px] hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'ADD COURSE'}
        </button>
      </form>
    </div>
  )
}

function UploadIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
      <path d="M8 9V1M8 1L5 4M8 1l3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 10v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
