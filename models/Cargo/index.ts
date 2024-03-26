import { mongoose } from 'lib/mongoose'
import { ObjectId } from 'mongodb'
import { Cargo, CargoStatus } from 'types'

export type ICargo = Document & Cargo & { userId: ObjectId }

const cargoSchema: mongoose.Schema = new mongoose.Schema<ICargo>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    origin: {
      type: String,
      required: true
    },
    destination: {
      type: String,
      required: true
    },
    distance: {
      type: Number,
      required: true
    },
    details: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CargoDetails',
      required: true
    },
    aircraftId: {
      type: String,
      required: true
    },
    callsign: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    prize: {
      type: Number,
      required: true
    },
    score: {
      type: Number
    },
    status: {
      type: String,
      enum: Object.values(CargoStatus),
      default: CargoStatus.STARTED
    },
    remote: {
      type: Boolean,
      require: true
    },
    rewards: {
      type: Number
    },
    isRewarded: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Cargo || mongoose.model<ICargo>('Cargo', cargoSchema)
