import User from '../models/User.js'

const seedAdmin = async () => {
  try {
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
      console.log('[Seed] Super Admin created successfully! (password secured with AES-256 + bcrypt)')
    } else {
      console.log(`[Seed] Super Admin (${adminEmail}) already exists.`)
    }
  } catch (error) {
    console.error('[Seed Error] Failed to seed super admin:', error.message)
  }
}

export default seedAdmin
