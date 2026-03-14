import Cache from 'models/Cache'
import { connectDB } from './mongoose'

class BackendCache {
  async get(key: string): Promise<any | null> {
    try {
      await connectDB()
      const cached = await Cache.findOne({ key })
      if (!cached) return null

      // Mongoose TTL handles expiration, but double-check just in case
      if (new Date() > cached.expireAt) {
        await Cache.deleteOne({ key })
        return null
      }

      return cached.value
    } catch (error) {
      console.error('Cache Get Error:', error)
      return null
    }
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    try {
      await connectDB()
      const expireAt = new Date(Date.now() + ttlSeconds * 1000)
      
      await Cache.findOneAndUpdate(
        { key },
        { value, expireAt },
        { upsert: true, new: true }
      )
    } catch (error) {
      console.error('Cache Set Error:', error)
    }
  }
}

const cache = new BackendCache()
export default cache
