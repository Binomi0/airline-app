import { mongoose } from 'lib/mongoose'

const lockSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
)

// TTL Index for automatic cleanup - expiresAt will be the deletion time
lockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.Lock || mongoose.model('Lock', lockSchema)
