import User from '../models/User.js'
import mongoose from 'mongoose'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const seedAdmin = async (retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Wait for connection to be fully ready and primary elected
      if (mongoose.connection.readyState !== 1) {
        await sleep(2000)
        continue
      }

      const adminEmail = 'admin@edemy.com'
      const existingAdmin = await User.findOne({ email: adminEmail })

      if (!existingAdmin) {
        console.log(`[Seed] Super Admin not found. Creating ${adminEmail}...`)
        await User.create({
          name: 'Super Admin',
          email: adminEmail,
          password: 'admin123',
          role: 'admin'
        })
        console.log('[Seed] Super Admin created successfully!')
      } else {
        console.log(`[Seed] Super Admin (${adminEmail}) already exists.`)
      }
      return // success
    } catch (error) {
      const isNotPrimary = error.message?.includes('not primary') || error.code === 10107
      if (isNotPrimary && attempt < retries) {
        console.warn(`[Seed] Connected to secondary node — waiting for primary election (attempt ${attempt}/${retries})...`)
        await sleep(3000 * attempt) // wait longer each retry
        continue
      }
      // Non-retryable error or last attempt
      console.warn(`[Seed] Could not seed super admin: ${error.message}`)
      console.warn(`[Seed] The app will still work — admin can be created manually.`)
    }
  }
}

export default seedAdmin
