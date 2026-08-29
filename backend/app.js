import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/database.js'

import authRoutes from './routes/authRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

import AppError from './utils/appError.js'
import { globalErrorHandler } from './utils/errorTypes.js'

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()

import seedAdmin from './utils/seedAdmin.js'

// Connect to MongoDB Atlas
connectDB().then(() => {
  seedAdmin()
})

// Enable CORS & JSON parsing
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// System Health Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'LMS Talentraa Backend API is active and healthy',
    timestamp: new Date().toISOString(),
  })
})

// Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to LMS Talentraa API',
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      reviews: '/api/reviews',
    },
  })
})

// Mount API Routes
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/payment', paymentRoutes)

// Handle 404 Undefined Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

// Register Global Error Handler
app.use(globalErrorHandler)

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`[LMS Talentraa Backend] Server running on http://localhost:${PORT}`)
})

export default app
