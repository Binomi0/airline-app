import mongoose from 'mongoose'

// MongoDB connection URL
const mongoURI = process.env.MONGODB_URI

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.info('MongoDB Connecting...')
      await mongoose.connect(mongoURI, {
        dbName: process.env.MONGODB_NAME
      })
      console.info('New MongoDB Connected')
    }
    console.info('MongoDB already connected')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

export { mongoose, connectDB }
