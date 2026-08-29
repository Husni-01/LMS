import { Link, useSearchParams } from 'react-router-dom'

export default function PaymentCancel() {
  const [searchParams] = useSearchParams()
  const courseId = searchParams.get('course_id')

  return (
    <div className="min-h-[70vh] flex items-center justify-center font-['Outfit',sans-serif] px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-[rgba(37,37,37,0.1)] max-w-md w-full text-center animate-fade-in">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-[#0e0e0e] mb-2">Payment Cancelled</h2>
        <p className="text-[#4a4a4a] text-[15px] mb-8 leading-relaxed">
          Your payment was unsuccessful or was cancelled. Your account has not been charged.
        </p>
        
        <div className="flex flex-col gap-3">
          {courseId && (
            <Link 
              to={`/course/${courseId}`}
              className="w-full bg-[#0260FF] text-white font-medium py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </Link>
          )}
          <Link 
            to="/courses"
            className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            Browse Other Courses
          </Link>
        </div>
      </div>
    </div>
  )
}
