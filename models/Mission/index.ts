import { mongoose } from 'lib/mongoose'
import { ObjectId } from 'mongodb'
import { Mission, MissionStatus, MissionType, MissionCategory } from 'types'
import { getCallsign } from 'utils'

export type IMission = Document & Mission & { userId: ObjectId }

const missionSchema: mongoose.Schema = new mongoose.Schema<IMission>(
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
    type: {
      type: String,
      enum: Object.values(MissionType),
      default: MissionType.CARGO,
      required: true
    },
    details: {
      name: { type: String, required: true },
      description: { type: String, required: true }
    },
    aircraftId: {
      type: String,
      required: true
    },
    callsign: {
      type: String,
      unique: true,
      required: true,
      default: () => getCallsign()
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
      enum: Object.values(MissionStatus),
      default: MissionStatus.RESERVED
    },
    remote: {
      type: Boolean,
      require: true
    },
    category: {
      type: String,
      enum: Object.values(MissionCategory),
      default: MissionCategory.NORMAL,
      required: true
    },
    isSponsored: {
      type: Boolean,
      default: false
    },
    rewardMultiplier: {
      type: Number,
      default: 1.0
    },
    rewards: {
      type: Number
    },
    isRewarded: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      index: { expireAfterSeconds: 0 } // TTL index
    },
    startedAt: {
      type: Date,
      default: null
    },
    originCoords: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    destinationCoords: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    estimatedTimeMinutes: {
      type: Number
    },
    originAtcOnStart: {
      type: Boolean,
      default: false
    },
    destinationAtcOnStart: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.Mission || mongoose.model<IMission>('Mission', missionSchema)
