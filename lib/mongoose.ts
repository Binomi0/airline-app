import mongoose from 'mongoose'

let cachedPromise: Promise<typeof import('mongoose')> | null = null

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection
  }

  if (cachedPromise) {
    return cachedPromise
  }

  const mongoURI = process.env.MONGODB_URI
  if (!mongoURI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
  }

  console.info('MongoDB Connecting...')
  cachedPromise = mongoose.connect(mongoURI, {
    dbName: process.env.MONGODB_NAME
  })

  try {
    const conn = await cachedPromise
    console.info('New MongoDB Connected')
    return conn
  } catch (error) {
    cachedPromise = null // Reset on error
    throw error
  }
}

const dbDisconnect = async () => {
  try {
    await mongoose.disconnect()
    console.info('MongoDB disconnected')
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error)
  }
}

export { mongoose, dbDisconnect }
