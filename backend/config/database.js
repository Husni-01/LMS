import mongoose from 'mongoose'

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talentraa_lms'
  
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    })

    console.log(`[MongoDB Atlas] Connected successfully: ${conn.connection.host}`)
  } catch (error) {
    console.error(`[MongoDB Atlas] Connection Error: ${error.message}`)
    console.warn(`[MongoDB Atlas] Tip: Ensure your MONGODB_URI in backend/.env has valid Atlas credentials and network IP access.`)
  }
}

export default connectDB
