import express from 'express'
import { register, login, getMe, updateMe, addAdmin, verifyEmail } from '../controllers/authController.js'
import { protect, restrictTo } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/verify', verifyEmail)
router.get('/me', protect, getMe)
router.patch('/updateMe', protect, updateMe)
router.post('/add-admin', protect, restrictTo('admin'), addAdmin)

export default router
