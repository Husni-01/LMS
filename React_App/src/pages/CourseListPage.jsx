import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import CourseCard from '../components/CourseCard'
import { courseService } from '../services/api'

export default function CourseListPage({ pageSize = 8 }) {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('search') || ''

  const [search, setSearch] = useState(initialQuery)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(pageSize)

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
              <CourseCard key={course._id || course.id} course={course} />
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

          {filtered.length === 0 && (
            <p className="text-center text-[rgba(37,37,37,0.5)] py-20 text-[16px]">No courses found for "{search}"</p>
          )}
        </>
      )}
    </div>
  )
}
