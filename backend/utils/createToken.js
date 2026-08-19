import jwt from 'jsonwebtoken'

export const signToken = (id, role = 'student') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  })
}

export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.role)

  // Remove password from output object
  const userObj = user.toObject ? user.toObject() : { ...user }
  delete userObj.password

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: userObj,
    },
  })
}
