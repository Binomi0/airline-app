import { mongoose } from 'lib/mongoose'
import { Atc } from 'types'

export type AtcSchema = Document & Atc

const atcSchema: mongoose.Schema = new mongoose.Schema<AtcSchema>(
  {
    time: Number,
    id: Number,
    userId: Number,
    callsign: { type: String, unique: true, index: true },
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
    },
    atcPosition: {
      airportId: String,
      atcCallsign: String,
      military: Boolean,
      middleIdentifier: Number,
      position: String,
      composePosition: String,
      regionMap: [],
      regionMapPolygon: [],
      airport: {
        icao: String,
        iata: String,
        name: String,
        countryId: String,
        city: String,
        latitude: Number,
        longitude: Number,
        military: Boolean
      }
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Atc || mongoose.model<AtcSchema>('Atc', atcSchema)
