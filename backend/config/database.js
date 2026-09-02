import mongoose from 'mongoose'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const shards = [
  'ac-qoe3y97-shard-00-00.dutawxb.mongodb.net',
  'ac-qoe3y97-shard-00-01.dutawxb.mongodb.net',
  'ac-qoe3y97-shard-00-02.dutawxb.mongodb.net',
]

// Connect directly to one shard and check if it is the primary
const tryDirectShard = async (user, encodedPass, shard, index) => {
  const uri = `mongodb://${user}:${encodedPass}@${shard}:27017/test?authSource=admin&tls=true&directConnection=true`
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 10000,
    directConnection: true,
  })

  // Check if this node is the primary
  const hello = await mongoose.connection.db.admin().command({ hello: 1 })
  if (!hello.isWritablePrimary && !hello.ismaster) {
    // This is a secondary — disconnect and signal to try next
    await mongoose.disconnect()
    return false
  }

  console.log(`[MongoDB Atlas] ✅ Connected to PRIMARY via shard-0${index}: ${shard}`)
  return true
}

const connectDB = async () => {
  const srvURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/talentraa_lms'
  const isAtlas = srvURI.startsWith('mongodb+srv://')

  // ── Local MongoDB (development fallback) ──────────────────────────────────
  if (!isAtlas) {
    try {
      const conn = await mongoose.connect(srvURI)
      console.log(`[MongoDB] ✅ Connected: ${conn.connection.host}`)
    } catch (err) {
      console.error(`[MongoDB] ❌ Connection failed: ${err.message}`)
    }
    return
  }

  // ── Extract credentials ───────────────────────────────────────────────────
  let user = '', pass = ''
  try {
    const match = srvURI.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/)
    if (match) { user = match[1]; pass = match[2] }
  } catch (_) {}
  const encodedPass = encodeURIComponent(pass)

  // ── Strategy 1: SRV (best, but ISP may block SRV DNS) ────────────────────
  console.log('[MongoDB Atlas] 🔄 Trying SRV auto-discovery...')
  try {
    const conn = await mongoose.connect(srvURI, { serverSelectionTimeoutMS: 8000 })
    console.log(`[MongoDB Atlas] ✅ Connected via SRV: ${conn.connection.host}`)
    return
  } catch (e) {
    console.warn(`[MongoDB Atlas] ⚠️  SRV failed: ${e.message.slice(0, 80)}`)
  }

  // ── Strategy 2: Direct connection — probe each shard to find the PRIMARY ──
  console.log('[MongoDB Atlas] 🔄 Probing shards directly to find PRIMARY...')
  for (let i = 0; i < shards.length; i++) {
    const shard = shards[i]
    try {
      console.log(`[MongoDB Atlas]    → Testing shard-0${i} (${shard})...`)
      const isPrimary = await tryDirectShard(user, encodedPass, shard, i)
      if (isPrimary) return // found and kept the primary connection
      console.log(`[MongoDB Atlas]    ↩ shard-0${i} is secondary, trying next...`)
    } catch (err) {
      console.warn(`[MongoDB Atlas]    ⚠️  shard-0${i} unreachable: ${err.message.slice(0, 70)}`)
      // Make sure mongoose is disconnected before next attempt
      try { await mongoose.disconnect() } catch (_) {}
      await sleep(500)
    }
  }

  // ── All strategies failed ─────────────────────────────────────────────────
  console.error('[MongoDB Atlas] ❌ Could not connect to any primary shard.')
  console.warn('[MongoDB Atlas] 💡 Fix: MongoDB Atlas → Network Access → Allow 0.0.0.0/0')
}

export default connectDB
