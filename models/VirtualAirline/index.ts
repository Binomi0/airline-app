import { mongoose } from 'lib/mongoose'

export enum VirtualAirlineType {
  // eslint-disable-next-line no-unused-vars
  IVAO = 'IVAO',
  // eslint-disable-next-line no-unused-vars
  VATSIM = 'VATSIM'
}
export interface IVirtualAirline extends Document {
  userId: string
  pilotId: string
  isVerified: boolean
  type: VirtualAirlineType
  accessToken?: string
  refreshToken?: string
  tokenExpiry?: Date
  lastLandedAt?: string // ICAO code
}

const virtualAirlineSchema: mongoose.Schema = new mongoose.Schema<IVirtualAirline>(
  {
    userId: {
      type: String,
      required: true,
      unique: true
    },
    isVerified: { type: Boolean, default: false },
    pilotId: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      required: true,
      enum: VirtualAirlineType
    },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiry: { type: Date },
    lastLandedAt: { type: String, uppercase: true, minlength: 4, maxlength: 4 }
  },
  {
    timestamps: false
  }
)

if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.VirtualAirline
}

export default mongoose.models.VirtualAirline || mongoose.model<IVirtualAirline>('VirtualAirline', virtualAirlineSchema)
