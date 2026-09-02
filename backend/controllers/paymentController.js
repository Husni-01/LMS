import Stripe from 'stripe'
import Course from '../models/Course.js'
import User from '../models/User.js'
import AppError from '../utils/appError.js'
import dotenv from 'dotenv'

dotenv.config()

// Mock data fallback if MongoDB is not reachable
const defaultCourses = [
  { id: 1, _id: '65c8f1e2a9b1c2d3e4f5a101', title: 'Build Text to image SaaS App in React JS', price: 10.99 },
  { id: 2, _id: '65c8f1e2a9b1c2d3e4f5a102', title: 'Build AI BG Removal SaaS App in React JS', price: 10.99 },
  { id: 3, _id: '65c8f1e2a9b1c2d3e4f5a103', title: 'React Router Complete Course in One Video', price: 10.99 },
  { id: 4, _id: '65c8f1e2a9b1c2d3e4f5a104', title: 'Build Full Stack E-Commerce App in React JS', price: 10.99 },
]

export const createCheckoutSession = async (req, res, next) => {
  try {
    const { courseId } = req.body
    
    if (!courseId) {
      return next(new AppError('Course ID is required', 400))
    }

    // 1. Find the course
    let course = null
    try {
      course = await Course.findById(courseId)
    } catch (e) {
      // ignore
    }
    
    if (!course) {
      course = defaultCourses.find(c => String(c._id) === String(courseId) || String(c.id) === String(courseId))
    }

    if (!course) {
      return next(new AppError('Course not found', 404))
    }

    // Convert price to cents (assuming USD)
    const priceAmount = course.price ? Math.round(Number(course.price) * 100) : 1099
    
    const successUrl = `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}`
    const cancelUrl = `http://localhost:5173/payment-cancel?course_id=${courseId}`

    // 2. Check if Stripe Secret Key is provided
    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: req.user?.email,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: course.title,
                description: course.subtitle || course.description || 'Full lifetime access to this course',
                // Course thumbnail shown on Stripe checkout page
                ...(course.thumbnail && { images: [course.thumbnail] }),
              },
              unit_amount: priceAmount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        metadata: {
          courseId: String(courseId),
          userId: req.user ? String(req.user._id) : 'guest'
        }
      })

      return res.status(200).json({
        status: 'success',
        url: session.url
      })
    } else {
      // 3. Simulated Checkout Fallback
      // If no Stripe keys, we simulate a successful redirect immediately
      // In a real scenario you might show a mock checkout page, but redirecting to success is easiest for testing
      const fakeSessionId = 'simulated_sess_' + Date.now()
      const mockSuccessUrl = `http://localhost:5173/payment-success?session_id=${fakeSessionId}&course_id=${courseId}&mock=true`
      
      return res.status(200).json({
        status: 'success',
        url: mockSuccessUrl,
        message: 'Stripe keys not found. Using simulated checkout mode.'
      })
    }
  } catch (error) {
    next(error)
  }
}

export const enrollAfterPayment = async (req, res, next) => {
  try {
    const { courseId, sessionId } = req.body

    if (!courseId) {
      return next(new AppError('Course ID is required for enrollment', 400))
    }

    if (!req.user) {
      return next(new AppError('You must be logged in to enroll', 401))
    }

    // Verify the course actually exists in DB
    let courseExists = false
    try {
      const course = await Course.findById(courseId).select('_id')
      courseExists = !!course
    } catch (e) { /* invalid ObjectId format */ }

    if (!courseExists) {
      return next(new AppError('Course not found', 404))
    }

    // $addToSet prevents duplicate enrollments automatically
    await User.findByIdAndUpdate(
      req.user._id || req.user.id,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    )

    res.status(200).json({
      status: 'success',
      message: 'Successfully enrolled in course'
    })
  } catch (error) {
    next(error)
  }
}
