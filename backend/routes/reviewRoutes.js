import express from 'express'
import {
  getCourseReviews,
  createReview,
  deleteReview,
} from '../controllers/reviewController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/course/:courseId', getCourseReviews)
router.post('/course/:courseId', protect, createReview)
router.delete('/:id', protect, deleteReview)

export default router
