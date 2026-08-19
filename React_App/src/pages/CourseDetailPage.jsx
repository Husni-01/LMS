import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { courseService } from '../services/api'

const mockCourse = {
  id: 1,
  title: 'Build Text to image SaaS App in React JS',
  subtitle: 'Master MERN Stack by building a Full Stack AI Text to Image SaaS App using React JS, MongoDB, Node.js, Express.js and Stripe Payment!',
  instructor: 'Richard James',
  rating: 4.5,
  reviewCount: 102,
  studentCount: 21,
  price: '$10.99',
  originalPrice: '$19.09',
  discount: '50% off',
  daysLeft: '5 days left at this price!',
  badge: 'FULL PACK',
  totalSections: 22,
  totalLectures: 34,
  totalDuration: '27h 25m',
  sections: [
    { id: 1, title: 'Project Introduction', lectures: 3, duration: '45 m', open: true,
      items: [
        { title: 'App Overview – Build Text-to-Image SaaS', duration: '10 mins' },
        { title: 'Tech Stack – React, Node.js, MongoDB', duration: '15 mins' },
        { title: 'Core Features – Authentication, payment, deployment', duration: '20 mins' },
      ]
    },
    { id: 2, title: 'Project Setup and configuration', lectures: 4, duration: '45 m', open: false, items: [
        { title: 'Environment Setup – Install Node.js, VS Code', duration: '10 mins' },
        { title: 'Repository Setup – Clone project repository', duration: '10 mins' },
        { title: 'Install Dependencies – Install npm packages', duration: '10 mins' },
        { title: 'Initial Configuration – Set up basic files and folders', duration: '15 mins' },
      ]
    },
  ],
  description: 'This is the most comprehensive and in depth JavaScript course with 30 JavaScript projects.\n\nJavaScript is currently the most popular programming language in the world. If you are an aspiring web developer or full stack developer, JavaScript is a must to learn. It also helps you to get high-paying jobs all over the world.',
  includes: [
    'Lifetime access with free updates.',
    'Step-by-step, hands-on project guidance.',
    'Downloadable resources and source code.',
    'Access to test your knowledge.',
    'Certificate of completion.',
    'Quizzes to test your knowledge.',
  ],
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const [course, setCourse] = useState(mockCourse)
  const [loading, setLoading] = useState(true)
  const [openSections, setOpenSections] = useState({})

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    courseService.getCourseById(id)
      .then((res) => {
        const fetched = res.data?.data?.course
        if (fetched) {
          setCourse({
            ...mockCourse,
            ...fetched,
            id: fetched._id || fetched.id,
            price: typeof fetched.price === 'number' ? `$${fetched.price}` : fetched.price,
            sections: fetched.sections || mockCourse.sections,
            includes: fetched.includes || mockCourse.includes,
          })
        }
      })
      .catch((err) => {
        console.warn('Backend detail API fetch fallback:', err.message)
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (course && course.sections) {
      setOpenSections(course.sections.reduce((acc, s) => ({ ...acc, [s.id || s.title]: !!s.open }), {}))
    }
  }, [course])

  const toggleSection = (secId) => setOpenSections((prev) => ({ ...prev, [secId]: !prev[secId] }))

  if (loading) return <div className="text-center py-20 text-gray-500 font-['Inter',sans-serif]">Loading course details...</div>

  const c = course || mockCourse

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 font-['Inter',sans-serif]">
      <p className="text-[13px] text-[#0260FF] mb-4">
        <Link to="/">Home</Link> / <Link to="/courses">Courses</Link> / <span className="text-[rgba(37,37,37,0.5)]">{c.title}</span>
      </p>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* ── Left: course content ── */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0e0e0e] leading-tight mb-3">{c.title}</h1>
          <p className="text-[15px] text-[rgba(37,37,37,0.7)] mb-4 leading-relaxed">{c.subtitle || c.description}</p>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[13px] font-semibold text-[#f59e0b]">{c.rating || 4.5}</span>
            <StarRow rating={c.rating || 4.5} />
            <span className="text-[13px] text-[rgba(37,37,37,0.5)]">({c.reviewCount || 102} ratings)</span>
            <span className="text-[13px] text-[rgba(37,37,37,0.5)]">{c.studentCount || 21} students</span>
          </div>
          <p className="text-[13px] text-[rgba(37,37,37,0.6)] mb-8">
            Course by <span className="text-[#0260FF] font-medium">{c.instructor || 'Richard James'}</span>
          </p>

          {/* Course structure */}
          <div className="mb-10">
            <h2 className="text-[18px] font-bold text-[#0e0e0e] mb-2">Course Structure</h2>
            <p className="text-[13px] text-[rgba(37,37,37,0.6)] mb-5">
              {c.totalSections || (c.sections ? c.sections.length : 2)} sections · {c.totalLectures || 34} lectures · {c.totalDuration || '27h 25m'} total duration
            </p>
            <div className="border border-[rgba(37,37,37,0.15)] rounded-lg overflow-hidden">
              {(c.sections || []).map((section, idx) => {
                const sId = section.id || section.title
                return (
                  <div key={sId} className={idx > 0 ? 'border-t border-[rgba(37,37,37,0.15)]' : ''}>
                    <button
                      onClick={() => toggleSection(sId)}
                      className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[rgba(37,37,37,0.5)]">{openSections[sId] ? '▾' : '▸'}</span>
                        <span className="text-[14px] font-medium text-[#0e0e0e]">{section.title}</span>
                      </div>
                      <span className="text-[13px] text-[rgba(37,37,37,0.5)] shrink-0">
                        {section.lectures || (section.items ? section.items.length : 0)} lectures · {section.duration || '45m'}
                      </span>
                    </button>
                    {openSections[sId] && section.items && section.items.length > 0 && (
                      <div className="border-t border-[rgba(37,37,37,0.1)] bg-[#fafafa]">
                        {section.items.map((item, itemIdx) => (
                          <div key={item.title || itemIdx} className="flex items-center justify-between px-10 py-3 border-b border-[rgba(37,37,37,0.07)] last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full border-2 border-[#0260FF] flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-[#0260FF]" />
                              </div>
                              <span className="text-[14px] text-[rgba(37,37,37,0.8)]">{item.title}</span>
                            </div>
                            <span className="text-[13px] text-[rgba(37,37,37,0.5)] shrink-0">{item.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-[18px] font-bold text-[#0e0e0e] mb-4">Course Description</h2>
            {(c.description || '').split('\n\n').map((para, i) => (
              <p key={i} className="text-[15px] text-[rgba(37,37,37,0.75)] leading-relaxed mb-3">{para}</p>
            ))}
          </div>
        </div>

        {/* ── Right: price card ── */}
        <div className="lg:w-[310px] shrink-0">
          <div className="border border-[rgba(37,37,37,0.2)] rounded-xl overflow-hidden shadow-sm sticky top-[90px]">
            <div className="h-[180px] bg-gradient-to-br from-slate-800 to-purple-700 flex items-end p-4">
              <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">{c.badge || 'FULL PACK'}</span>
            </div>

            <div className="p-5">
              <p className="text-[13px] text-[#e94560] font-semibold mb-1">⚡ {c.daysLeft || '5 days left at this price!'}</p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-[#0e0e0e]">{c.price}</span>
                <span className="text-[15px] text-[rgba(37,37,37,0.4)] line-through">{c.originalPrice || '$19.09'}</span>
                <span className="text-[14px] text-[#0260FF] font-medium">{c.discount || '50% off'}</span>
              </div>

              <button className="w-full bg-[#0260FF] text-white text-[15px] font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors mb-4">
                Enroll Now
              </button>

              <div>
                <h4 className="text-[14px] font-semibold text-[#0e0e0e] mb-3">What's in the course?</h4>
                <ul className="space-y-2">
                  {(c.includes || mockCourse.includes).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[13px] text-[rgba(37,37,37,0.7)]">
                      <span className="text-[#0260FF] mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 12 12" fill="none">
          <path d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.5l-2.6 1.4.5-2.9L1.8 4l2.9-.4L6 1z"
            fill={i <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'} />
        </svg>
      ))}
    </div>
  )
}
