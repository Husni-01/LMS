import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { pepperPassword } from '../utils/crypto.js'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user must have a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'educator', 'admin'],
      default: 'student',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
      },
    ],
    // Verification fields
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    tokenExpires: Date,
  },
  {
    timestamps: true,
  }
)

// Hash password prior to saving
// Security pipeline: plaintext → HMAC-SHA256 pepper (AES secret) → bcrypt hash
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  // Step 1: Apply HMAC-SHA256 pepper using the AES-256 secret key
  const peppered = pepperPassword(this.password)

  // Step 2: Bcrypt hash the peppered password
  this.password = await bcrypt.hash(peppered, 12)
  next()
})

// Method to verify password
// Applies the same pepper before comparing with the stored bcrypt hash
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  const peppered = pepperPassword(candidatePassword)
  return await bcrypt.compare(peppered, userPassword)
}

const User = mongoose.model('User', userSchema)
export default User
