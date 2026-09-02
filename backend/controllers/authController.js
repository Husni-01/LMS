import User from '../models/User.js'
import AppError from '../utils/appError.js'
import { createSendToken } from '../utils/createToken.js'

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(new AppError('Email is already registered', 400))
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: 'student', // Security: strictly hardcode to 'student'
    })

    // Log the user in immediately after registration
    createSendToken(newUser, 201, res)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400))
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401))
    }

    createSendToken(user, 200, res)
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'enrolledCourses',
      select: '_id title thumbnail instructor rating reviewCount price category subtitle',
    })
    res.status(200).json({
      status: 'success',
      data: { user },
    })
  } catch (error) {
    next(error)
  }
}

export const updateMe = async (req, res, next) => {
  try {
    // 1) Filter out unwanted fields that are not allowed to be updated
    const filteredBody = {}
    if (req.body.name) filteredBody.name = req.body.name
    if (req.body.email) filteredBody.email = req.body.email

    // 2) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    })
  } catch (error) {
    next(error)
  }
}

export const addAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    // Must explicitly request educator or admin role
    if (role !== 'admin' && role !== 'educator') {
      return next(new AppError('Invalid role specified', 400))
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(new AppError('Email is already registered', 400))
    }

    const newAdmin = await User.create({
      name,
      email,
      password,
      role: role
    })

    // Don't log them in (createSendToken), just return success
    res.status(201).json({
      status: 'success',
      message: `${role} account created successfully!`,
      data: {
        user: newAdmin
      }
    })
  } catch (error) {
    next(error)
  }
}
