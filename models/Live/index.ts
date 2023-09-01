import { mongoose } from 'lib/mongoose'
import { ObjectId } from 'mongodb'

export enum LastTrackStateEnum {
  En_Route = 'En_Route',
  Boarding = 'Boarding',
  Approach = 'Approach',
  Departing = 'Departing',
  On_Blocks = 'On_Blocks',
  Initial_Climb = 'Initial_Climb',
  Landed = 'Landed'
}

interface FlightState {
  name: LastTrackStateEnum
  value: Date
}

export interface ILive extends Document {
  callsign: string
  aircraftId: string
  cargoId: ObjectId
  userId: ObjectId
  status: LastTrackStateEnum
  track: FlightState[]
  isCompleted: boolean
}

const schema = 'Live'

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
    status: { type: String, enum: Object.values(LastTrackStateEnum), default: LastTrackStateEnum.Boarding },
    track: [
      {
        name: { type: String, enum: Object.values(LastTrackStateEnum), default: LastTrackStateEnum.Boarding },
        value: { type: Date, default: new Date() }
      }
    ],
    isCompleted: Boolean
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Live || mongoose.model<ILive>(schema, liveSchema)
