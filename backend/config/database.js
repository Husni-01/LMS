import mongoose from 'mongoose'

// Build a direct (non-SRV) connection URI from the SRV URI.
// This bypasses ISP-level DNS SRV record blocks (common in some regions like Sri Lanka).
// The Atlas shard hostnames were previously observed in successful connections.
const buildDirectURI = (srvUri, user, pass) => {
  // Known Atlas shard nodes from previous successful connections
  const shards = [
    'ac-qoe3y97-shard-00-00.dutawxb.mongodb.net:27017',
    'ac-qoe3y97-shard-00-01.dutawxb.mongodb.net:27017',
    'ac-qoe3y97-shard-00-02.dutawxb.mongodb.net:27017',
  ]
  return `mongodb://${user}:${pass}@${shards.join(',')}/talentraa_lms?authSource=admin&replicaSet=atlas-rjdh4a&tls=true&retryWrites=true&w=majority`
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const connectDB = async () => {
  const srvURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talentraa_lms'
  const isAtlas = srvURI.startsWith('mongodb+srv://')

  // Extract credentials from the SRV URI for the direct fallback
  let user = '', pass = ''
  if (isAtlas) {
    try {
      const match = srvURI.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/)
      if (match) { user = match[1]; pass = encodeURIComponent(match[2]) }
    } catch (_) {}
  }

  const urisToTry = isAtlas
    ? [srvURI, buildDirectURI(srvURI, user, pass)]
    : [srvURI]

  const MAX_RETRIES = 3

  for (const uri of urisToTry) {
    const label = uri.startsWith('mongodb+srv') ? 'SRV (auto-discovery)' : 'Direct (shard nodes)'
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (mongoose.connection.readyState === 1) return // Already connected

        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 8000,
          connectTimeoutMS: 10000,
        })

        console.log(`[MongoDB Atlas] ✅ Connected via ${label}: ${conn.connection.host}`)
        return // Success — stop trying
      } catch (error) {
        const isLastAttempt = attempt === MAX_RETRIES
        const isLastUri = uri === urisToTry[urisToTry.length - 1]

        console.warn(`[MongoDB Atlas] ⚠️  ${label} attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`)

        if (!isLastAttempt) {
          const delay = attempt * 2000 // 2s, 4s, 6s exponential backoff
          console.log(`[MongoDB Atlas] Retrying in ${delay / 1000}s...`)
          await sleep(delay)
        } else if (!isLastUri) {
          console.log(`[MongoDB Atlas] SRV failed. Switching to Direct Connection fallback...`)
        } else {
          console.error(`[MongoDB Atlas] ❌ All connection strategies exhausted.`)
          console.warn(`[MongoDB Atlas] 💡 Fix: Go to MongoDB Atlas → Network Access → Add IP: 0.0.0.0/0`)
        }
      }
    }
  }
}

export default connectDB
