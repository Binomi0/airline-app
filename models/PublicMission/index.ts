import { mongoose } from 'lib/mongoose'
import { ObjectId } from 'mongodb'
import { MissionType, MissionCategory, PublicMission, PublicMissionStatus } from 'types'

export type IPublicMission = Document & PublicMission & { reservedBy?: ObjectId }

const publicMissionSchema: mongoose.Schema = new mongoose.Schema<IPublicMission>(
  {
    origin: {
      type: String,
      required: true,
      index: true
    },
    destination: {
      type: String,
      required: true,
      index: true
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
    weight: {
      type: Number,
      required: true
    },
    details: {
      name: { type: String, required: true },
      description: { type: String, required: true }
    },
    basePrize: {
      type: Number,
      required: true
    },
    prize: {
      type: Number,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 } // TTL index
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
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
    },
    status: {
      type: String,
      enum: Object.values(PublicMissionStatus),
      default: PublicMissionStatus.AVAILABLE,
      index: true
    },
    reservedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    reservedAt: {
      type: Date,
      default: null
    },
    startedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.PublicMission || mongoose.model<IPublicMission>('PublicMission', publicMissionSchema)
