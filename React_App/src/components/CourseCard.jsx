import { useNavigate } from 'react-router-dom'

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

export default function CourseCard({ course = defaultCourse }) {
  const navigate = useNavigate()
  const { id, _id, title, instructor, rating, reviewCount, price, image, badge } = course
  const courseId = _id || id

  return (
    <div
      className="bg-white rounded-lg border border-[rgba(37,37,37,0.12)] overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/course/${courseId}`)}
    >
      {/* Thumbnail */}
      <div className="relative h-[140px] bg-gradient-to-br from-slate-800 to-slate-600 overflow-hidden">
        {image
          ? <img src={image} alt={title} className="w-full h-full object-cover" />
          : <PlaceholderThumb title={title} />
        }
        {badge && (
          <span className="absolute top-2 left-2 bg-[#0260FF] text-white text-[10px] font-semibold px-2 py-0.5 rounded">
            {badge}
          </span>
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
        <p className="text-[14px] font-semibold text-[#0e0e0e] font-['Outfit',sans-serif]">{price}</p>
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
