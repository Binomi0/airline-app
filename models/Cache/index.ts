import { mongoose } from 'lib/mongoose'

export interface ICache extends Document {
  key: string
  value: any
  expireAt: Date
}

const cacheSchema = new mongoose.Schema<ICache>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    expireAt: { type: Date, required: true, index: { expires: 0 } }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Cache || mongoose.model<ICache>('Cache', cacheSchema)
