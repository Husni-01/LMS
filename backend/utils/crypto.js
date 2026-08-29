import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

const ALGORITHM = 'aes-256-cbc'

// Derive a consistent 32-byte key from the secret using SHA-256
const getKey = () => {
  const secret = process.env.AES_SECRET
  if (!secret) {
    throw new Error('[Crypto] AES_SECRET is not set in environment variables!')
  }
  return crypto.createHash('sha256').update(secret).digest()
}

/**
 * Encrypt a plaintext string using AES-256-CBC.
 * Returns a combined string: iv:encryptedData (both hex-encoded).
 */
export const encryptAES = (plaintext) => {
  const key = getKey()
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(plaintext, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  // Store IV alongside ciphertext so we can decrypt later
  return `${iv.toString('hex')}:${encrypted}`
}

/**
 * Decrypt an AES-256-CBC encrypted string.
 * Expects input format: iv:encryptedData (both hex-encoded).
 */
export const decryptAES = (ciphertext) => {
  const key = getKey()
  const [ivHex, encryptedHex] = ciphertext.split(':')

  const iv = Buffer.from(ivHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

/**
 * Create an HMAC-SHA256 hash of the password using the AES secret as key.
 * This acts as a "pepper" — a server-side secret mixed into the password
 * before bcrypt hashing. Even if the DB is stolen, hashes cannot be
 * cracked without this secret.
 *
 * Returns a hex string (64 chars) which is then fed into bcrypt.
 */
export const pepperPassword = (password) => {
  const secret = process.env.AES_SECRET
  if (!secret) {
    throw new Error('[Crypto] AES_SECRET is not set in environment variables!')
  }
  return crypto.createHmac('sha256', secret).update(password).digest('hex')
}
