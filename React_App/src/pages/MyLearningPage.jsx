import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import { getCurrentUser } from '../utils/auth'

export default function MyLearningPage() {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const user = getCurrentUser()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    authService.getMe()
      .then((res) => {
        const courses = res.data?.data?.user?.enrolledCourses || []
        setEnrolledCourses(courses)
      })
      .catch((err) => {
        setError('Could not load your courses. Please try again.')
        console.warn('Failed to fetch enrolled courses:', err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12 py-10 font-['Outfit',sans-serif]">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[13px] text-[#0260FF] mb-1">
          <Link to="/">Home</Link> / <span className="text-[rgba(37,37,37,0.5)]">My Learning</span>
        </p>
        <h1 className="text-2xl font-bold text-[#0e0e0e]">My Enrolled Courses</h1>
        <p className="text-[14px] text-[rgba(37,37,37,0.6)] mt-1">
          All courses you have purchased and enrolled in.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-[#0260FF] rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-4 py-3 text-[14px]">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && enrolledCourses.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0260FF" strokeWidth="2" strokeLinecap="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <h2 className="text-[18px] font-semibold text-[#0e0e0e] mb-2">No courses yet</h2>
          <p className="text-[14px] text-[rgba(37,37,37,0.6)] mb-6">
            You haven't enrolled in any courses yet. Browse and enroll to get started!
          </p>
          <Link
            to="/courses"
            className="inline-block bg-[#0260FF] text-white font-medium px-6 py-2.5 rounded-md hover:bg-blue-700 transition-colors text-[15px]"
          >
            Browse Courses
          </Link>
        </div>
      )}

      {/* Course grid */}
      {!loading && enrolledCourses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrolledCourses.map((course) => {
            const id = course._id || course.id || course
            const title = course.title || 'Enrolled Course'
            const instructor = course.instructor || 'Instructor'
            const thumbnail = course.thumbnail || null

            return (
              <div
                key={String(id)}
                onClick={() => navigate(`/course/${id}`)}
                className="bg-white rounded-xl border border-[rgba(37,37,37,0.12)] overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                {/* Thumbnail */}
                <div className="h-[140px] bg-gradient-to-br from-slate-800 to-purple-700 relative overflow-hidden">
                  {thumbnail ? (
                    <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-end p-3">
                      <p className="text-white text-[11px] font-bold leading-tight line-clamp-2">{title}</p>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    ENROLLED
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-[14px] font-medium text-[#0e0e0e] line-clamp-2 mb-1">{title}</h3>
                  <p className="text-[12px] text-[rgba(37,37,37,0.6)]">{instructor}</p>

                  {/* Progress bar placeholder */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-[rgba(37,37,37,0.5)] mb-1">
                      <span>Progress</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full">
                      <div className="h-1.5 bg-[#0260FF] rounded-full" style={{ width: '0%' }} />
                    </div>
                  </div>

                  <button className="mt-3 w-full text-center text-[13px] text-[#0260FF] font-medium border border-[#0260FF] rounded py-1.5 hover:bg-blue-50 transition-colors">
                    Continue Learning →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
