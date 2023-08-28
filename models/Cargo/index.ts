import { mongoose } from 'lib/mongoose'
import { Cargo } from 'types'

export type ICargo =  Document & Cargo

const cargoSchema: mongoose.Schema = new mongoose.Schema<ICargo>(
  {
    origin: {
      type: String,
      required: true,
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
      required: true,
    },
    aircraftId: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    callsign: {
      type: String,
      required: true
    },
    prize: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Cargo || mongoose.model<ICargo>('Cargo', cargoSchema)
