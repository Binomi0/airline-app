import mongoose from 'mongoose'

// MongoDB connection URL
const mongoURI = process.env.MONGODB_URI

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB Connected')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

export { mongoose, connectDB }
