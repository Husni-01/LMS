import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CourseCard from '../components/CourseCard'
import { courseService } from '../services/api'

const mockProps = {
  hero: {
    headline: 'Empower your future with the courses designed to',
    highlight: 'fit your choice.',
    subtext: 'We bring together world-class instructors, interactive content, and a supportive community to help you achieve your personal and professional goals.',
  },
  trustedBrands: ['Microsoft', 'Walmart', 'accenture', 'Adobe', 'PayPal'],
  testimonials: [
    { id: 1, name: 'Donald Jackman', role: 'SWE1 at Amazon', rating: 5, text: "I've been using Imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.", avatar: 'D' },
    { id: 2, name: 'Richard Nelson', role: 'SWE2 at Samsung', rating: 5, text: "I've been using Imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.", avatar: 'R' },
    { id: 3, name: 'James Washington', role: 'SWE3 at Google', rating: 5, text: "I've been using Imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.", avatar: 'J' },
  ],
  cta: {
    headline: 'Learn anything, anytime, anywhere',
    subtext: 'Incididunt sint fugiat pariatur cupidatat consectetur elit cillum anim id veniam aliqua proident excepteur commodo do ea.',
  },
}

export default function HomePage({ props = mockProps }) {
  const [search, setSearch] = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const { hero, trustedBrands, testimonials, cta } = props

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

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/courses?search=${encodeURIComponent(search)}`)
    } else {
      navigate('/courses')
    }
  }

  return (
    <div className="font-['Inter',sans-serif]">
      {/* ── Hero ── */}
      <section className="text-center py-20 px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0e0e0e] max-w-3xl mx-auto leading-tight mb-2">
          {hero.headline}{' '}
          <span className="text-[#0260FF] italic">{hero.highlight}</span>
        </h1>
        <p className="text-[16px] text-[rgba(37,37,37,0.7)] max-w-xl mx-auto mt-5 leading-relaxed">{hero.subtext}</p>

        {/* Search */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
          <div className="flex-1 flex items-center gap-2 border border-[rgba(37,37,37,0.25)] rounded-md px-4 py-2.5 bg-white">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="rgba(37,37,37,0.4)" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="rgba(37,37,37,0.4)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for courses"
              className="flex-1 outline-none text-[15px] text-[#252525] bg-transparent placeholder:text-[rgba(37,37,37,0.4)]"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-[#0260FF] text-white text-[15px] font-medium px-7 py-2.5 rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </section>

      {/* ── Trusted by ── */}
      <section className="py-10 px-6 border-y border-[rgba(37,37,37,0.08)]">
        <p className="text-center text-[14px] text-[rgba(37,37,37,0.5)] mb-8">Trusted by learners from</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {trustedBrands.map((brand) => (
            <span key={brand} className="text-[18px] font-semibold text-[rgba(37,37,37,0.55)]">{brand}</span>
          ))}
        </div>
      </section>

      {/* ── Featured courses ── */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0e0e0e] mb-3">Learn from the best</h2>
        <p className="text-center text-[15px] text-[rgba(37,37,37,0.6)] mb-10 max-w-lg mx-auto">
          Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.
        </p>

        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading featured courses...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {courses.slice(0, 4).map((course) => (
              <CourseCard key={course._id || course.id} course={course} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/courses')}
            className="border border-[rgba(37,37,37,0.3)] text-[15px] text-[#252525] px-8 py-2.5 rounded-md hover:bg-gray-50 transition-colors"
          >
            Show all courses
          </button>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 px-6 md:px-12 bg-[#fafafa]">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#0e0e0e] mb-3">Testimonials</h2>
        <p className="text-center text-[15px] text-[rgba(37,37,37,0.6)] mb-10 max-w-lg mx-auto">
          Hear from our learners as they share their journeys of transformation, success, and how our platform has made a difference in their lives.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0e0e0e] mb-4">{cta.headline}</h2>
        <p className="text-[15px] text-[rgba(37,37,37,0.6)] max-w-md mx-auto mb-8">{cta.subtext}</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate('/courses')}
            className="bg-[#0260FF] text-white text-[15px] font-medium px-7 py-2.5 rounded-md hover:bg-blue-700 transition-colors"
          >
            Get started
          </button>
        </div>
      </section>
    </div>
  )
}

function TestimonialCard({ testimonial }) {
  const { name, role, rating, text, avatar } = testimonial
  return (
    <div className="bg-white border border-[rgba(37,37,37,0.12)] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#0260FF] flex items-center justify-center text-white font-bold text-[16px]">
          {avatar}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#0e0e0e]">{name}</p>
          <p className="text-[12px] text-[rgba(37,37,37,0.5)]">{role}</p>
        </div>
      </div>
      <div className="flex gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 12 12" fill="none">
            <path d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.5l-2.6 1.4.5-2.9L1.8 4l2.9-.4L6 1z"
              fill={i <= rating ? '#f59e0b' : '#e5e7eb'} />
          </svg>
        ))}
      </div>
      <p className="text-[14px] text-[rgba(37,37,37,0.7)] leading-relaxed mb-4">{text}</p>
      <button className="text-[14px] text-[#0260FF] font-medium hover:underline">Read more</button>
    </div>
  )
}
