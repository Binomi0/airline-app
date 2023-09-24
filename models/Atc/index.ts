import { mongoose } from 'lib/mongoose'
import { Atc } from 'types'

export type AtcSchema = Document & Atc

const atcSchema: mongoose.Schema = new mongoose.Schema<AtcSchema>(
  {
    time: Number,
    id: Number,
    userId: Number,
    callsign: {type: String, unique: true, index: true},
    serverId: String,
    softwareTypeId: String,
    softwareVersion: String,
    rating: Number,
    createdAt: String,
    lastTrack: {
      altitude: Number,
      altitudeDifference: Number,
      arrivalDistance: Number,
      departureDistance: Number,
      groundSpeed: Number,
      heading: Number,
      latitude: Number,
      longitude: Number,
      onGround: Boolean,
      state: String,
      timestamp: String,
      transponder: Number,
      transponderMode: String,
      time: Number
    },
    atcSession: {
      frequency: Number,
      position: String
    },
    atis: {
      lines: [String],
      revision: String,
      timestamp: String
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Atc || mongoose.model<AtcSchema>('Atc', atcSchema)
