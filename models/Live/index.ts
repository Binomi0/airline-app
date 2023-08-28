import { mongoose } from 'lib/mongoose'
import { ObjectId } from 'mongodb'

enum LastTrackState {
  En_Route = 'En_Route',
  Boarding = 'Boarding',
  Approach = 'Approach',
  Departing = 'Departing',
  On_Blocks = 'On_Blocks',
  Initial_Climb = 'Initial_Climb',
  Landed = 'Landed'
}

interface FlightState {
  name: string
  value: string
}

export interface ILive extends Document {
  callsign: string
  aircraftId: string
  cargoId: ObjectId
  userId: ObjectId
  status: LastTrackState
  track: FlightState[]
}

const liveSchema: mongoose.Schema = new mongoose.Schema<ILive>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    cargoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cargo',
      required: true
    },
    aircraftId: {
      type: String,
      required: true
    },
    callsign: { type: String, required: true },
    status: {
      type: String,
      enum: ['Boarding', 'Departing', 'Initial_Climb', 'En_Route', 'Approach', 'Landed', 'On_Blocks'],
      default: LastTrackState.Boarding
    },
    track: [
      {
        name: { type: LastTrackState },
        value: { type: Date },
        unique: true
      }
    ]
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Live || mongoose.model<ILive>('Live', liveSchema)
