import mongoose from 'mongoose'
import { DB } from 'types'

// MongoDB connection URL
const mongoURI = process.env.MONGODB_URI

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoURI, {
        dbName: process.env.NODE_ENV === 'development' ? DB.develop : DB.production
      })
      console.info('New MongoDB Connected')
    }
    console.info('MongoDB already connected')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

export { mongoose, connectDB }
