import AppError from './appError.js'

export const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

export const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : ''
  const message = `Duplicate field value: ${value}. Please use another value!`
  return new AppError(message, 400)
}

export const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

export const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401)

export const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401)

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  let error = { ...err }
  error.message = err.message
  error.name = err.name

  if (error.name === 'CastError') error = handleCastErrorDB(error)
  if (error.code === 11000) error = handleDuplicateFieldsDB(error)
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error)
  if (error.name === 'JsonWebTokenError') error = handleJWTError()
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError()

  res.status(error.statusCode || 500).json({
    status: error.status || 'error',
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
