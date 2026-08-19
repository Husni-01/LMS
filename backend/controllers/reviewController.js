import Review from '../models/Review.js'
import AppError from '../utils/appError.js'

export const getCourseReviews = async (req, res, next) => {
  try {
    const filter = { course: req.params.courseId }
    const reviews = await Review.find(filter)

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews },
    })
  } catch (error) {
    next(error)
  }
}

export const createReview = async (req, res, next) => {
  try {
    if (!req.body.course) req.body.course = req.params.courseId
    if (!req.body.user) req.body.user = req.user.id

    const newReview = await Review.create(req.body)

    res.status(201).json({
      status: 'success',
      data: { review: newReview },
    })
  } catch (error) {
    next(error)
  }
}

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)

    if (!review) {
      return next(new AppError('No review found with that ID', 404))
    }

    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (error) {
    next(error)
  }
}
