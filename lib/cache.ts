import Cache from 'models/Cache'
import { connectDB } from './mongoose'

class BackendCache {
  async get<T>(key: string): Promise<T | null> {
    try {
      await connectDB()
      const cached = await Cache.findOne({ key })
      if (!cached) return null

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

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      await connectDB()
      const expireAt = new Date(Date.now() + ttlSeconds * 1000)

      await Cache.findOneAndUpdate({ key }, { value, expireAt }, { upsert: true, returnDocument: 'after' })
    } catch (error) {
      console.error('Cache Set Error:', error)
    }
  }
}

const cache = new BackendCache()
export default cache
