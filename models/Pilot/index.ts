import { mongoose } from 'lib/mongoose'
import { IvaoPilot } from 'types'

export interface Pilot extends IvaoPilot {
}

const schema = 'Pilot'

const pilotSchema: mongoose.Schema = new mongoose.Schema<Pilot>(
  {
  time: Number,
  id: Number,
  userId: {type: Number, unique: true, index: true},
  callsign: String,
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
    time: Number,
  },
  flightPlan: {
    id: Number,
    revision: Number,
    aircraftId: String,
    aircraftNumber: Number,
    departureId: String,
    arrivalId: String,
    alternativeId: String,
    alternative2Id: String,
    route: String,
    remarks: String,
    speed: String,
    level: String,
    flightRules: String,
    flightType: String,
    eet: Number,
    endurance: Number,
    departureTime: Number,
    actualDepartureTime: Number,
    peopleOnBoard: Number,
    createdAt: String,
    updatedAt: String,
    aircraftEquipments: String,
    aircraftTransponderTypes: String,
    aircraft: {
      icaoCode: String,
      model: String,
      wakeTurbulence: String,
      isMilitary: Boolean,
      description: String,
    },
  },
  pilotSession: {
    simulatorId: String,
  },
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Pilot || mongoose.model<Pilot>(schema, pilotSchema)
