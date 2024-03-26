import { mongoose } from 'lib/mongoose'
import { ObjectId } from 'mongodb'

// Unlock more va's by adding into this type
export type IvaoVaType = 'IVAO'
export interface VaUser {
  type: IvaoVaType
  pilotId: string
}
export interface IUser extends Document {
  id: string
  userId: string
  email: string
  address?: string
  lastLogin?: number
  role: 'user' | 'admin'
  verificationCode?: number
  verificationDate?: number
  emailVerified: boolean
  aircrafts?: ObjectId[]
  vaUser?: ObjectId
}

const userSchema: mongoose.Schema = new mongoose.Schema<IUser>(
  {
    id: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    email: {
      type: String,
      required: true,
      index: true
    },
    address: {
      type: String
    },
    lastLogin: {
      type: Number
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    verificationCode: {
      type: Number
    },
    verificationDate: {
      type: Number
    },
    emailVerified: {
      type: Boolean
    },
    aircrafts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aircraft'
      }
    ],
    vaUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VirtualAirline'
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema)
