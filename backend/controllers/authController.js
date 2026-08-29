import User from '../models/User.js'
import AppError from '../utils/appError.js'
import { createSendToken } from '../utils/createToken.js'
import crypto from 'crypto'
import { sendEmail } from '../utils/email.js'

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(new AppError('Email is already registered', 400))
    }

    // Generate random 32-character hex token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const tokenExpires = new Date()
    tokenExpires.setHours(tokenExpires.getHours() + 24)

    const newUser = await User.create({
      name,
      email,
      password,
      role: 'student', // Security: strictly hardcode to 'student'
      verificationToken,
      tokenExpires,
    })

    // Send verification email
    const verificationLink = `http://localhost:5000/api/auth/verify?token=${verificationToken}`
    await sendEmail({
      to: email,
      subject: 'Verify your LMS Talentraa account',
      text: `Welcome to LMS Talentraa!\n\nPlease verify your email by clicking the link below:\n${verificationLink}\n\nThis link expires in 24 hours.`,
      html: `<h2>Welcome to LMS Talentraa!</h2><p>Please verify your email by clicking the link below:</p><a href="${verificationLink}">Verify Email</a><p>This link expires in 24 hours.</p>`
    }).catch(err => console.log('Failed to send email:', err))

    res.status(201).json({
      status: 'success',
      message: 'Signup successful! Please check your email to verify your account before logging in.',
    })
  } catch (error) {
    next(error)
  }
}

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query

    if (!token) {
      return next(new AppError('Token is missing', 400))
    }

    const user = await User.findOne({
      verificationToken: token,
      tokenExpires: { $gt: Date.now() }
    })

    if (!user) {
      return next(new AppError('Invalid or expired verification token.', 400))
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.tokenExpires = undefined
    await user.save({ validateBeforeSave: false })

    // Redirect to frontend login page
    res.redirect('http://localhost:5173/login?verified=true')
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

    if (!user.isVerified) {
      return next(new AppError('Please verify your email address before logging in.', 403))
    }

    createSendToken(user, 200, res)
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('enrolledCourses')
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
