import { useEffect, useState, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { paymentService } from '../services/api'

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams()
  const courseId = searchParams.get('course_id')
  const sessionId = searchParams.get('session_id')
  
  const [status, setStatus] = useState('processing') // processing, success, error
  const [errorMsg, setErrorMsg] = useState('')
  const enrolledRef = useRef(false)

  useEffect(() => {
    // Prevent double enrollment calls in React Strict Mode
    if (enrolledRef.current) return
    if (!courseId || !sessionId) {
      setStatus('error')
      setErrorMsg('Missing required payment information.')
      return
    }

    enrolledRef.current = true

    paymentService.enrollAfterPayment({ courseId, sessionId })
      .then(() => {
        setStatus('success')
        // Option to refresh local user data if stored in context/localstorage
      })
      .catch((err) => {
        setStatus('error')
        setErrorMsg(err.response?.data?.message || 'Failed to complete enrollment. Please contact support.')
      })
  }, [courseId, sessionId])

  return (
    <div className="min-h-[70vh] flex items-center justify-center font-['Outfit',sans-serif] px-4">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-[rgba(37,37,37,0.1)] max-w-md w-full text-center">
        {status === 'processing' && (
          <div>
            <div className="w-16 h-16 border-4 border-blue-100 border-t-[#0260FF] rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-[#0e0e0e] mb-2">Processing Payment...</h2>
            <p className="text-[#4a4a4a] text-[15px]">Please do not close this window.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-fade-in">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0e0e0e] mb-2">Payment Successful!</h2>
            <p className="text-[#4a4a4a] text-[15px] mb-8">
              Thank you for your purchase. You now have full access to this course.
            </p>
            <Link 
              to="/educator" // or wherever student dashboard is
              className="inline-block w-full bg-[#0260FF] text-white font-medium py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-fade-in">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0e0e0e] mb-2">Enrollment Issue</h2>
            <p className="text-[#4a4a4a] text-[15px] mb-8">
              {errorMsg}
            </p>
            <Link 
              to="/"
              className="inline-block w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
