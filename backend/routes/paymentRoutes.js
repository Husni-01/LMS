import express from 'express'
import { createCheckoutSession, enrollAfterPayment } from '../controllers/paymentController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/create-checkout-session', protect, createCheckoutSession)
router.post('/enroll', protect, enrollAfterPayment)

export default router
