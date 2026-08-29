/**
 * One-time migration script to re-hash the Super Admin password
 * with the new AES-256 pepper + bcrypt pipeline.
 *
 * Run: node utils/rehashAdmin.js
 * Then delete this file — it's only needed once.
 */
import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import User from '../models/User.js'

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    })
    console.log('[Migration] Connected to MongoDB')

    const admin = await User.findOne({ email: 'admin@edemy.com' })
    if (admin) {
      // Delete the old record so seedAdmin recreates it with the new hash
      await User.deleteOne({ email: 'admin@edemy.com' })
      console.log('[Migration] Deleted old Super Admin. It will be re-seeded on next server start with AES-256 + bcrypt.')
    } else {
      console.log('[Migration] No Super Admin found. It will be created on next server start.')
    }

    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('[Migration Error]', err.message)
    process.exit(1)
  }
}

run()
