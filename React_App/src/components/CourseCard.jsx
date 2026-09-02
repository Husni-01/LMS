import { useNavigate } from 'react-router-dom'
import { isAdmin } from '../utils/auth'

const defaultCourse = {
  id: 1,
  title: 'Build Text to Image SaaS App in React JS',
  instructor: 'Richard James',
  rating: 4.5,
  reviewCount: 122,
  price: '$10.99',
  image: null,
  badge: 'BEST SELLER',
}

export default function CourseCard({ course = defaultCourse, onEdit }) {
  const navigate = useNavigate()
  const admin = isAdmin()
  const { id, _id, title, instructor, rating, reviewCount, price, image, thumbnail, badge } = course
  const courseId = _id || id
  // Backend stores as 'thumbnail'; fallback to 'image'
  const imgSrc = image || thumbnail || null
  // Always prefix $ if price is a raw number
  const displayPrice = price !== undefined && price !== null
    ? (typeof price === 'number' ? `$${price}` : String(price).startsWith('$') ? price : `$${price}`)
    : 'Free'

  const handleEdit = (e) => {
    e.stopPropagation()   // prevent navigating to course detail
    if (onEdit) {
      onEdit(course)      // parent-supplied handler (e.g. open modal)
    } else {
      navigate('/educator/my-courses')
    }
  }

  return (
    <div
      className="bg-white rounded-lg border border-[rgba(37,37,37,0.12)] overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative group"
      onClick={() => navigate(`/course/${courseId}`)}
    >
      {/* Thumbnail */}
      <div className="relative h-[140px] bg-gradient-to-br from-slate-800 to-slate-600 overflow-hidden">
        {imgSrc
          ? <img src={imgSrc} alt={title} className="w-full h-full object-cover" />
          : <PlaceholderThumb title={title} />
        }

        {/* Badge — bottom-left when admin pencil is showing, else top-left */}
        {badge && (
          <span className="absolute top-2 left-2 bg-[#0260FF] text-white text-[10px] font-semibold px-2 py-0.5 rounded z-10">
            {badge}
          </span>
        )}

        {/* ✏️ Admin edit pencil — top-right corner, shown on hover */}
        {admin && (
          <button
            onClick={handleEdit}
            title="Edit course"
            className="absolute top-2 right-2 z-20 w-7 h-7 bg-white/90 hover:bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0260FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-[14px] font-medium text-[#0e0e0e] leading-snug line-clamp-2 mb-1 font-['Outfit',sans-serif]">
          {title}
        </h3>
        <p className="text-[12px] text-[rgba(37,37,37,0.6)] mb-2 font-['Outfit',sans-serif]">{instructor}</p>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-[12px] font-semibold text-[#f59e0b]">{rating}</span>
          <StarRating rating={rating} />
          <span className="text-[12px] text-[rgba(37,37,37,0.5)]">({reviewCount})</span>
        </div>
        <p className="text-[14px] font-semibold text-[#0e0e0e] font-['Outfit',sans-serif]">{displayPrice}</p>
      </div>
    </div>
  )
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.5l-2.6 1.4.5-2.9L1.8 4l2.9-.4L6 1z"
            fill={i <= Math.round(rating) ? '#f59e0b' : '#e5e7eb'}
          />
        </svg>
      ))}
    </div>
  )
}

function PlaceholderThumb({ title }) {
  const colors = [
    ['#1a1a2e', '#e94560'],
    ['#0d3b66', '#ffd166'],
    ['#1b4332', '#40916c'],
    ['#3d0066', '#9d4edd'],
  ]
  const titleStr = title || 'Course'
  const [bg, accent] = colors[titleStr.length % colors.length]
  return (
    <div className="w-full h-full flex items-end p-3" style={{ background: `linear-gradient(135deg, ${bg}, ${accent})` }}>
      <p className="text-white text-[11px] font-bold leading-tight line-clamp-2">{titleStr}</p>
    </div>
  )
}
