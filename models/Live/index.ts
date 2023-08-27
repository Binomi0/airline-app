import { mongoose } from 'lib/mongoose'
import { ObjectId } from 'mongodb'

export interface ILive extends Document {
  email: string
  address?: string
  origin?: string
  destination?: string
  distance?: number
  details?: {
    name?: string
    description?: string
  }
  aircraftId?: string
  aircraft?: ObjectId
  weight: number
  callsign: string
  prize: number
}

const liveSchema: mongoose.Schema = new mongoose.Schema<ILive>(
  {
    email: {
      type: String,
      required: true,
      index: true
    },
    address: {
      type: String
    },
    origin: {
      type: String
    },
    destination: {
      type: String
    },
    distance: {
      type: Number
    },
    details: {
      name: {
        type: String
      },
      description: {
        type: String
      }
    },
    aircraftId: {
      type: String
    },
    aircraft: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Aircraft'
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Live || mongoose.model<ILive>('Live', liveSchema)
