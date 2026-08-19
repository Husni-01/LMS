import express from 'express'
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getEducatorCourses,
} from '../controllers/courseController.js'
import { protect, restrictTo } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', getAllCourses)
router.get('/educator/my-courses', protect, restrictTo('educator', 'admin'), getEducatorCourses)
router.get('/:id', getCourse)

// Only Admin has access to add, update, and delete courses
router.post('/', protect, restrictTo('admin'), createCourse)
router.patch('/:id', protect, restrictTo('admin'), updateCourse)
router.delete('/:id', protect, restrictTo('admin'), deleteCourse)

export default router
